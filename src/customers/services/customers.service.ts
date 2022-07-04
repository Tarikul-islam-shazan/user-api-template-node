import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { Customer } from '../entities/customer.entity';
import { parse } from 'papaparse';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersRepository } from '../repositories/customers.repository';
import { json2csv } from 'json-2-csv';
import { join } from 'path';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomersRepository)
    private customersRepository: CustomersRepository,
  ) {}

  logger = new Logger('CustomersService');

  getAllCustomer(): Promise<any> {
    return this.customersRepository.getCustomers(0, 3);
  }

  async parseCustomerData(filePath): Promise<any> {
    const csvFile = readFileSync(filePath);
    const csvData = csvFile.toString();
    const parsedCsv: Customer[] = await parse(csvData, {
      header: true,
      skipEmptylLines: true,
      transfromHeader: (header) => header.toLowerCase().replace('#', '').trim(),
      complete: (results) => results.data,
    });
    const data = parsedCsv['data'];
    data.forEach((element) => {
      this.customersRepository.createCustomer(element);
    });
    return {
      message: 'Data entered',
    };
  }

  async writeCustomerDataIntoCsv(): Promise<any> {
    const dateTime = new Date()
      .toISOString()
      .slice(-24)
      .replace(/\D/g, '')
      .slice(0, 14);

    const fileName = 'customer-csv-' + dateTime + '.csv';

    const filePath = join(
      __dirname,
      '../../../',
      'files',
      'csv',
      'customersData',
      `${fileName}`,
    );

    let csv;

    const customerList = await this.customersRepository.getCustomers(0, 3);

    this.logger.verbose(
      `"L:49", "src/customers/services/customers.service.ts", customerList!`,
      JSON.stringify(customerList),
    );

    try {
      csv = json2csv(JSON.parse(JSON.stringify(customerList)), (err, csv) => {
        if (err) {
          throw err;
        }

        // write CSV to a file
        writeFileSync(filePath, csv);
      });
      this.logger.verbose(
        `"L:68", "src/customers/services/customers.service.ts", The Customer csv!`,
        csv,
      );
      return fileName;
    } catch (err) {
      this.logger.error(
        `"L:73", "src/customers/services/customers.service.ts", The Customer csv create error!`,
        err,
      );
      throw new InternalServerErrorException();
    }
  }
}
