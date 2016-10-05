/*jshint esversion: 6 */
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
let accessKeyId = '';
let secretAccessKey = '';
let region = '';
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
