/*jshint esversion: 6 */
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

if (process.env.NODE_ENV==='test') {
  const accessKeyId = require('../../example_keys.js').aws.AWS_ACCESS_KEY_ID;
  const secretAccessKey = require('../../example_keys.js').aws.AWS_SECRET_ACCESS_KEY;
  const region = require('../../example_keys.js').aws.AWS_REGION;
} else {
  const accessKeyId = require('../../keys.js').aws.AWS_ACCESS_KEY_ID;
  const secretAccessKey = require('../../keys.js').aws.AWS_SECRET_ACCESS_KEY;
  const region = require('../../keys.js').aws.AWS_REGION;
}

const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region
});

module.exports = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'picky-notes',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    metadata: function(req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});
