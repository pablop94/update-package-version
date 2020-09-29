[![version](https://img.shields.io/badge/version-0.0.3-informational.svg)](https://github.com/pablop94/update-package-version)

# Update Package Version

A package that will help you and your team members(if any) to replace in all needed files your project's version. 

### Why?
Sometimes you need to include your project's version in some files and people tend to forget to update all of them when it changes. This package intends to minimize the error. 

Of course, you can do it by your own, it's up to you.

## Installation
```
npm install update-package-version
```

### Include a command in your package.json file
```
...
  "scripts": {
    ...
    "update-version": "node node_modules/update-package-version/index.js"
    ...
  },
...
```
Then run it with
```
npm run update-version params
```

### Configuration
Place a file in your project's root directory called update-package-version.json
This file will be read by the commands and will update the specified files with the specified configuration:

The file consists of a list of files and methods to update:
```
[
  {
    "type": "override-json",
    "params": [
      "./package.json",
      "version"
    ]
  },
  {
    "type": "replace",
    "params": [
      "./README.md",
      "https://img.shields.io/badge/version-[#CURRENT_VERSION]-informational.svg",
      "https://img.shields.io/badge/version-[#NEW_VERSION]-informational.svg"
    ]
  }
]
```
This configuration will update two files: ./package.json and ./README.md
The package.json file will be updated as a new json, changing the property passed as the second element of params list (version)
The README.md will search for the value 'https://img.shields.io/badge/version-[#CURRENT_VERSION]-informational.svg' and then replace it with the value 'https://img.shields.io/badge/version-[#NEW_VERSION]-informational.svg'

*Note that the README.md replacement will be performed using the varibles [#CURRENT_VERSION] and [#NEW_VERSION]. This is to avoid changing the configuration on every version update*

### Examples of use
```
# Will update your project's version to 1.2.3
npm run update-version 1.2.3
```

```
# Will increase your project's patch version in one
npm run update-version patch
```

```
# Will increase your project's minor version in one
npm run update-version minor
```

```
# Will increase your project's major version in one
npm run update-version major
```

```
# Will return your project's current version
npm run update-version current
```

```
# Will show the available commands
npm run update-version help
```

#### Contact me if you have any idea or if you encounter an issue