'use strict';

/* eslint no-cond-assign: 0 */

const _ = require('lodash');

// GC.Spread = __webpack_require__(1);
const regexp = /\b(([a-zA-Z_0-9.]+)\s+=\s+)?__webpack_require__\((\d+)\)[^.]/g;

// return map of mudule name and num like:
// { 'fileHelper': 1, 'testHelper': 2 }
function readModules(content) {
  //  { 1: ['name1', 'nema2', ...] }
  const dirtyResult = {};
  let match;
  while (match = regexp.exec(content)) {
    const arr = match.slice(1);
    // console.log(arr);
    const name = arr[1];
    const number = arr[2];

    if (!dirtyResult[number]) {
      dirtyResult[number] = [];
    }

    if (dirtyResult[number].indexOf(name) === -1) {
      dirtyResult[number].push(name);
    }
  }

  // Remove useless named undefined or 'module.exports'
  Object.keys(dirtyResult).forEach(key => {
    dirtyResult[key] = dirtyResult[key].filter(i => {
      return i &&
        i !== 'module.exports' &&
        i !== 'module' &&
        i !== 'exports';
    });
    if (dirtyResult[key].length === 0) {
      dirtyResult[key] = ['Unnamed'];
    }
  });


  // Check no matched module numbers
  const keys = Object.keys(dirtyResult).map(Number);
  const missed = [];
  for (let i = 0; i < Math.max(keys); i += 1) {
    if (!dirtyResult[i]) {
      missed.push(i);
    }
  }
  if (missed.length > 1) {
    console.warn('missed modules:', missed);
  }


  // Pick a best name for each module,
  // name undefined to name 'unnamedXX'

  // Avoid duplicated name (lower case)
  // format: { moduleName: 1(named time) }
  const namedModules = {};
  const pushNameStack = name => {
    if (typeof namedModules[name] === 'undefined') {
      namedModules[name] = 0;
    }
    namedModules[name] += 1;
  };

  // Return name like tom1, tom2, and so on
  const makeName = name => {
    pushNameStack(name);
    if (namedModules[name] === 1) {
      return name;
    }
    return name + namedModules[name].toString(36).toUpperCase();
  };

  const pickName = arr => {
    // Look for word without dot
    let ret = arr.find(i => i.indexOf('.') === -1);
    if (!ret) {
      ret = _.last(arr[0].split('.'));
    }
    return _.capitalize(_.camelCase(makeName(ret)));
  };

  const result = Object.keys(dirtyResult).map(key => {
    return {
      name: pickName(dirtyResult[key]),
      number: key
    };
  });

  return result;
}

module.exports = readModules;
