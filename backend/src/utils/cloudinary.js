import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv'

dotenv.config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
  try {
      if (!localFilePath) {
          console.log("No file path provided");
          return null;
      }

      const uploadParams = await cloudinary.uploader.upload(localFilePath, {
          resource_type: 'auto',
      });

      //console.log("file is uploaded to cloudinary: ", uploadParams);
      
      fs.unlinkSync(localFilePath);  // Delete local file after upload
      return uploadParams;
  } catch (error) {
      console.error("Cloudinary upload failed:", error);
      fs.unlinkSync(localFilePath);  // Ensure file is deleted even if upload fails
      return null;
  }
}



export default uploadOnCloudinary;