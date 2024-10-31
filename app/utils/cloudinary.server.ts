import { writeAsyncIterableToWritable } from "@remix-run/node";
import { cloudinary } from "./cloudinary";


async function uploadImage(data: AsyncIterable<Uint8Array>) {
  const uploadPromise = new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "remix",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      },
    );
    await writeAsyncIterableToWritable(data, uploadStream);
  });

  return uploadPromise;
}

export { uploadImage };