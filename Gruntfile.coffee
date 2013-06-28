# vim:softtabstop=4:shiftwidth=4

exports = module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON "package.json"
        jshint:
            options:
                jshintrc: ".jshintrc"
            all: [
                "frontend/main.js",
                "frontend/dispatch.js",
                "frontend/config.js",
                "frontend/tilesets/*.js",
                "shared/**/*.js",
                "server.js",
                "server/**/*.js"
            ]

    grunt.registerTask "default", ["jshint"]

    grunt.loadNpmTasks "grunt-contrib-jshint"
