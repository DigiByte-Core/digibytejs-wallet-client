var bitcoreTasks = require('bitcore-build');
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  bitcoreTasks('wallet-client');
  console.log(bitcoreTasks());
  // Default task(s).
  grunt.registerTask('default', ['browser']);
};
