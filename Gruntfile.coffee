# vim:softtabstop=4:shiftwidth=4

exports = module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON "package.json"
        jshint:
            options:
                bitwise: true
                immed: true
                latedef: true
                noarg: true
                nonew: true
                undef: true
                unused: true
                strict: true
                browser: true
                globalstrict: true
                node: true
                globals:
                    define: false
            all: [
                "frontend/main.js",
                "frontend/dispatch.js",
                "frontend/config.js",
                "frontend/tilesets/*.js",
                "scripts/**/*.js",
                "server.js",
                "server/**/*.js"
            ]

    grunt.registerTask "default", ["jshint"]

    grunt.loadNpmTasks "grunt-contrib-jshint"
