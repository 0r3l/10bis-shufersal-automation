const { initializeApp, cert } = require('firebase-admin/app');
const serviceAccount = require("./firebase-adminsdk.json");
const { getStorage } = require('firebase-admin/storage');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');
const logger = require('./logger');
require('dotenv').config();

const BUCKET_NAME = 'bis-shufersal-coupons';

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${BUCKET_NAME}.appspot.com`,
  databaseURL: 'https://bis-shufersal-coupons.firebaseio.com'
});


async function uploadFile(filePath, barcodeNumber) {

  const filename = filePath.substr(filePath.lastIndexOf('/') + 1);
  const bucket = getStorage().bucket();
  await bucket.upload(filePath, {
    destination: filename,
  });

  logger.info(`${filePath} uploaded to ${BUCKET_NAME}`);
  await insertDB(filename, barcodeNumber);
  await sendFCM(filename.substr(0, filename.lastIndexOf('.')));
}



async function insertDB(name, barcodeNumber) {
  const db = getFirestore();
  const collection = `families/${process.env.GROUP_FAMILY_ID}/coupons`;
  const docRef = db.collection(collection)
    .doc();

  const doc = {
    name,
    barcodeNumber
  }

  await docRef.set(doc)

  logger.info(`${JSON.stringify(doc)} saved to firebase collection ${collection}`);

}

async function sendFCM(filename) {
  const messaging = getMessaging();
  return messaging.sendToTopic(process.env.GROUP_FAMILY_ID, {
    notification: {
      title: "שובר שופרסל חדש",
      body: filename
    },
  })
}


module.exports.storage = { uploadFile };
