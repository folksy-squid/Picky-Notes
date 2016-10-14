/*jshint esversion: 6 */

const AWS = require('aws-sdk');
const fs = require('fs');

let accessKeyId = '';
let secretAccessKey = '';
let region = '';
//
if (process.env.NODE_ENV === 'test') {
  accessKeyId = require('../../example_keys.js').aws.AWS_ACCESS_KEY_ID;
  secretAccessKey = require('../../example_keys.js').aws.AWS_SECRET_ACCESS_KEY;
  region = require('../../example_keys.js').aws.AWS_REGION;
} else {
  accessKeyId = require('../../keys.js').aws.AWS_ACCESS_KEY_ID;
  secretAccessKey = require('../../keys.js').aws.AWS_SECRET_ACCESS_KEY;
  region = require('../../keys.js').aws.AWS_REGION;
}

const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region
});

const params = {
  Bucket: 'picky-notes',
  ACL: 'public-read',
  ContentType: 'audio/mp3'
};

module.exports = {
  startUploading: (stream, path, cb) =>{
    console.log('stream!', stream);

    params['Key'] = path;
    params['Body'] = fs.createReadStream(stream);

    s3.upload(params, (err, data) => {
      cb(err, data);
    });

  },
  endUploading: () => {
    // end stream recording

  }
};
