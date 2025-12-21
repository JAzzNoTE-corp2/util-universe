const os = require('os');
const path = require('path');
const stdColor = require('./lib/stdColor.js');

// Deep copy object or array
function deepCopy(destination, source, /*optional*/copyIterator = false) {
  //console.log('===deepCopy===', destination)
  if (typeof source === 'boolean') {
    copyIterator = source;
    source = undefined;
  }
  // 允許傳入一個欲複製對象，傳出一個copy(不用先傳入空物件)
  if (!source) {
    source = destination;
    destination = (Array.isArray(source)) ? [] : {};
  }

  for (let property in source) {
    if (typeof source[property] === "object" && source[property] !== null) {
      destination[property] = destination[property] || (Array.isArray(source[property])) ? [] : {};
      deepCopy(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }

  // Symbol.iterator can't be iterated by for-in loop, so we copy it here
  if (copyIterator == true && source && source[Symbol.iterator]) destination[Symbol.iterator] = source[Symbol.iterator];

  return destination;
}

function isDeepStrictEqual(object1, object2) {
  if (object1 === object2) return true;
  if (object1 === null || typeof object1 !== 'object' || object2 === null || typeof object2 !== 'object') return false;
  if (object1.constructor !== object2.constructor) return false;

  if (Array.isArray(object1)) {
    if (object1.length !== object2.length) return false;

    for (let i = 0; i < object1.length; i++) {
      if (!isDeepStrictEqual(object1[i], object2[i])) return false;
    }
    return true;
  }

  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !isDeepStrictEqual(object1[key], object2[key])) return false;
  }

  return true;
}

/**
 * @param {object} child - an object which must have 'prototype' property
 * @param {object} proto1
 * @param {object} proto2
 */
function extend() {
  // Get the list of prototypes			
  const modules = [].slice.call(arguments);
  // Get child
  const child = modules.shift();

  modules.forEach(module => { for (let key in module) child.prototype[key] = module[key]; });

  return child;
}

function roundTo(floatNum, precision) {
  let m = Math.pow(10, precision);
  return Math.round(floatNum * m) / m;
}

/**
 * @param {array} dataSet 
 * @param {string} name   - Specify where the value is if the elements of dataSet is object
 * @param {number} digits - The number of digits to appear after the decimal point
 */
function mean(dataSet, /*optional*/ name, digits) {
  if (typeof name === 'number') {
    digits = name;
    name = undefined;
  }

  let qty = dataSet.length;
  let sum = dataSet.reduce((pre, cur) => (name) ? (pre[name] || pre) + cur[name] : pre + cur, 0);
  return (digits) ? roundTo(sum / qty, digits) : sum / qty;
}

function bubbleSort(arr) {
  arr = deepCopy(arr);
  let swapped, i, len = arr.length;
  do {
    swapped = false;
    for (i = 0; i < len - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        var temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
  } while (swapped);

  return arr;
}

/**
 * Translate each number to its order
 * ex: passing [34, 56, 12] will get [2, 3, 1]
 * @param {array} list
 * @param {number} list[i]
 * @returns {array}
 */
function getOrderNumber(list) {
  let listOrdered = bubbleSort(deepCopy(list));
  let dictOrder = {};
  // Assign the order to each number
  listOrdered.forEach((n, i) => dictOrder[n] = i + 1);
  return list.map(n => dictOrder[n]);
}

/**
 * @param {string} name - a hierarchical string like 'signal.sn'
 * @param {object} doc  - the searching target of name
 */
function getNestedValue(name, doc) {
  name = (name.includes('.')) ? name.split('.') : [name];
  return name.reduce((arr, cur) => { return (arr && arr[cur]) ? arr[cur] : undefined }, doc);
}

function isEqualArray(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  if (arr1 == null || arr2 == null) return false;

  return arr1.every((v, i) => v == arr2[i]);
}

function uppercase1stLetter(str) { return str.replace(/\b[a-z]/g, (letter) => letter.toUpperCase()); }

/**
 * @param {number} num 
 */
function number2FinanceChinese(num) {
  var digits = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖']
  var positions = ['', '拾', '佰', '仟', '萬'];

  let str = String(num).split('');
  let len = str.length;
  return str.reduce((acc, curr, index) => {
    acc += digits[parseInt(curr)] + positions[len - index - 1];
    return acc;
  }, "");
}

// 'A' || 'a' will be 0, 'B' || 'b' will be 1...etc
function convertEn2Sn(str) { console.log('convertEn2Sn has been migrated to stringConverter.js'); }

/**
 * 0 will be 'A', 1 will be 'B'...etc
 * @param {number} num 
 * @param {boolean} upperCase 
 */
function convertSn2En(num, /*optional*/upperCase) { console.log('convertSn2En has been migrated to stringConverter.js'); }

/** 
 * Ensure the string has a certain length, if not, add prifix to the front
 * @param {string} str 
 * @param {number} length 
 * @param {string} prifix - default is a space
 */
function ensureStringLength(str, length, /*optional*/prifix = ' ') {
  str = str.toString();
  if (str.length < length) return prifix.repeat(length - str.length) + str;
  return str;
}

function mergeMessage(list) {
  if (Array.isArray(list)) return list.reduce((pre, cur) => pre += addTodoColor(cur), '');
  else if (typeof list === 'string') return addTodoColor(list);
  function addTodoColor(str) { return str.replace('TODO:', stdColor.bgYellow + ' TODO: ' + stdColor.reset); }
}

module.exports = {
  isMac: (os.platform() === 'darwin'),
  rootPath: path.join(__dirname, '..'),
  deepCopy, isDeepStrictEqual, extend,
  bubbleSort, getOrderNumber,
  roundTo, mean,
  isEqualArray,

  getNestedValue,

  uppercase1stLetter,
  number2FinanceChinese,
  convertEn2Sn, convertSn2En,
  ensureStringLength,

  mergeMessage, // For unit test

  noneDuplicateArray: function (arr) {
    return arr.filter((item, pos) => arr.indexOf(item) == pos);
  },

  /**
   * @param {number} startMonth : 200302
   * @param {number} endMonth : 201412
   * @returns {array} : [200302, 200303, ...]
   */
  createMonthSequence: function (startMonth, endMonth) {
    var table = [];

    while (startMonth <= endMonth) {
      if (startMonth % 100 === 13) startMonth = startMonth + 100 - 12;
      table.push(startMonth);
      startMonth += 1;
    }

    return table;
  },

  // 針對傳入陣列的item做排列組合
  getMathCombination(arr, taken) {
    if (arr.length > 13) return console.warn('getMathCombination | Inefficient length of array', arr);
    let output = [];

    // 可以寫成遞迴，但懶了
    const len_i = arr.length - (taken - 1);
    for (let i = 0; i < len_i; i += 1) {
      const len_j = len_i + 1;
      for (let j = i + 1; j < len_j; j += 1) {
        const len_k = len_j + 1;
        for (let k = j + 1; k < len_k; k += 1) {
          output.push(util.deepCopy([arr[i], arr[j], arr[k]]));
        }
      }
    }

    return output;
  },

  getFileExtension: function (str) {
    let arr = str.split('.');
    return arr[arr.length - 1].toLowerCase();
  },

  getIntegerDigits: function (num) { return (typeof num !== 'number') ? null : num.toString().length; },

  parseCronExpression: function (expression) {
    const arr = expression.split(' ');
    const exp = { second: arr[0], minute: arr[1], hour: arr[2], dayOfMonth: arr[3], month: arr[4], dayOfWeek: arr[5] };
    const msg = add(exp.hour) + ':' + add(exp.minute) + ':' + add(exp.second);

    return msg;

    function add(str) { return (str.length == 1) ? '0' + str : str; }
  }
};