const https = require('https');
const fs = require('fs');

function fileDownload(url, path) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(path);
    https.get(url, function (response) {
      response.pipe(file);

      // after download completed close filestream
      file.on("finish", () => {
        file.close();
        resolve();
      });
    });
  })
}

module.exports = { fileDownload }
