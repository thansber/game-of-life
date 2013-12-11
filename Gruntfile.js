module.exports = function(grunt) {

  var srcPath = 'js/*.js',
      testPath = 'specs/**/*spec.js';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: [srcPath, testPath],
        tasks: ['jshint', 'jasmine', 'growl:validation']
      },
      options: {
        atBegin: true
      }
    },
    jshint: {
      all: {
        src: [srcPath, testPath]
      }
    },
    jasmine: {
      src: srcPath,
      options: {
        specs: testPath,
        template: require('grunt-template-jasmine-requirejs'),
        templateOptions: {
          requireConfigFile: 'specRunner.js'
        },
        keepRunner: true
      }
    },
    growl: {
      jshint: {
        title: 'JSHint',
        message: 'JSHint passed successfully'
      },
      jasmine: {
        title: 'Jasmine',
        message: 'Jasmine passed successfully'
      },
      validation: {
        title: 'Jasmine/JSHint',
        message: 'Validation passed successfully'
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-growl');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('jsh', ['jshint', 'growl:jshint']);
  grunt.registerTask('test', ['jasmine', 'growl:jasmine']);

};