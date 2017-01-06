'use strict';

const formatter = require('js-beautify').js_beautify;

function readModule(content, moduleNumber, maps) {
  const lines = content.split('\n');

  let startLine = lines.findIndex(line => line.indexOf(`/* ${moduleNumber} */`) > -1);
  let endLine = lines.findIndex(line => line.indexOf(`/* ${Number(moduleNumber) + 1} */`) > -1);

  if (endLine === -1) {
    endLine = lines.length - 1;
  }

  // Remove wrapped function
  startLine += 2;
  endLine -= 1;
  let moduleContent = lines.slice(startLine, endLine).join('\n');
  moduleContent = moduleContent.replace(/__webpack_require__\((\d+)\)/g, function replace(match, p1) {
    const mo = maps.find(i => i.number === p1);
    return `require('./${mo.name}')`;
  });
  return formatter(moduleContent, { indent_size: 2 });
}

module.exports = readModule;
