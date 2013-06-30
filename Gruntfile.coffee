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
        requirejs:
            compile:
                options:
                    baseUrl: './shared'
                    out: 'frontend/application.build.js',
                    mainConfigFile: 'frontend/main.js',
                    name: 'application',
                    paths:
                        'socket.io': 'empty:'

    grunt.loadNpmTasks "grunt-contrib-jshint"
    grunt.loadNpmTasks "grunt-contrib-requirejs"

    grunt.registerTask "default", ["jshint"]
    grunt.registerTask 'build', ['requirejs']
