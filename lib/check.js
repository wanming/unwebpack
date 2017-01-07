'use strict';

const path = require('path');

// Require modules check it works well or not
let errorCount = 0;

function check(maps, targetDir) {
  maps.forEach(item => {
    try {
      require(path.join('..', targetDir, item.name));
    } catch (e) {
      errorCount += 1;
      if (errorCount < 5) {
        console.log(item.name, 'module load error', e.message, e.stack);
      }
    }
  });

  console.log(errorCount, 'modules test error,', maps.length, 'total');
}

module.exports = check;
