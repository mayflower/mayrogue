exports = module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    jshintrc:
      bitwise: true
      immed: true
      latedef: true
      noarg: true
      nonew: true
      undef: true
      unused: true
      strict: true
      browser: true
      globals:
        define: false
    jshint:
      all: [
        "frontend/main.js",
        "frontend/dispatch.js",
        "frontend/tilesets/*.js",
        "scripts/**/*.js"
      ]

  grunt.registerTask('default', ['jshint']);

  grunt.loadNpmTasks 'grunt-contrib-jshint'