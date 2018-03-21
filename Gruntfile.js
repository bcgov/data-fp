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
            },
            nodeSass: {
                command: function() {
                    return 'node-sass -q --source-map true --source-map-contents true --output /app/_site/css/ /app/_sass/main.scss'
                }
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
                files: ['_sass/**/*.scss'],
                tasks: ['sass']
            }
        },

        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'node_modules/bootstrap-sass/assets/javascripts/',
                    src: ['bootstrap.min.js', ],
                    dest: '_site/js/'
                }, {
                    expand: true,
                    cwd: 'node_modules/bootstrap-sass/assets/fonts/',
                    src: ['bootstrap/**'],
                    dest: '_site/fonts/'
                }, {
                    expand: true,
                    cwd: 'node_modules/jquery/dist/',
                    src: ['jquery.min.js'],
                    dest: '_site/js/'
                }]
            }
        }
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
        'makeconfig',
        'shell:jekyllBuild',
        'copy',
        'shell:nodeSass',
    ]);

    grunt.registerTask('makeconfig', 'Creates a _config.yml file from the config template', function() {
        var YAML = require('yamljs');
        var config = YAML.load('_config.template.yml');

        var url = grunt.option('url');

        if(url) {
            config.url = url;
        }

        grunt.file.write('_config.yml', YAML.stringify(config));
    });

};
