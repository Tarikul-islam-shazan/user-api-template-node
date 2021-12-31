import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { Customer } from '../entities/customer.entity';
import { parse } from 'papaparse';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomersRepository } from '../repositories/customers.repository';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomersRepository)
    private customersRepository: CustomersRepository,
  ) {}

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
}
