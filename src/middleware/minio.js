// minio.js
import * as Minio from "minio";

// const minioClient = new Minio.Client({
//   endPoint: "minio-server-v8ax.onrender.com",
//   port: 443,
//   useSSL: true,
//   accessKey: "KSJTluQu9GI8RlRrTjJc",
//   secretKey: "BDnPGSl1EIIJfTfaVoQI8cb711Y424JCZqUpdEOm",
// });

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USESSL === "true",
  accessKey: process.env.MINIO_ACCESSKEY,
  secretKey: process.env.MINIO_SECRETKEY,
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
