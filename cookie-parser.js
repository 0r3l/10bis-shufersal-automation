const fs = require('fs')
const path = require('path')

function parse() {
  var output = [];
  const cookie = fs.readFileSync(path.resolve(__dirname, 'cookie'), { encoding: 'utf8' })
  cookie.split(/\s*;\s*/).forEach(function (pair) {
    pair = pair.split(/\s*=\s*/);
    output.push({
      name: pair[0],
      value: pair.splice(1).join('=').replace(/(\r\n|\n|\r)/gm, ""),
      secure: true,
      path: '/',
      domain: 'www.10bis.co.il',
      expires: 1656846315 //Sunday, July 3, 2022 11:05:15 AM
    });
  });
  // console.log(JSON.stringify(output, null, 4))
  return output
}

module.exports = parse()
