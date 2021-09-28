const configCurrentTime = {
  phrase: (date) => new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`The time is ${date}`);
    }, 3000);
  })
};

const currentTime = async (config) => {
  const { phrase } = config;
  const date = new Date();
  const result = await phrase(date);
  console.log(result);
  return 0;
};

const configPrintHello = { numb: 5 }
let count = 0;
const print = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('Hello world');
    resolve();
  }, 1500);
});

const printHello = async (config) => {
  const { numb } = config;
  if (count < numb ) {
    await print();
    count++;
    //all is fine
    return 0;
  } else {
    //something went wrong
    return 1;
  }
};

const tasks = [
  {
    taskName: 'currentTime',
    taskInterval: 1000,
    taskCount: 10,
    job: currentTime,
    config: configCurrentTime,
    unitOptions: {
      logStart: true,
      logStop: true,
      logTail: 5
    }
  },
  {
    taskName: 'printHello',
    taskInterval: 2000,
//    taskCount: 7,
    job: printHello,
    config: configPrintHello,
    unitOptions: {
//      logStart: true,
//      logStop: true,
      logTail: 10
    }
  },
];

module.exports = tasks;
