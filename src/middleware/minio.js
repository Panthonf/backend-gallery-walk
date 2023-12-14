// minio.js
import * as Minio from "minio";

const minioClient = new Minio.Client({
  endPoint: "minio-server-v8ax.onrender.com",
  port: 443,
  useSSL: true,
  accessKey: "KSJTluQu9GI8RlRrTjJc",
  secretKey: "BDnPGSl1EIIJfTfaVoQI8cb711Y424JCZqUpdEOm",
});


minioClient.bucketExists("project-bucket", function (err, exists) {
  if (err) {
    return console.log(err);
  }
  if (!exists) {
    minioClient.makeBucket("project-bucket", "us-east-1", function (err) {
      if (err) return console.log(err);
      console.log(`Bucket "project-bucket" created successfully`);
    });
  }
});

minioClient.bucketExists("event-bucket", function (err, exists) {
  if (err) {
    return console.log(err);
  }
  if (!exists) {
    minioClient.makeBucket("event-bucket", "us-east-1", function (err) {
      if (err) return console.log(err);
      console.log(`Bucket "event-bucket" created successfully`);
    });
  }
});

minioClient.listBuckets(function (err, buckets) {
  if (err) return console.log(err);
  console.log("buckets :>> ", buckets);
});

export default minioClient;
