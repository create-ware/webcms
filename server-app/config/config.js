const APP_CONFIG = {
  port: 80,
  bcryptSaltRounds: 12,
  appSecret: 'iCD5e@rx$3-9rR_QZwIW2Dg-Zn^h&heS', // 32 characters
  staticUploadPath: 'site-static',
  staticUploadPrefix: 'storage',
  uploadDirectory: 'storage/uploads/',
  staticFilesPath: 'static',
  staticFilesPrefix: 'static',
  sessionMaxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
  ipAddressToListen: process.env.WEBCMS_HOST_IP, // 0.0.0.0 for docker container
  domain: process.env.WEBCMS_DOMAIN, // localhost \ ip address \ domain.com
  hostURL: `${ ((process.env.WEBCMS_LOGS === '1')?'http://www.':'https://www.') }${ process.env.WEBCMS_DOMAIN }`,
  appURL: `${ ((process.env.WEBCMS_LOGS === '1')?'http://':'https://') }${ process.env.WEBCMS_APP_DOMAIN }`,
  appLogs: ((process.env.WEBCMS_LOGS === '0')?false:true),
  fastifyOptions: {
    http2: false,
    https: null,
    ignoreTrailingSlash: true,
    logger: ((process.env.WEBCMS_LOGS === '0')?false:true),
  },
  socketIOOptions: {
    // path: process.env.WEBCMS_DOMAIN,
    socketIOpingTimeout: 60000,
    pingInterval: 10000,
    pingTimeout: 5000,
  },
  emailOptions: {
    emailService: process.env.WEBCMS_EMAIL_SERVICE,
    emailAccount: process.env.WEBCMS_EMAIL_ACCOUNT,
    emailAccountPassword: process.env.WEBCMS_EMAIL_PASSWORD,
  },
  mariaDB: {
    host: process.env.WEBCMS_MARIADB_SERVICE_IP,
    user: process.env.WEBCMS_MARIADB_USER,
    password: process.env.WEBCMS_MARIADB_PASSWORD,
    db_name: process.env.WEBCMS_MARIADB_DB_NAME,
    connectionLimit: 50,
  },
}

module.exports = APP_CONFIG
