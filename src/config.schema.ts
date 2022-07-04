import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  APP_PORT: Joi.string().required(),
  FILE_PATH: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  APP_ID: Joi.string().required(),
  APP_SECRET: Joi.string().required(),
});
