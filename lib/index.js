'use strict';

const fs = require('fs');
const path = require('path');
const readModuleNames = require('./read_module_names');
const readModule = require('./read_module');

// Main function
function unpack(content, targetDir) {
  const names = readModuleNames(content);

  const codes = names.map(item => {
    return { name: item.name, code: readModule(content, item.number, names) };
  });

  codes.forEach(code => {
    // console.log(path.join(targetDir, code.name + '.js'));
    fs.writeFileSync(path.join(targetDir, code.name + '.js'), code.code);
  });

  console.log('done');
}

module.exports = unpack;
