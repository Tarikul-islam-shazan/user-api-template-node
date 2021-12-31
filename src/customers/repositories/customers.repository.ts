/* eslint-disable @typescript-eslint/ban-types */
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { Customer } from '../entities/customer.entity';

@EntityRepository(Customer)
export class CustomersRepository extends Repository<Customer> {
  logger = new Logger('CustomersRepository');

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<object> {
    try {
      const { customerId, userId, street, state, city, zip } =
        createCustomerDto;

      const newCustomer = this.create({
        customerId,
        userId,
        street,
        state,
        city,
        zip,
      });

      const ifCustomerExists = await this.findOne({
        userId: newCustomer.userId,
      });

      if (ifCustomerExists) {
        throw new BadRequestException('The Customer already exists!');
      }

      await this.save(newCustomer);

      const newValidCustomer = {
        customerId: newCustomer.customerId,
        userId: newCustomer.userId,
        street: newCustomer.street,
        state: newCustomer.state,
        city: newCustomer.city,
        zip: newCustomer.zip,
      };
      console.log(newValidCustomer);

      this.logger.verbose(
        `"L:54", "src/customers/repositories/customers.repository.ts", A new customer is created! Data: ${JSON.stringify(
          newValidCustomer,
        )}`,
      );

      return newValidCustomer;
    } catch (err) {
      this.logger.error(
        `"L:62", "src/customers/repositories/customers.repository.ts", The Customer create error occured!`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
