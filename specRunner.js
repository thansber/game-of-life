requirejs.config({
  baseUrl: 'js',
  paths: {
    jquery: './lib/require-jquery-min',
    'jasmine-fixture': '../specs/helpers/jasmine-fixture',
    'jasmine-jquery': '../specs/helpers/jasmine-jquery',
    'underscore': './lib/underscore-min'
  }
});