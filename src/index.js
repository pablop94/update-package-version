const fs = require('fs')
const path = require('path')
const mappings = require('./mappings')
const constants = require('./constants')
const cwd = process.cwd()

const PACKAGE_JSON = path.join(cwd, '/package.json')
const PACKAGE_JSON_CONTENT = JSON.parse(fs.readFileSync(PACKAGE_JSON).toString())
const currentVersion = PACKAGE_JSON_CONTENT.version

function show_help(currentVersion) {
  console.log("\x1b[36m")
  console.log('Example usage:')
  console.log(`npm run update-version ${currentVersion}`, "\x1b[32m", "Updates the project's version to the passed one.", "\x1b[36m")
  console.log('npm run update-version patch', "\x1b[32m", 'Increments one the patch version (x.y.z+1).', "\x1b[36m")
  console.log('npm run update-version minor', "\x1b[32m", 'Increments one the minor version (x.y+1.z).', "\x1b[36m")
  console.log('npm run update-version major', "\x1b[32m", 'Increments one the major version (x+1.y.z).', "\x1b[36m")
  console.log('npm run update-version current', "\x1b[32m", 'Returns the current version number from package.json file.', "\x1b[36m")
}

function update_major_version(currentVersion) {
  update_version(get_new_version(currentVersion, constants.MAJOR))
}

function update_minor_version(currentVersion) {
  update_version(get_new_version(currentVersion, constants.MINOR))
}

function update_patch_version(currentVersion) {
  update_version(get_new_version(currentVersion, constants.PATCH))
}

/**
 * Returns a new string representing the version, adding one to the given index (major, minor or patch) and replacing the greater indexes with 0.
 * Given 1.2.3 with index 2 will return 1.2.4
 * Given 1.2.3 with index 1 will return 1.3.0
 * Given 1.2.3 with index 0 will return 2.0.0
 * @param {String} currentVersion The current version
 * @param {Number} index The version to be updated, can be 0, 1 or 2 meaning major, minor or patch respectively
 */
function get_new_version(currentVersion, index) {
  return currentVersion.split('.').map((part, i) => i === index ? parseInt(part) + 1 : i > index ? "0" : part).join('.')
}

function update_version(new_version) {
  if (!_is_valid_version(new_version)) {
    throw new Error(`Invalid version: ${new_version}`)
  }

  try {
    const hooks = JSON.parse(fs.readFileSync(path.join(cwd, '/update-package-version.json')).toString())
  }
  catch(e){
    throw new Error('Not found configuration file: update-package-version.json')
  }
  hooks.forEach(hook => mappings[hook.type](...hook.params)(currentVersion, new_version))
}

function _is_valid_version(version) {
  return version.match(constants.VERSION_REGEX)
}

module.exports.show_help = show_help
module.exports.update_major_version = update_major_version
module.exports.update_minor_version = update_minor_version
module.exports.update_patch_version = update_patch_version
module.exports.update_version = update_version
module.exports.currentVersion = currentVersion