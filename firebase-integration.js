const { initializeApp, cert } = require('firebase-admin/app');
const serviceAccount = require("./firebase-adminsdk.json");
const { getStorage } = require('firebase-admin/storage');
const { getFirestore } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');
require('dotenv').config();

const BUCKET_NAME = 'bis-shufersal-coupons';

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${BUCKET_NAME}.appspot.com`,
  databaseURL: 'https://bis-shufersal-coupons.firebaseio.com'
});


async function uploadFile(filePath) {

  const filename = filePath.substr(filePath.lastIndexOf('/') + 1);
  const bucket = getStorage().bucket();
  await bucket.upload(filePath, {
    destination: filename,
  });

  console.log(`${filePath} uploaded to ${BUCKET_NAME}`);
  await insertDB(filename);
  await sendFCM(filename.substr(0, filename.lastIndexOf('.')));
}



async function insertDB(name) {
  const db = getFirestore();
  const docRef = db.collection(`families/${process.env.GROUP_FAMILY_ID}/coupons`)
    .doc();

  await docRef.set({
    name
  })

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
