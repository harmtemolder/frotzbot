'use strict';

module.exports = function() {
  var prompt = require('prompt');
  prompt.message = '';
  prompt.delimiter = '';
  var Q = require('q');

  var deferredVM = Q.defer();

  // Auto pick the right “say” library for current platform
  var say = require('say');

  this.setVM = function(VM) {
    deferredVM.resolve(VM);
  }

  this.handleOutput = function(output) {
    output = output.replace(/\n\n>$/, '')
    console.log(output.toString());
    say.speak(output.toString());
    getConsoleInput();
  }

  var handleInput = function(input) {
    deferredVM.promise.then(function(VM) {
      VM.handleInput(input);
    });
  }

  var handleConsoleInput = function(result){
    if(result['>'] == 'quit'){
      process.exit(0);
    }
    handleInput(result['>']);
  }

  var getConsoleInput = function() {
    Q.ninvoke(prompt, 'get', '>')
      .then(handleConsoleInput);
  }

  this.start = function() {
    prompt.start();
  }
}
