const fs = require('fs')
const path = require('path');
const mappings = require('./src/mappings')


let first_parameter = process.argv[2]

const PACKAGE_JSON = './package.json'
const PACKAGE_JSON_CONTENT = JSON.parse(fs.readFileSync(PACKAGE_JSON).toString())
const currentVersion = PACKAGE_JSON_CONTENT.version


switch (first_parameter) {
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
    update_version(first_parameter)
    break;
}

function get_new_version(currentVersion, index) {
  return currentVersion.split('.').map((part, i) => i === index ? parseInt(part) + 1 : i > index ? "0" : part).join('.')
}

function update_version(new_version) {
  if (!new_version.match(/^[0-9]+\.[0-9]+\.[0-9]+$/g)) {
    throw new Error(`Invalid version: ${new_version}`)
  }
  const cwd = process.cwd()
  
  const hooks = JSON.parse(fs.readFileSync(path.join(cwd,'/update-package-version.json')).toString())
  hooks.forEach(hook => mappings[hook.type](...hook.params)(currentVersion, new_version))
}