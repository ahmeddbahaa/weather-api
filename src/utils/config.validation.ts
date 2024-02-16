import { config } from 'dotenv';
import { existsSync } from 'fs';

if (existsSync('.env')) {
  config();
}

const requiredEnvVariables = ['DB_USERNAME', 'DB_PASSWORD', 'WEATHER_API_KEY'];

requiredEnvVariables.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Environment variable ${variable} is not set`);
  }
});