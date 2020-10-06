const fs = require('fs')
const path = require('path')
const readline = require("readline")

module.exports.write_default_config = function () {
  const CONFIG_FILE_NAME = 'update-package-version.json'
  fs.readFile('./src/default-config.json', 'utf8', (err, data) => {
    if (err)
      throw err
    const cwd = process.cwd()
    const new_config_file = path.join(cwd, `/${CONFIG_FILE_NAME}`)
    fs.writeFile(new_config_file, data, (err) => {
      if (err)
        throw err
      console.log("\x1b[32m", `Configuration file created: ${new_config_file}`)


      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      console.log("\x1b[33m");
      rl.question("Do you want to add it to .gitignore (y/N) (create if doesn't exist) ", function (answer) {
        if (answer && (answer === "y" || answer === "Y")) {
          fs.appendFile(path.join(cwd, '/.gitignore'), `\n${CONFIG_FILE_NAME}`, (err) => {
            if (err)
              throw err
            console.log("\x1b[32m", `Successfully added to .gitignore`)
            rl.close();
          })
        }
        else{
          rl.close();
        }
      });

      rl.on("close", function () {
        process.exit(0);
      });
    })
  })
}