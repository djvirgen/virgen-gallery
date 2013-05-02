express = require 'express'
http = require 'http'
path = require 'path'
stylus = require 'stylus'
connectCoffeeScript = require 'connect-coffee-script'
cachify = require 'connect-cachify'
app = express()

app.configure ->
  app.set "port", process.env.PORT or 3000
  app.set "views", path.join(__dirname, "views")
  app.set "view engine", "jade"
  app.use express.favicon()
  app.use express.logger("dev")
  app.use express.bodyParser()
  app.use express.methodOverride()

  assets =
    '/javascripts/app.min.js': [
      '/javascripts/app/gallery/main.js'
      '/javascripts/app/app.js'
    ]

  app.use cachify.setup assets,
    root: "#{__dirname}/public"
    production: false

  app.use stylus.middleware
    src: path.join(__dirname, 'assets')
    dest: path.join(__dirname, 'public')
    compile: (str, path, fn) ->
      stylus(str)
      .set('filename', path)
      .set('compress', true)

  app.use connectCoffeeScript
    src: path.join(__dirname, 'assets')
    dest: path.join(__dirname, 'public')

  app.use express.static path.join(__dirname, 'public')

  app.use app.router

app.configure 'development', ->
  app.use express.errorHandler()

app.get '/templates/:name.tpl', (req, res) ->
  res.render "templates/#{req.params.name}"

app.get '*', (req, res) ->
  res.render 'index'

http.createServer(app).listen app.get('port'), ->
  console.log "Express server listening on port #{app.get('port')}"
