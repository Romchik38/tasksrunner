'use strict';

const taskRunner = require('./index.js');
const tasks = require('./tasksExample.js');
const options = {
  logIdle: true
};

const task = taskRunner(tasks, options);

//Step 1 - run this example

//Step 2 uncomment next code and run
// setTimeout(() => {
//console.log('Gracefull shutdown');
//   task.stop();  //send 1 time SIGINT
// }, 7500);

//Step 3 - comment code at Step 2 and uncomment next
// setTimeout(() => {
//   console.log('Terminate shutdown');
//   task.stop();  //send 1st SIGINT - gracefull shutdown
//   task.stop();  //send 2nd SIGINT - terminate
// }, 7500);
