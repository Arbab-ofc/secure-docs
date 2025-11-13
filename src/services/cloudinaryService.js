import { cloudinaryConfig, folderStructure, transformOptions } from '../config/cloudinary';

class CloudinaryService {
  // Upload file to Cloudinary
  async uploadFile(file, options = {}) {
    try {
      const {
        folder = 'documents',
        resourceType = 'auto',
        transformation = null
      } = options;

      // Create form data for upload
      const formData = new FormData();

      // Required parameters
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryConfig.uploadPreset);
      formData.append('folder', `${cloudinaryConfig.baseFolder}/${folder}`);
      formData.append('cloud_name', cloudinaryConfig.cloudName);
      formData.append('resource_type', resourceType);

      // Optional parameters
      if (transformation) {
        formData.append('transformation', transformation);
      }

      // Add tags for better organization
      formData.append('tags', [
        'secure-docs',
        folder,
        new Date().getFullYear().toString(),
        options.category || 'general'
      ].join(','));

      // Add context metadata
      formData.append('context', `alt=${file.name}|caption=${options.description || ''}`);

      // Upload to Cloudinary
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

      // Transform the response to our format
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
        // Thumbnail URLs
        thumbnailUrl: this.getThumbnailUrl(result.secure_url, result.resource_type),
        mediumUrl: this.getTransformedUrl(result.secure_url, transformOptions.medium),
        // Metadata
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

  // Get thumbnail URL for a file
  getThumbnailUrl(url, resourceType) {
    if (!url) return null;

    if (resourceType === 'image') {
      // Return a smaller version of the image
      return this.getTransformedUrl(url, transformOptions.thumbnail);
    } else if (resourceType === 'raw') {
      // For documents like PDF, use a document icon
      return '/assets/icons/document-icon.png'; // Would need to create this asset
    } else if (resourceType === 'video') {
      // Extract thumbnail from video
      return this.getTransformedUrl(url, {
        ...transformOptions.thumbnail,
        format: 'jpg',
        start_offset: 1 // Get thumbnail from 1 second into video
      });
    }

    return null;
  }

  // Get transformed URL
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

  // Delete file from Cloudinary
  async deleteFile(publicId, resourceType = 'auto') {
    try {
      // In a real implementation, this would need to be done via backend
      // as it requires signature generation
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

  // Validate file before upload
  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
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

  // Get upload progress (for large files)
  getUploadProgress(file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track progress
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

      // Note: The actual upload logic would be implemented here
      // This is just a skeleton for progress tracking
    });
  }

  // Get folder structure for a category
  getFolderPath(category) {
    return folderStructure[category] || folderStructure.others;
  }

  // Generate upload signature (backend only)
  generateUploadSignature(params) {
    // This should be implemented on the backend
    // Never expose API secrets on the client side
    throw new Error('Signature generation must be done on the backend');
  }

  // Batch upload multiple files
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

  // Get file info from URL
  async getFileInfo(url) {
    try {
      // Extract public ID from Cloudinary URL
      const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
      if (!matches) {
        throw new Error('Invalid Cloudinary URL');
      }

      const publicId = matches[1];

      // In a real implementation, this would fetch file info via API
      // For now, return basic info extracted from URL
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

  // Optimize image for web
  optimizeForWeb(url, options = {}) {
    const defaultOptimizations = {
      quality: 'auto:good',
      format: 'auto',
      fetch_format: 'auto'
    };

    const optimizations = { ...defaultOptimizations, ...options };

    return this.getTransformedUrl(url, optimizations);
  }

  // Generate responsive image URLs
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

  // Create signed URL for secure delivery
  createSignedUrl(url, options = {}) {
    // This would need to be implemented on the backend
    throw new Error('Signed URL generation must be done on the backend');
  }
}

// Export singleton instance
export default new CloudinaryService();