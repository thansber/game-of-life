module.exports = function(grunt) {

  var srcPath = 'js/*.js',
      testPath = 'specs/**/*spec.js';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: [srcPath, testPath],
        tasks: ['jshint', 'jasmine']
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-notify');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('test', ['jasmine']);

};