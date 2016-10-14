module.exports = {
  facebook: {
    FACEBOOK_APP_ID: 'YOUR_FACEBOOK_APP_ID',
    FACEBOOK_APP_SECRET: 'YOUR_FACEBOOK_APP_SECRET'
  },
  aws: {
    AWS_ACCESS_KEY_ID: 'AWS_ACCESS_KEY_ID',
    AWS_SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
    AWS_REGION: 'AWS_REGION'
  },
  db: {
    dev: {
      username: 'ubuntu',
      password: 'password',
      host: 'localhost',
      port: '5432',
      dbName: 'pickynotes'
    },
    production: {
      username: 'POSTGRES_PRODUCTION_USERNAME',
      password: 'POSTGRES_PRODUCTION_PASSWORD',
      host: 'POSTGRES_PRODUCTION_HOST',
      port: 'POSTGRES_PRODUCTION_PORT',
      dbName: 'POSTGRES_PRODUCTION_DBNAME'
    },
    client: {
      username: 'POSTGRES_CLIENT_USERNAME',
      password: 'POSTGRES_CLIENT_PASSWORD',
      host: 'POSTGRES_CLIENT_HOST',
      port: 'POSTGRES_CLIENT_PORT',
      dbName: 'POSTGRES_CLIENT_DBNAME'
    },
    test: {
      username: 'ubuntu',
      password: 'password',
      host: 'localhost',
      port: '5432',
      dbName: 'pickynotes'
    }
  },
};
