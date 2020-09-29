const fs = require('fs')

function overrideJSON(path, prop) {
  return (old_version, new_version) => {
    fs.readFile(path, 'utf8', function (err, data) {
      const json = JSON.parse(data.toString())
      json[prop] = new_version
      _save_file(path, JSON.stringify(json, 0, 2), new_version)
    })
  }
}

function replace(path, originalValue, newValue) {
  return (old_version, new_version) => {
    const old_value = originalValue.replace("[#CURRENT_VERSION]", old_version)
    const new_value = newValue.replace("[#NEW_VERSION]", new_version)
    
    fs.readFile(path, 'utf8', function (err, data) {
      let formatted = data.replace(new RegExp(old_value, 'i'), new_value);
      _save_file(path, formatted, new_version)
    });
  }
}

function _save_file(path, value, new_version) {
  fs.writeFile(path, value, 'utf8', function (err) {
    if (err) return console.log(err);
    console.log(`${path} version updated: ${new_version}`);
  });
}

exports.overrideJSON = overrideJSON
exports.replace = replace