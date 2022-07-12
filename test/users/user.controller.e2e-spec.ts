import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { DatabaseModule } from './../../src/database/database.module';
import { generateTestUserToken } from './helper';

const createUserBody = {
    firstName: "string",
    lastName: "string",
    email: "test@test.com",
    profileImagePath: "string",
    password: "string",
    role: "user"
  }
const id = "user-id"
const payload = {id, name:"test"}
const token = generateTestUserToken(payload)


describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /users', () => {
    it('should save and return user data', async () => {
      const getresult = await request(app.getHttpServer())
        .post('/users')
        .send(createUserBody) 
        .expect(200);
    }, 30000);
  });

  describe('GET /users', () => {
    it('should return user data', async () => {
      const getresult = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200); 
    }, 30000);
  });
  
  
  describe('PATCH /users/id', () => {
    it('should update and return user data', async () => {
      const getresult = await request(app.getHttpServer())
        .patch(`/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    }, 30000);
  });
});
