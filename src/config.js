import dotenv from 'dotenv';
dotenv.config();

/*
export const setConfig = {
  production: {
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.PASSWORD,
    port: process.env.DBPORT,
    ssl: {
      rejectUnauthorized: false
    }
  },
  development: {
    user: process.env.DEVUSER,
    host: process.env.DEVHOST,
    database: process.env.DEVDB,
    password: process.env.DEVPWD,
    port: process.env.DEVPORT,
  }
}
*/

export const mongoConfig = {
  production: {
    driver: process.env.DBDRIVER,
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
  },
  development: {
    driver: process.env.DBDRIVER,
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    password: process.env.DBPWD,
  }
};
