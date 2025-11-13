const requiredEnv = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
};

if (!requiredEnv.cloudName || !requiredEnv.uploadPreset) {
  throw new Error('Missing Cloudinary config. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.');
}

export const cloudinaryConfig = {
  cloudName: requiredEnv.cloudName,
  uploadPreset: requiredEnv.uploadPreset,
  folderMode: import.meta.env.VITE_CLOUDINARY_FOLDER_MODE || 'dynamic',
  baseFolder: import.meta.env.VITE_CLOUDINARY_BASE_FOLDER || 'secure-documents'
};


export const uploadPresets = {
  documents: "document_share",
  images: "image_share",
  profiles: "profile_pictures"
};


export const folderStructure = {
  education: "education-documents",
  healthcare: "healthcare-records",
  government: "government-ids",
  transportation: "transportation-documents",
  others: "other-documents"
};


export const transformOptions = {
  thumbnail: {
    width: 200,
    height: 200,
    crop: "fill",
    quality: "auto",
    format: "auto"
  },
  medium: {
    width: 800,
    height: 600,
    crop: "limit",
    quality: "auto:good",
    format: "auto"
  },
  full: {
    quality: "auto:good",
    format: "auto"
  }
};


export const securityConfig = {
  resourceType: "auto",
  type: "upload",
  eager: [
    {
      format: "jpg",
      quality: "auto:good",
      secure_url: true
    }
  ]
};

export default cloudinaryConfig;
