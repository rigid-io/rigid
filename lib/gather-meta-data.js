var fs = require('fs')
var frontmatter = require('html-frontmatter')
var concat = require('concat-stream')
var slugify = require('slugify')

var readdirCb = function(cb, p, err, files) {
  if(err) return cb(err)

  waitForIt = 0
  var metadataArr = []
  files.forEach(function(file) {
    var parts = file.split('.')
    var extension = parts[parts.length - 1]

    if (Object.keys(this.extensions).indexOf(extension) === -1) return

    waitForIt++
    fs.createReadStream(this.path + '/' + this.config.siteDir + '/' + p + file)
      .pipe(concat(function(contents) {
        var metadata = frontmatter(contents.toString())
        metadata.absPath = this.path + '/' + this.config.siteDir + '/' + p + file

        if (!metadata.slug && !metadata.home)
          metadata.slug = slugify(metadata.title)

        var finish = function() {
          metadataArr.push(metadata)
          if (waitForIt === 0) cb(null, metadataArr)
        }.bind(this)

        var childrenPath = this.path + '/' + this.config.siteDir + '/' + p + metadata.slug
        fs.exists(childrenPath, function(exists) {
          waitForIt--
          if (true === exists) {
            metadata.children = []
            fs.readdir(childrenPath, readdirCb.bind(this, function(err, m) {
              metadata.children = m
              finish()
            }.bind(this), metadata.slug + '/'))
            return
          }

          finish()
        }.bind(this))
      }.bind(this)))
  }.bind(this))
}

module.exports = function(cb) {
  fs.readdir(this.path + '/' + this.config.siteDir, readdirCb.bind(this, cb, ''))
}
