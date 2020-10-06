#!/usr/bin/env node

const { show_help, update_major_version, update_minor_version, update_patch_version, update_version, currentVersion } = require('./src/index')
const { write_default_config } = require('./src/config')

const [, , parameter] = process.argv

switch (parameter) {
  case "help":
    show_help(currentVersion)
    break
  case "config":
    write_default_config()
    break
  case "current":
    console.log(`Current version: ${currentVersion}`)
    break
  case "major":
    update_major_version(currentVersion)
    break
  case "minor":
    update_minor_version(currentVersion)
    break
  case "patch":
    update_patch_version(currentVersion)
    break
  default:
    if (parameter !== undefined)
      update_version(parameter)
    else
      throw new Error('Missing parameter. Use help to see a list of options.')
    break;
}