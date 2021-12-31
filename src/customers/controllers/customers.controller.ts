import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { csvFileFilter, editFileName } from '../utils/csvFileUpload.utils';
import { diskStorage } from 'multer';
import { CustomersService } from '../services/customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/csv',
        filename: editFileName,
      }),
      fileFilter: csvFileFilter,
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.customersService.parseCustomerData(
      `./files/csv/${file.filename}`,
    );
  }
}
