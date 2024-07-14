require('dotenv/config');

module.exports = {
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  autoLoadEntities: true,
  entities: [
    'dist/shared/entities/**/*.entity.js',
    // process.env.APP_ENV === 'development'
    //   ? 'src/shared/entities/**/*.entity.ts'
    //   : 'dist/shared/entities/**/*.entity.js',
  ],
  migrations: [
    'dist/migrations/*.js',
    // process.env.APP_ENV === 'development'
    //   ? 'src/migrations/*.ts'
    //   : 'dist/migrations/*.js',
  ],
  cli: {
    entitiesDir: 'src/shared/entities',
    migrationsDir: 'src/migrations',
  },
  extra: {
    timezone: '+09:00',
  },
};
