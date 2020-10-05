#!/usr/bin/env node

const fs = require('fs')
const path = require('path');
const mappings = require('./src/mappings')
const cwd = process.cwd()

const [, , parameter] = process.argv
const PACKAGE_JSON = path.join(cwd, '/package.json')
const PACKAGE_JSON_CONTENT = JSON.parse(fs.readFileSync(PACKAGE_JSON).toString())
const currentVersion = PACKAGE_JSON_CONTENT.version


switch (parameter) {
  case "help":
    console.log("\x1b[36m")
    console.log('Example usage:')
    console.log(`npm run update-version ${currentVersion}`, "\x1b[32m", "Updates the project's version to the passed one.", "\x1b[36m")
    console.log('npm run update-version patch', "\x1b[32m", 'Increments one the patch version (x.y.z+1).', "\x1b[36m")
    console.log('npm run update-version minor', "\x1b[32m", 'Increments one the minor version (x.y+1.z).', "\x1b[36m")
    console.log('npm run update-version major', "\x1b[32m", 'Increments one the major version (x+1.y.z).', "\x1b[36m")
    console.log('npm run update-version current', "\x1b[32m", 'Returns the current version number from package.json file.', "\x1b[36m")
    break

  case "current":
    console.log(`Current version: ${currentVersion}`)
    break
  case "major":
    update_version(get_new_version(currentVersion, 0))
    break
  case "minor":
    update_version(get_new_version(currentVersion, 1))
    break
  case "patch":
    update_version(get_new_version(currentVersion, 2))
    break
  default:
    if (parameter !== undefined)
      update_version(parameter)
    else
      throw new Error('Missing parameter. Use help to see a list of options.')
    break;
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
  if (!new_version.match(/^[0-9]+\.[0-9]+\.[0-9]+$/g)) {
    throw new Error(`Invalid version: ${new_version}`)
  }

  const hooks = JSON.parse(fs.readFileSync(path.join(cwd, '/update-package-version.json')).toString())
  hooks.forEach(hook => mappings[hook.type](...hook.params)(currentVersion, new_version))
}