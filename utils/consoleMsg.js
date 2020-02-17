const consoleMsg = message => {
  const curDate = `[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}]`;
  console.log(curDate, message);
};

module.exports = consoleMsg;