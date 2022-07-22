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
    ssl: {
      rejectUnauthorized: false
    }
  }
}

