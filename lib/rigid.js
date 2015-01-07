var EventEmitter = require('events').EventEmitter
var inherits = require('util').inherits
var parseConfig = require('rigid-parse-config')
var gather = require('./gather-meta-data')
var fs = require('fs')

inherits(Rigid, EventEmitter)

function Rigid(path) {
  this.extensions = {}
  this.path = path
  this.config = null
  this.initialized = false
  this.indexStreams = []
  this.siteStreams = []
}

Rigid.prototype.init = function(cb) {
  var p = this.path || process.cwd()
  parseConfig(p + '/rigid.json', function(err, o) {
    if (err) throw new Error(err)

    this.initialized = true

    this.config = o
    return cb.call(this)
  }.bind(this))
}

Rigid.prototype.registerExtension = function(ext, handler) {
  this.extensions[ext] = handler
}

Rigid.prototype.registerPlugin = function(plugin) {
  if (plugin.indexStream) this.indexStreams.push(plugin.indexStream)
  if (plugin.siteStream) this.siteStreams.push(plugin.siteStream)
}

Rigid.prototype.generateSite = function(cb) {
  if (!this.initialized) return this.init(generateSite.bind(this, cb))

  generateSite.call(this, cb)
}

Rigid.prototype.prepareIndexStreamPipeline = function(inputFile) {
  var lastStream = fs.createReadStream(inputFile).pipe(indexHandler(metadata))
  this.indexStreams.map(function(s) {
    var stream = s()
    lastStream = lastStream.pipe(stream)
  })
  return lastStream
}

Rigid.prototype.prepareSiteStreamPipeline = function(inputFile) {
  var parts = inputFile.split('.')
  var ext = parts[parts.length - 1]
  var handler = this.extensions[ext]

  return fs.createReadStream(inputFile).pipe(handler)
}

module.exports = Rigid

function generateSite(cb) {
  gather.call(this, function(err, metadata) {
    if(err) return cb(err)

    var home = null
    var sites = []
  })
}
