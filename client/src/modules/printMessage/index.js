const printLetter = (str, strArray, time, resolve) => {
  setTimeout(() => {
    process.stdout.write(strArray.shift());
    if (strArray.length === 0) {
      resolve(str);
    } else {
      printLetter(str, strArray, time, resolve);
    }
  }, time);
};

export default async (str, speed = 0) => {
  return new Promise(resolve => {
    speed = parseInt(speed);
    if (speed < 0 || Number.isNaN(speed)) {
      speed = 0;
    }
  
    if (speed === 0) {
      process.stdout.write(str);
      resolve(str);
    }
  
    const strArray = str.split('');
    printLetter(str, strArray, speed, resolve);
  });
};
