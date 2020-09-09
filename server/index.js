import createError from 'http-errors'
import cookieParser from 'cookie-parser'
import express from 'express'
import http from 'http'
import morgan from 'morgan'
import path from 'path'
import sassMiddleware from 'node-sass-middleware'

import homeRoutes from './routes/home'
import { initConfig, config as appConfig } from './config'
import { initLogger, log } from './log'

async function init() {
  initConfig()
  initLogger()
}

export default init()
  .then(() => {
    const app = express()

    app.use(morgan('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())

    // View Engine
    app.set('views', path.join(__dirname, 'templates'))
    app.set('view engine', 'ejs')

    app.use(sassMiddleware({
      src: path.join(__dirname, 'static'),
      dest: path.join(__dirname, 'static'),
      indentedSyntax: false,
      sourceMap: true
    }))

    app.use(express.static(path.join(__dirname, 'static')))

    app.use('/', homeRoutes)

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      next(createError(404))
    })

    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message
      res.locals.error = req.app.get('env') === 'development' ? err : {}

      // render the error page
      res.status(err.status || 500)
      res.render('error')
    })

    app.disable('x-powered-by')

    // Create Server
    const server = http.createServer(app)

    app.set('port', appConfig.PORT)
    server.listen(appConfig.PORT, () => log.info(`Listening on ${appConfig.PORT}`))
  })
