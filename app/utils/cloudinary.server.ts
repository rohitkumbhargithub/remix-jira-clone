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


// async function deleteImageFromCloudinary(publicId: string) {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId);
//     if (result.result === "not found") {
//       console.log(`Image with public ID ${publicId} not found.`);
//     } else {
//       console.log("Image deleted:", result);
//     }
//   } catch (error) {
//     console.error("Error deleting image from Cloudinary:", error);
//   }
// }

// // Call the function with the extracted public ID
// deleteImageFromCloudinary("ketekol7vze962yrdotm");