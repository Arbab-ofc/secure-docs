import { cloudinaryConfig, folderStructure, transformOptions } from '../config/cloudinary';

class CloudinaryService {
  
  async uploadFile(file, options = {}) {
    try {
      const {
        folder = 'documents',
        resourceType = 'auto',
        transformation = null
      } = options;

      
      const formData = new FormData();

      
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryConfig.uploadPreset);
      formData.append('folder', `${cloudinaryConfig.baseFolder}/${folder}`);
      formData.append('cloud_name', cloudinaryConfig.cloudName);
      formData.append('resource_type', resourceType);

      
      if (transformation) {
        formData.append('transformation', transformation);
      }

      
      formData.append('tags', [
        'secure-docs',
        folder,
        new Date().getFullYear().toString(),
        options.category || 'general'
      ].join(','));

      
      formData.append('context', `alt=${file.name}|caption=${options.description || ''}`);

      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const result = await response.json();

      
      const uploadResult = {
        success: true,
        publicId: result.public_id,
        url: result.secure_url,
        originalUrl: result.url,
        format: result.format,
        resourceType: result.resource_type,
        size: result.bytes,
        width: result.width,
        height: result.height,
        pages: result.pages,
        duration: result.duration,
        
        thumbnailUrl: this.getThumbnailUrl(result.secure_url, result.resource_type),
        mediumUrl: this.getTransformedUrl(result.secure_url, transformOptions.medium),
        
        filename: result.original_filename,
        fileType: file.type,
        createdAt: new Date(result.created_at * 1000),
        tags: result.tags || []
      };

      return uploadResult;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to upload file'
      };
    }
  }

  
  getThumbnailUrl(url, resourceType) {
    if (!url) return null;

    if (resourceType === 'image') {
      
      return this.getTransformedUrl(url, transformOptions.thumbnail);
    } else if (resourceType === 'raw') {
      
      return '/assets/icons/document-icon.png'; 
    } else if (resourceType === 'video') {
      
      return this.getTransformedUrl(url, {
        ...transformOptions.thumbnail,
        format: 'jpg',
        start_offset: 1 
      });
    }

    return null;
  }

  
  getTransformedUrl(url, transformations) {
    if (!url || !transformations) return url;

    const transformationString = Object.entries(transformations)
      .map(([key, value]) => {
        if (key === 'format') {
          return `f_${value}`;
        } else if (key === 'quality') {
          return `q_${value}`;
        } else if (key === 'width') {
          return `w_${value}`;
        } else if (key === 'height') {
          return `h_${value}`;
        } else if (key === 'crop') {
          return `c_${value}`;
        } else if (key === 'start_offset') {
          return `so_${value}`;
        }
        return `${key}_${value}`;
      })
      .join(',');

    if (transformationString) {
      return url.replace('/upload/', `/upload/${transformationString}/`);
    }

    return url;
  }

  
  async deleteFile(publicId, resourceType = 'auto') {
    try {
      
      
      console.warn('Delete operation should be handled via backend for security');

      return {
        success: false,
        message: 'Delete operation must be handled via backend service'
      };
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  
  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; 
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    const errors = [];

    if (file.size > maxSize) {
      errors.push(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not supported`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  
  getUploadProgress(file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          resolve(percentComplete);
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      
      
    });
  }

  
  getFolderPath(category) {
    return folderStructure[category] || folderStructure.others;
  }

  
  generateUploadSignature(params) {
    
    
    throw new Error('Signature generation must be done on the backend');
  }

  
  async uploadMultipleFiles(files, options = {}) {
    const uploadPromises = [];
    const results = [];

    for (const file of files) {
      const uploadPromise = this.uploadFile(file, options);
      uploadPromises.push(uploadPromise);
    }

    try {
      const uploadResults = await Promise.allSettled(uploadPromises);

      uploadResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push({
            file: files[index],
            ...result.value
          });
        } else {
          results.push({
            file: files[index],
            success: false,
            error: result.reason.message
          });
        }
      });

      return {
        success: true,
        results,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }

  
  async getFileInfo(url) {
    try {
      
      const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
      if (!matches) {
        throw new Error('Invalid Cloudinary URL');
      }

      const publicId = matches[1];

      
      
      return {
        success: true,
        publicId,
        url,
        thumbnailUrl: this.getThumbnailUrl(url)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  
  optimizeForWeb(url, options = {}) {
    const defaultOptimizations = {
      quality: 'auto:good',
      format: 'auto',
      fetch_format: 'auto'
    };

    const optimizations = { ...defaultOptimizations, ...options };

    return this.getTransformedUrl(url, optimizations);
  }

  
  generateResponsiveUrls(url) {
    return {
      thumbnail: this.getTransformedUrl(url, transformOptions.thumbnail),
      medium: this.getTransformedUrl(url, transformOptions.medium),
      large: this.getTransformedUrl(url, {
        width: 1200,
        height: 800,
        crop: 'limit',
        quality: 'auto:good'
      }),
      original: url
    };
  }

  
  createSignedUrl(url, options = {}) {
    
    throw new Error('Signed URL generation must be done on the backend');
  }
}


export default new CloudinaryService();