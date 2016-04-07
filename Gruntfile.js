'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // shell commands for use in Grunt tasks
        shell: {
            jekyllBuild: {
                command: 'jekyll build'
            },
            jekyllServe: {
                command: function(host, port) {
                    return 'jekyll serve --detach --host=' + host + ' --port=' + port;
                }
            },
            jekyllDev: {
                command: function(host, port) {
                    return 'jekyll serve --host=' + host + ' --port=' + port;
                }
            }
        },

        sass: {
            options: {
                sourceMap: true,
                relativeAssets: false,
                outputStyle: 'expanded',
                sassDir: '_sass',
                cssDir: '_site/css'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '_sass/',
                    src: ['**/*.{scss,sass}'],
                    dest: '_site/css',
                    ext: '.css'
                }]
            }
        },

        concurrent: {
            serve: [
                'sass',
                'watch',
                'shell:jekyllDev:0.0.0.0:4000'
            ],
            options: {
                logConcurrentOutput: true
            }
        },

        watch: {
            sass: {
                files: ['_sass/**/*.{scss,sass}'],
                tasks: ['sass']
            }
        },

        copy: {
            bootstrap: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap-sass/assets/javascripts/',
                        src: ['bootstrap.min.js'],
                        dest: '_site/js'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap-sass/assets/fonts',
                        src: ['bootstrap/**'],
                        dest: '_site/fonts'
                    }
                ]
            },
            jquery: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/jquery/dist/',
                        src: ['jquery.min.js'],
                        dest: '_site/js'
                    }
                ]
            }
        },

    });

    grunt.registerTask('dev', 'concurrent:serve');

    grunt.registerTask('serve', function() {
        var host = grunt.option('host');
        var port = grunt.option('port');

        if(!host) {
            host = '0.0.0.0';
        }

        if(!port) {
            port = '4000';
        }
        
        grunt.task.run('build', 'shell:jekyllServe:' + host + ':' + port);
    });

    grunt.registerTask('build', [
        'sass',
        'copy',
        'shell:jekyllBuild'
    ]);

};
