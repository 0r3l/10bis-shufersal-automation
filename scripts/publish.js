const { storage } = require('../firebase-integration');

var filePath = process.argv[2]; 
var barcodeNumber = process.argv[3]; 

if(!filePath || !barcodeNumber){
    throw 'missing params'
}

console.log(`params: file path: ${filePath}, bracode number: ${barcodeNumber}`);

storage.uploadFile(filePath, barcodeNumber)

