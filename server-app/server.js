const APP_CONFIG = require('./config/config')
const SITE_CONFIG = require('./config/site-config')

const fastify = require('fastify')(APP_CONFIG.fastifyOptions)
const fastifyStatic = require('fastify-static')
const fastifyFormBody = require('fastify-formbody')
const fastifySession = require('fastify-session')
const MySQLSessionStore = require('express-mysql-session')(fastifySession)
const fastifyCookie = require('fastify-cookie')
const fastifyCors = require('fastify-cors')
const fastifyMultipart = require('fastify-multipart')
const fastifyURLData = require('fastify-url-data')
const fastifyHelmet = require('fastify-helmet')
const pointOfView = require('point-of-view')
const path = require('path')
const ejs = require('ejs')
const fastifyIO = require('fastify-socket.io')
const fastifyCSRF = require('fastify-csrf')

const mysqldb = require('./db/mysqldb')
const directory = require('./lib/directory')
const SocketIO = require('./lib/socket-io')
const session = require('./lib/session')


// NOTE: register socketIO
fastify.register(fastifyIO)

// NOTE: set cache control value according to logger
let cacheControlValue = 'public, max-age=300'
if (APP_CONFIG.fastifyOptions.logger)
  cacheControlValue = 'no-cache'

// NOTE: modules
const websiteRouter = require('./module/website/router')
const userProfile = require('./module/profile/router')
const userRouter = require('./module/user/router')
const sessionRouter = require('./module/session/router')
const fileRouter = require('./module/file/router')
const resourceRouter = require('./module/resource/router')
const roleRouter = require('./module/role/router')
const languageRouter = require('./module/language/router')
const searchRouter = require('./module/search/router')
const notificationRouter = require('./module/notification/router')

// create static directory for uploads
directory.createFolderFromPath(APP_CONFIG.uploadDirectory)
// create static directory for upload image sizes
directory.createFolderFromPath(`${ APP_CONFIG.uploadDirectory }sizes/`)

// NOTE: db connection and session store
const connection = mysqldb.getPoolConnection()
const sessionStore = new MySQLSessionStore({
    host: APP_CONFIG.mariaDB.host,
    port: 3306,
    user: APP_CONFIG.mariaDB.user,
    password: APP_CONFIG.mariaDB.password,
    database: APP_CONFIG.mariaDB.db_name,
    createDatabaseTable: true,
    connectionLimit: 1,
    expiration: 86400000,
    checkExpirationInterval: 900000,
    clearExpired: true,
    endConnectionOnClose: true,
	  charset: 'utf8mb4_bin',
    schema: {
      tableName: 'session',
      columnNames: {
        session_id: 'session_id',
  			expires: 'expires',
  			data: 'data',
      }
    },
  },
  connection)

fastify.register(fastifyCookie, {
  secret: APP_CONFIG.appSecret,
  parseOptions: {},
})

fastify.register(fastifySession, {
  secret: APP_CONFIG.appSecret,
  cookie: {
    maxAge: APP_CONFIG.sessionMaxAge,
    expires: APP_CONFIG.sessionMaxAge,
    domain: APP_CONFIG.domain,
    secure: false,
  },
  store: sessionStore,
  saveUninitialized: true,
})

// body parse
fastify.register(fastifyFormBody)

// cors
fastify.register(fastifyCors, {
  origin: APP_CONFIG.domain,
})

// security headers
fastify.register(fastifyHelmet, {
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'", "'unsafe-inline'"],
      'connect-src': ["*", "'unsafe-inline'", `blob:`, `ws://${ APP_CONFIG.domain }`],
      'frame-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", "'unsafe-inline'", "*", "data:", "blob:"],
      'manifest-src': ["'self'", "'unsafe-inline'"],
      'media-src': ["'self'", "'unsafe-inline'"],
      'object-src': ["'self'", "'unsafe-inline'"],
      'script-src': ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "'unsafe-eval'", APP_CONFIG.domain, "https://cdn.socket.io"],
      'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      'worker-src': ["'self'", "'unsafe-inline'", "blob:"],
      'style-src-attr': ["'self'", "'unsafe-inline'"],
      'script-src-elem': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://cdn.socket.io"],
      'style-src-elem': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://cdn.socket.io"],
      'font-src': ["'self'", "'unsafe-inline'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
      'script-src-attr': ["'self'", "'unsafe-inline'"],
    },
  },
})

// CSRF
fastify.register(fastifyCSRF, {
  cookie: {
    path: '/',
    domain: APP_CONFIG.domain,
  },
})

// template engine
fastify.register(pointOfView, {
  engine: {
    ejs: ejs,
  },
  options: {
    filename: path.resolve('server-app/view'),
  },
  templates: 'server-app/view',
  includeViewExtension: true,
})

// storage directory
fastify.register((instance, opts, next) => {
  instance.register(fastifyStatic, {
    root: path.join(__dirname, `/${ APP_CONFIG.staticFilesPath }`),
    prefix: `/${ APP_CONFIG.staticFilesPrefix }`,
  })
  next()
})

// static directory
fastify.register((instance, opts, next) => {
  instance.register(fastifyStatic, {
    root: path.join(__dirname, `/../${ APP_CONFIG.staticUploadPath }`),
    prefix: `/${ APP_CONFIG.staticUploadPrefix }`,
  })
  next()
})

// multipart data for upload files
fastify.register(fastifyMultipart)

// support for getting raw URL information from the request
fastify.register(fastifyURLData)

// router website dashboard api
fastify.register(sessionRouter, { prefix: '/dashboard/api/v1/' })
fastify.register(userProfile, { prefix: '/dashboard/api/v1/' })
fastify.register(userRouter, { prefix: '/dashboard/api/v1/' })
fastify.register(fileRouter, { prefix: '/dashboard/api/v1/' })
fastify.register(resourceRouter, { prefix: '/dashboard/api/v1/' })
fastify.register(roleRouter, { prefix: '/dashboard/api/v1/' })
fastify.register(languageRouter, { prefix: '/dashboard/api/v1/' })
fastify.register(searchRouter, { prefix: '/dashboard/api/v1/' })
fastify.register(notificationRouter, { prefix: '/dashboard/api/v1/' })

// router website
fastify.register(websiteRouter)


// prehandler for authentication validation
fastify.addHook('preHandler', async (req, res) => {
  res.raw.setHeader('Cache-Control', cacheControlValue)
  res.raw.setHeader('Service-Worker-Allowed', '/')
  // NOTE: improve this
  let urlData = req.urlData()
  let staticFileRegex = '/storage/[a-z0-9]+/'
  let resStorageMatch = urlData.path.match(staticFileRegex)
  if (resStorageMatch !== null) {
    await session.isAuthenticated(req, res)
    if (req.session.user === undefined)
      await res.view(`${ req.session.dashboard }/dashboard-login`, {
        title: APP_CONFIG.appName,
        error_message: 'permission denied',
        generateCsrf: await res.generateCsrf(),
        host_url: APP_CONFIG.hostURL,
        app_url: APP_CONFIG.appURL,
      })
    else
      await res.code(404).view('404', {
        title: 'webcms',
        status: 'resource not found' + urlData.path.toString(),
        error_message: `Route: ${ urlData.path } not found.`,
      })
  }
})

// hook for set cookie data
fastify.addHook('onSend', async (request, reply, payload) => {
  reply.raw.setHeader('Server', 'WebCMS')
  reply.raw.setHeader('X-Powered-By', 'WebCMS/1.0.0')
  reply.setCookie('csrf-token', await reply.generateCsrf(), {
    path: '/',
    domain: APP_CONFIG.domain,
    signed: true,
  })
  if (request.session !== null && request.session.user !== undefined) {
    reply.setCookie('user_id', request.session.user.user_id, {
      path: '/',
      domain: APP_CONFIG.domain,
      signed: true,
    })
  }
  return payload
})

// 500 global handler
fastify.setErrorHandler((err, req, res) => {
  req.log.warn(err)
  let statusCode = err.statusCode >= 400 ? err.statusCode : 500
  res.code(statusCode).view('500', {
    title: SITE_CONFIG.siteTitle,
    status: 'Server error!',
    error_message: statusCode >= 500 ? 'Internal server error' : err.message,
  })
})

// 404 global handler
fastify.setNotFoundHandler((req, res) => {
  const urlData = req.urlData()
  res.code(404).view('404', {
    title: SITE_CONFIG.siteTitle,
    status: 'Page not found',
    error_message: `Route: ${ urlData.path } Not found.`,
  })
})

// listener
fastify.listen(APP_CONFIG.port, APP_CONFIG.ipAddressToListen, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info('== Server listening on port ==', address)
})




// socket.io instance

const socketIO = new SocketIO()
fastify.decorateReply('pushBroadcastMessage', payload => {
  socketIO.pushBroadcastMessage(payload)
})
fastify.decorateReply('pushMessageToSessionIds', payload => {
  socketIO.pushMessageToSessionIds(payload)
})
fastify.ready().then(() => {
  socketIO.init(fastify.io, fastify)
})
