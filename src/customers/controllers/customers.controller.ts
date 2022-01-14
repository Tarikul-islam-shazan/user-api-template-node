import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { csvFileFilter, editFileName } from '../utils/csvFileUpload.utils';
import { diskStorage } from 'multer';
import { CustomersService } from '../services/customers.service';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
  @Get()
  getAll() {
    return this.customersService.getAllCustomer();
  }

  @Get('writeCsv')
  writeCsvData() {
    return this.customersService.writeCustomerDataIntoCsv();
  }

  @Get('getCsv/:csv')
  getCsvfile(@Param('csv') csvFileName: string) {
    const file = createReadStream(
      join(
        process.cwd(),
        `${process.env.CSV_FILE_PATH}/customersData/${csvFileName}`,
      ),
    );
    return new StreamableFile(file);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.CSV_FILE_PATH, //'./files/csv',
        filename: editFileName,
      }),
      fileFilter: csvFileFilter,
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.customersService.parseCustomerData(
      `${process.env.CSV_FILE_PATH}/${file.filename}`,
    );
  }
}
