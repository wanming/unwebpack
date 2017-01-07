'use strict';

function custormize(codes) {
  const index = codes.find(i => i.number === 0);
  const replaceString = `require('./${index.name}').`;

  return codes.map(item => {
    if (item.number !== 0) {
      item.code = item.code.replace(/GC\.Spread\./g, replaceString);
    }

    if (item.number === 0) {
      item.code = item.code.replace('GC = GC || {};', 'var GC = GC || {};');
    }

    // Replace "require('./index').Sheets.Bindings;" to "require('./Bindings');"
    item.code = item.code.split('\n').map(line => {
      return line.replace(
        /require\('\.\/index'\)\.([A-Za-z0-9_]+)(\.([A-Za-z0-9_]+))?;/,
        (str, a1, dotA2, a2) => {
          if (a2) {
            return `require('./${a2}');`;
          }
          if (a1) {
            return `require('./${a1}');`;
          }

          return null;
        }
      );
    }).join('\n');

    return item;
  });
}

module.exports = custormize;
