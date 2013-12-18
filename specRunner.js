requirejs.config({
  baseUrl: 'js',
  paths: {
    jquery: './lib/require-jquery-min',
    'game-fixture': '../specs/helpers/game-fixture',
    'jasmine-fixture': '../specs/helpers/jasmine-fixture',
    'jasmine-jquery': '../specs/helpers/jasmine-jquery',
    'underscore': './lib/underscore-min'
  }
});