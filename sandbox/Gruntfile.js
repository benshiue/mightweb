/**
Copyright (C) 2013 Moko365 Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        FOREVER_DIR: '${HOME}/.forever',
        PIDFILE: '<%=FOREVER_DIR%>/<%= pkg.name %>.pid',
        LOGFILE: '<%=FOREVER_DIR%>/<%= pkg.name %>.log',
        watch: {
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile']
            },
            css: {
                files: ['sass/*.sass', 'sass/modules/course/*.sass', 'public/views/*/*.css'],
                tasks: ['sass', 'macreload']
            },
            js: {
                files: 'public/js/*.js',
                tasks: ['test', 'macreload']
            },
            api: {
                files: ['views/api/*.js'],
                tasks: ['macreload']
            },
            less: {
                files: ['less/Flat-UI-Pro-1.2.3/less/*.less', 'less/Flat-UI-Pro-1.2.3/less/modules/*.less',
                        'public/openmind/css/*.less'],
                tasks: ['less']
            },
            jade: {
                files: ['views/*/*.jade'],
                tasks: ['macreload']
            }
        },
        uglify: {
            application: {
                files: {
                    'public/js/app.min.js': [
                        'public/vendor/jquery/jquery.js',
                        'public/vendor/bootstrap/dist/js/bootstrap.js',
                        'public/js/jquery.ui.touch-punch.min.js',
                        'public/js/flatui-checkbox.js',
                        'public/js/flatui-radio.js',
                        'public/js/notify.js',
                        'public/js/notify-bootstrap.js',
                        'public/js/jquery.tagsinput.js',
                        'public/js/jquery.placeholder.js',
                        'public/js/jquery.stacktable.js',
                        'public/vendor/jquery-waypoints/waypoints.min.js',
                        'public/js/h762plus.prototype.js',
                        'public/js/video.js',
                        'public/js/qrcode.js',
                        'public/js/jquery.videoplayer.js',
                        'public/vendor/underscore/underscore-min.js',
                        'public/vendor/backbone/backbone-min.js',
                        'public/vendor/momentjs/min/moment.min.js',
                        'public/vendor/showdown/src/showdown.js',
                        'public/layouts/core.js',
                        'public/buttons/course.json.js',
                        'public/js/google-analytics.js'
                    ]
                }
            },
/*
            layouts: {
                files: {
                    'public/layouts/core.min.js': [
                        'public/vendor/jquery/jquery.js',   // jQuery v2.0.3
                        'public/vendor/underscore/underscore.-minjs',
                        'public/vendor/backbone/backbone.0.9.2.js',
                        'public/vendor/bootstrap/js/affix.js',
                        'public/vendor/bootstrap/js/alert.js',
                        'public/vendor/bootstrap/js/button.js',
                        'public/vendor/bootstrap/js/carousel.js',
                        'public/vendor/bootstrap/js/collapse.js',
                        'public/vendor/bootstrap/js/dropdown.js',
                        'public/vendor/bootstrap/js/modal.js',
                        'public/vendor/bootstrap/js/tooltip.js',
                        'public/vendor/bootstrap/js/popover.js',
                        'public/vendor/bootstrap/js/scrollspy.js',
                        'public/vendor/bootstrap/js/tab.js',
                        'public/vendor/bootstrap/js/transition.js',
                        'public/vendor/momentjs/moment.js',
                        'public/layouts/core.js'
                    ],
                    'public/layouts/ie-sucks.min.js': [
                        'public/vendor/html5shiv/dist/html5shiv.js',
                        'public/vendor/respond/src/respond.js'
                    ],
                    'public/layouts/admin.min.js': ['public/layouts/admin.js']
                }
            }
*/
        },
        uglify_iptv: {
            dist: {
                files: {
                    'public/js/all.min.js': [
                            'public/js/h762plus.prototype.js',
                            'public/js/video.js',
                            'public/js/jquery.videoplayer.js',
                            'public/js/main.js'
                        ]
                }
            }
        },
        jshint: {
            gruntfile: ['Gruntfile.js'],
            client: {
                options: {
                    jshintrc: '.jshintrc-client',
                    ignores: [
                            'public/layouts/**/*.min.js',
                            'public/views/**/*.min.js'
                        ]
                },
                src: [
                    'public/layouts/**/*.js',
                    'public/views/**/*.js'
                ]
            },
            server: {
                options: {
                    jshintrc: '.jshintrc-server'
                },
                src: [
                    'schema/**/*.js',
                    'views/**/*.js'
                ]
            }
        },
        sass: {
            dev: {
                options: {
                    style: 'expanded', // nested, compact, compressed, expanded
                    noCache: true
                },
                files: {
                    'public/css/style.css': 'sass/style.sass',
                    'public/css/course-footer.css': 'sass/course-footer.sass',
                    'public/css/course-video.css': 'sass/course-video.sass',
                }
            },
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'public/css/course-ui.css': 'sass/course-ui.sass'
                }
            }
        },
        macreload: {
            /* Use Chrome to development Mokoversity
            safari: {
                browser: 'safari'
            },
            firefox: {
                browser: 'firefox'
            },
*/
            chrome: {
                browser: 'chrome',
                editor: 'sublime'
            }
        },
        less: {
            development: {
                files: {
                    'public/css/flat-ui.css': 'less/Flat-UI-Pro-1.2.3/less/flat-ui.less',
                    'public/openmind/css/mokoversity.css': 'public/openmind/css/mokoversity.less',
                    'public/openmind/css/color-default.leon.css': 'public/openmind/css/color-default.leon.less'
                }
            },
            production: {
                options: {
                    cleancss: true
                },
                files: {
                    'path/to/result.css': 'path/to/source.less'
                }
            }
        },
        exec: {
            logs: {
                cmd: '[ ! -f <%=LOGFILE%> ] && touch <%=LOGFILE%>; tail -f <%=LOGFILE%>'
            },
            clear: {
                cmd: 'rm -f <%=FOREVER_DIR%>/*.log'
            },
            start_server: {
                cmd: 'if [ ! -f <%=PIDFILE%> ]; then touch <%=PIDFILE%> && PORT=5000 NODE_ENV=production forever start -p <%=FOREVER_DIR%> -l <%= pkg.name %>.log -c "node --max-old-space-size=8192 --nouse-idle-notification" -a app.js; else echo "Can\'t start <%= pkg.name %>: <%= pkg.name %> is already running."; fi'
            },
            start_dev_server: {
                cmd: 'if [ ! -f <%=PIDFILE%> ]; then touch <%=PIDFILE%> && forever start -w --watchDirectory . -p <%=FOREVER_DIR%> -l <%= pkg.name %>.log -c "node --max-old-space-size=8192 --nouse-idle-notification" -a app.js; else echo "Can\'t start <%= pkg.name %>: <%= pkg.name %> is already running."; fi'
            },
            stop_server: {
                cmd: 'if [ -f <%=PIDFILE%> ]; then rm -f <%=PIDFILE%> && forever stop app.js; else echo "Can\'t stop <%= pkg.name %>: <%= pkg.name %> is not running."; fi'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-exec');

    // load the locally installed task-plugin
    // see: https://github.com/webgefrickel/grunt-macreload
    grunt.loadNpmTasks('grunt-macreload');

    // see: https://github.com/gruntjs/grunt-contrib-less
    grunt.loadNpmTasks('grunt-contrib-less');

    // Default task(s)
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('build', ['uglify'/*, 'sass:dist'*/]);
    grunt.registerTask('log', ['exec:logs']);
    grunt.registerTask('logs', ['exec:logs']);
    grunt.registerTask('start', ['exec:start_server']);
    grunt.registerTask('start-dev', ['exec:start_dev_server']);
    grunt.registerTask('start-browser', ['macreload']);
    grunt.registerTask('stop', ['exec:stop_server']);
    grunt.registerTask('restart', ['stop', 'start']);

    // grunt.registerTask('default', ['build']);
};
