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

      this.logger.verbose(
        `"L:50", "src/customers/repositories/customers.repository.ts", A new customer is created! Data: ${JSON.stringify(
          newValidCustomer,
        )}`,
      );

      return newValidCustomer;
    } catch (err) {
      this.logger.error(
        `"L:58", "src/customers/repositories/customers.repository.ts", The Customer create error occured!`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getCustomers(
    skip: number,
    limit: number,
    //requestingUser: User,
  ): Promise<any> {
    try {
      skip = skip ? skip : 0;
      limit = limit ? limit : 2;

      const customerList = await this.find({
        skip: skip,
        take: limit,
      });

      if (customerList.length === 0) {
        this.logger.log(
          `"L:80", "src/customers/repositories/customers.repository.ts", No data to show!`,
        );
        return 'There are no customers to show!';
      }

      this.logger.verbose(
        `"L:86", "src/customers/repositories/customers.repository.ts", Customers' list is loaded! Data: ${JSON.stringify(
          customerList,
        )}`,
      );

      return customerList.map((customer) => ({
        id: customer._id,
        customerId: customer.customerId,
        userId: customer.userId,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
      }));
    } catch (err) {
      this.logger.error(
        `"L:101", "src/customers/repositories/customers.repository.ts", Failed to load the users list`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
