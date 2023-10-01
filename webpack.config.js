const path = require("path")

module.exports = {
  mode: "development",

  entry: {
    "maker":  "./maker/js/entry.js",
    "player": "./player/js/entry.js"
  },

  output: {
    path: __dirname,
    filename: "[name]/bundle.js"
  }
}