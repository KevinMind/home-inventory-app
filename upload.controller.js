const AWS = require('aws-sdk')
const async = require('async')
const bucketName = "uploads.hiapp.io"
const path = require('path')
const fs = require('fs')
let pathParams, image, imageName;

/** Load Config File */
AWS.config.loadFromPath('config.json')

/** After config file load, create object for s3*/
const s3 = new AWS.S3({
  region: 'us-east-1'
})


// Creates Bucket
const createMainBucket = (callback) => {
  console.log("1. Beginning create bucket.");
	// Create the parameters for calling createBucket
	const bucketParams = {
	   Bucket : bucketName
	};
  console.log("1. params: ", bucketParams);
	s3.headBucket(bucketParams, function(err, data) {
	   if (err) {
	   	console.log("ErrorHeadBucket", err);
	      	s3.createBucket(bucketParams, function(err, data) {
			   if (err) {
			   	console.log("Error", err);
			      callback(err, null)
			   } else {
            console.log("1a. no error.. here's some data: ", data);
			      callback(null, data)
			   }
			});
	   } else {
        console.log("1b. no error her is the headbucket data: ", data);
	      callback(null, data)
	   }
	})
}

const createItemObject = (callback) => {
  const params = {
        Bucket: bucketName,
        Key: `${imageName}`,
        ACL: 'public-read',
        Body:image
    };
  console.log("2. Begin create item object: ", params);
	s3.putObject(params, function (err, data) {
    console.log("2a. begin putOBject")
		if (err) {
	    	console.log("Error uploading image: ", err);
	    	callback(err, null)
	    } else {
	    	console.log("2b. Successfully uploaded image on S3", data);
        // Callback for successful s3 upload
	    	callback(null, data)
	    }
	})
}

const createMongoDbRecord = (callback) => {
  console.log("3. beginning createMongoDbRecord: ")
  console.log("THIS ONE: ", `${data}`);

  console.log(payload)
  db.collection('items').save(payload, (err, result) => {
      if (err) {
        console.log(err);
        callback(err, null)
      } else {
        callback(null, data)
      }
  });
}

exports.upload = (req, res, next) => {

  var tmp_path = req.files.file.path;
  image = fs.createReadStream(tmp_path);
  imageName = req.files.file.name;
  data= req.body;
  payload = {
    'name': req.body.name,
    'quantity': req.body.quantity,
    'room': data.room,
    'photos': `${imageName}`,
    'length': data.length,
    'width': data.width,
    'height': data.height,
    'store': data.store,
    'brand': data.brand,
    'model': data.model,
    'serial': data.serial,
    'cost': data.cost
  }

  async.series([
    createMainBucket,
    createItemObject,
    createMongoDbRecord,
    ], (err, result) => {
      if(err) return res.send(err)
      else res.redirect("/items")
    }
  )
};


exports.displayForm = (req, res) => {
    var name = "Kevin";
    res.render('pages/items-add.html', {"name": name});
};