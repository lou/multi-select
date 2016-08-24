    module.exports = function  (grunt) {
    var config = {};


                //src ===============================
                var src;
                config.src = src = {
                     sassMain        : 'scss/multi-select.scss',
                     distFolder      : 'css/multi-select.dist.css',
                     devFolder       : 'css/multi-select.dev.css',
                     sassFolder      : 'scss/**/*.scss',
                
                };


                //Watch ===============================
                config.watch = {
                     scripts: {
                        files: ["<%= src.libFolder %>", "<%= src.sassFolder %>"]
                        ,tasks: ["dev", "sass:dist"]
                        //,tasks: ["dev",'sass:dist']
                     }
                }


                //Sass ===============================
                var sass;
                config.sass = sass = {};

                    //distribution
                        sass.dist = {
                            options: { 
                                style: "compressed",
                                noCache: true, 
                                sourcemap: 'none', 
                                update:true
                            }
                            , files: {
                                "<%= src.distFolder %>" : "<%= src.sassMain %>"
                            }
                        };

                    //development env.
                        sass.dev = {
                            options: { 
                                style: "expanded", 
                                lineNumber: true,
                            }
                            , files: {
                                "<%= src.devFolder %>" : "<%= src.sassMain %>"
                            }
                        };


            
    //Register custom tasks ===============================
    grunt.registerTask('default',['dev']);
    grunt.registerTask('dev', ['sass:dev']);
    grunt.registerTask('dist',['sass:dist']);
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });


    //General setup ===============================
    grunt.initConfig(config);

};
