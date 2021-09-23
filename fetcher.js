// fetcher.js

const fs = require("fs");
const request = require("request");
const readline = require("readline");
const [ URL, file ] = process.argv.slice(2, 4);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  setEncoding: "utf-8"
});

// Handles overwriting of existing files
const overwrite = function(body) {
  rl.question("That file already exists. Overwrite? y/n: ", answer => {
    if (answer === "y") {
      fs.writeFile(file, body, { flag: "w" }, err => {
        if (err) {
          return;
        }
        fs.stat(file, (_, stats) => {
          console.log(`Downloaded and saved ${stats.size} bytes to ${file}`);
          process.exit();
        });
      });
    } else {
      process.exit();
    }
  });
};

const httpRequest = function(URL, file) {
  request(URL, (error, response, body) => {
    if (error) {
      console.log("That URL is invalid.");
      process.exit();
    }
  
    if (response.statusCode !== 200) {
      console.log("Problem with URL");
      process.exit();
    }
  
    fs.writeFile(file, body, { flag: "wx" }, err => {
      if (err) {
        overwrite(body);
        return;
      }
      fs.stat(file, (_, stats) => {
        console.log(`Downloaded and saved ${stats.size} bytes to ${file}`);
        process.exit();
      });
    });
  });
};

httpRequest(URL, file);
