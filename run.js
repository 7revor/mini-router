var fs = require('fs');
var babel = require('@babel/core');
var env = require("@babel/preset-env");
var UglifyJS = require('uglify-js')
fs.readFile('./lib/index.js', function(err, data) {
  if (err) {
    throw err;
  }
  var src = data.toString();
  var transOpts = {
    presets: [env],
  };
  var result = babel.transform(src, transOpts);
  var uglifyCode = UglifyJS.minify(result.code);
  fs.writeFileSync('index.js', uglifyCode.code);
  console.log('build success')
})
