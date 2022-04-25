const nodemailer = require('nodemailer');
const process = require('process')
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const getCouponsPath = () => fs.readdirSync(path.join(__dirname, 'vouchers')).map(filename => ({
  path: path.join(__dirname, 'vouchers', filename),
  filename
}))

const archiveCoupons = () => {
  const lasMonthStr = moment().add(-1, 'month').format('MMMM-Y');
  const archiver = require('archiver');

  var output = fs.createWriteStream(`${lasMonthStr}.zip`);
  var archive = archiver('zip');

  output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
    fs.rmSync(path.join(__dirname, 'vouchers'), { recursive: true })
  });

  archive.on('error', function (err) {
    throw err;
  });

  archive.pipe(output);

  // append files from a sub-directory and naming it `new-subdir` within the archive
  archive.directory(path.join(__dirname, 'vouchers'));
  archive.finalize();

}

const sendEmail = async (email, subject, text) => {
  try {

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });

    await transporter.verify();

    await transporter.sendMail({
      from: 'orelbiscoupons@gmail.com',
      to: email,
      attachments: getCouponsPath(),
      subject,
      text
    });
    console.log('success!');
    console.log('archiving coupons...')
    archiveCoupons()




    return {
      status: 200
    }

  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error
    }
  }
}

sendEmail('orelel7@gmail.com', 'testing 123', 'woohoo!');
