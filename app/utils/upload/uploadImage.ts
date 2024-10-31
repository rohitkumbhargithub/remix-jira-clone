import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../cloudinary";
import { writeAsyncIterableToWritable } from "@remix-run/node";


export const uploadImageToCloudinary = async (
  data: AsyncIterable<Uint8Array>
) => {
  const uploadPromise = new Promise<UploadApiResponse>(
    async (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder: "remix",
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          }
        );
      await writeAsyncIterableToWritable(
        data,
        uploadStream
      );
    }
  );

  return uploadPromise;
}