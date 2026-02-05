function getTime() {
  let d = new Date();
  return d.getHours() * 100 + d.getMinutes();
}

function getFullTime() {
  const d = new Date();
  const t = d.toLocaleTimeString([], { hour12: false });

  const yyyy = d.getFullYear();
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  return parseInt('' + (yyyy * 10000 + mm * 100 + dd) + t.split(':').reduce((pre, cur) => pre + cur));
}

/**
 * Checks if the given time is within the day session (05:00 ~ 13:45).
 * If no time is provided, it uses the current time.
 * @param {number} [hhmm] - The time in HHMM format (e.g., 851 for 08:51, 1324 for 13:24). Optional.
 * @returns {boolean} - True if it's day session, false otherwise.
 */
function isDay(hhmm) {
  // 05: 00~13: 45 - Day
  // 13: 45~05: 00 - Night
  const day_begin = 500;
  const day_end = 1345;

  hhmm = hhmm || getTime();
  if (hhmm < day_begin) return false;
  if (hhmm > day_end) return false;
  return true;
}

/**
 * @param {number} hhmm - 851, 1324...
 * @returns {boolean}
 */
function isTradeTime(hhmm) {
  // 08:40~13:45 - Day
  // 14:55~05:00 - Night
  const day_begin = 845;
  const day_end = 1345;
  const night_begin = 1500;
  const night_end = 500;

  hhmm = hhmm || getTime();
  if (hhmm >= day_begin && hhmm <= day_end) return true;
  if (hhmm <= night_end) return true;
  if (hhmm >= night_begin) return true;
  return false;
}

/**
 * @param {number} yyyymmddhhmm - 202203140846
 */
function getHHMM(yyyymmddhhmm) {
  let digits = yyyymmddhhmm.toString().length;
  return (digits !== 12) ? null : yyyymmddhhmm % 10000;
}

function getListMMDD(yyyymmdd) {
  yyyymmdd = '' + yyyymmdd;
  if (yyyymmdd.length !== 8) return null;

  return [parseInt(yyyymmdd.substring(4, 6)), parseInt(yyyymmdd.substring(6, 8))];
}

function _getRandomChar() {
  const chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  return chars[Math.floor(Math.random() * 52)];
}

/**
 * Generates a unique time-based serial number (SN).
 * When backtesting, many trades can occur in the same second, 
 * so this function adds random characters to ensure uniqueness.
 * @param {string} name - A prefix for the generated serial number (e.g., 'pattern').
 * @returns {string} The unique serial number, e.g., 'pattern20240314153000ABC'.
 */
function getTimeSN(name) {
  const strTime = getFullTime();
  return name + strTime + _getRandomChar() + _getRandomChar() + _getRandomChar();
}

function getUniqueSN(commodity, name) { return commodity.toLowerCase() + '_' + getTimeSN(name); }

module.exports = {
  isDay, isTradeTime, getHHMM, getListMMDD, getTime, getFullTime, getUniqueSN
};

// 可寫入測試
/*
var numDate = 20230430
var time = { hour: 24, minute: 0, second: 0 };
console.log(getTimeNumber(numDate, time))
var time2 = { hour: 0, minute: 0, second: 8 };
console.log(getTimeNumber(numDate, time2))
*/