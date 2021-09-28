'use strict';

const intervals = {};

const logs = new Map();

const working = {};

const clear = (taskName, terminate) => {
  if (taskName) {
    const interval = intervals[taskName]
    clearInterval(interval);
    console.log('task was stopped ', taskName);
    delete intervals[taskName];
    const keys = Object.keys(intervals);
    if (keys.length === 0) {
      console.log('All tasks were done');
    }
  } else {
    //SIGINT 1st
    const keys = Object.keys(intervals);
    for (const key of keys) {
      const interval = intervals[key];
        clearInterval(interval);
        console.log('task was stopped ', key);
    }
    //SIGINT 2nd
    if (terminate) {
      setTimeout(() => {
        console.log('Exit with status code 1');
        const keys = logs.keys();
        for (const key of keys) {
          const arr = logs.get(key);
          console.log(`Task: ${key}, last ${arr.length} logs:\n${arr.join('\n')}`);
        }
        process.exit(1);
      }, 0);
    }
  }
};

const tail = (name, count = 10) => {
    logs.set(name, []);
    const fn = text => {
      const arr = logs.get(name);
      arr.push(text);
      if (arr.length > count) arr.shift();
    };
    return fn;
};

class Unit {
  constructor(name, options = {}) {
    this.clear = true;
    this.name = name;
    this.numb = 0;
    this.logStart = options.logStart || false;
    this.logStop = options.logStop || false;
    this.logTail = tail(name, options.logTail);
  }
  start(){
    this.clear = false;
    const logText = `started task № ${this.numb} ${this.name}`;
    if (this.logStart === true) {
      console.log(logText);
    }
    this.logTail(logText);
  }
  finish(){
    this.clear = true;
    const logText = `finished task № ${this.numb} ${this.name}`;
    if (this.logStop === true) {
      console.log(logText);
    }
    this.logTail(logText);
  }
  stopTask(){
    clear(this.name);
  }
}

const stopRunner = (terminate) => {
  clear(undefined, terminate);
};

class Control {
  constructor() {
    this.count = 0;
  }
  stop() {
    this.count+= 1;
    if (this.count === 1) stopRunner();
    else {
      stopRunner(true);
    }
  }
}

const taskRunner = (tasks, options = {}) => {
  const LOG_IDLE = options.logIdle || false;
  try {
      for (const task of tasks) {
        let count = 0;
        const { config, job, taskName, taskInterval, taskCount,
          unitOptions } = task;
        working[taskName] = new Unit(taskName, unitOptions);
        const workingUnit = working[taskName];
        intervals[taskName] = setInterval(() => {
          if (count === taskCount) {
            clear(taskName);
            return;
          }
          if (workingUnit.clear === true) {
            count++;
            workingUnit.numb = count;
            workingUnit.start();
            job(config)
              .then(data => {
                if (data === 0) workingUnit.finish();
                else {
                  console.log(`Task № ${workingUnit.numb}`);
                  console.log('Workunit not finished correctly');
                  workingUnit.stopTask();
                }
              })
              .catch(err => {
                console.log('Hanfled Error from main on start task');
                console.log(Date());
                console.log(err);
                workingUnit.stopTask();
              });
          } else {
            if (LOG_IDLE) console.log(`task idled: ${taskName}`);
          }
        }, taskInterval);
        console.log('task was added: ', taskName);
      }
  } catch (e) {
    console.log('Handled Error from taskRunner\nExiting with status code 1', e);
    process.exit(1);
  }
  const control = new Control();
  return control;
};

module.exports = taskRunner;

const control = new Control();
process.on('SIGINT', () => {
  control.stop();
});
