import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class UploadService {
  public static async uploadFiles(
    files: Express.Multer.File[],
    folder = process.env.CLOUDINARY_UPLOAD_FOLDER
  ): Promise<string[]> {
    const urls: string[] = [];

    for (const file of files) {
      const url = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder,
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result.secure_url);
          }
        );

        uploadStream.end(file.buffer); // use multer buffer directly
      });

      urls.push(url);
    }

    return urls;
  }

  public static async deleteFiles(urls: string[]): Promise<void> {
    const publicIds = urls.map(UploadService.extractPublicId);
    await cloudinary.api.delete_resources(publicIds);
  }

  public static async updateFiles(
    oldUrls: string[],
    newFiles: Express.Multer.File[],
    folder = process.env.CLOUDINARY_UPLOAD_FOLDER
  ): Promise<string[]> {
    await this.deleteFiles(oldUrls);
    return this.uploadFiles(newFiles, folder);
  }

  private static extractPublicId(url: string): string {
    const path = new URL(url).pathname;
    const segments = path.split("/").filter(Boolean);
    const folderName = process.env.CLOUDINARY_UPLOAD_FOLDER || "lms";
    const cloudNameIndex = segments.indexOf(folderName);
    const publicIdWithExt = segments.slice(cloudNameIndex).join("/");
    return publicIdWithExt.replace(/\.[^/.]+$/, "");
  }
}

export default UploadService;
