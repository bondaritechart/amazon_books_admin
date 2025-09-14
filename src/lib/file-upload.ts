// File upload utility for handling file uploads to your backend
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface UploadOptions {
  endpoint?: string;
  headers?: Record<string, string>;
  onProgress?: (progress: number) => void;
}

/**
 * Upload a single file to the server
 */
export const uploadFile = async (
  file: File,
  options: UploadOptions = {}
): Promise<UploadResponse> => {
  const {
    endpoint = `${process.env.NEXT_PUBLIC_API_URL}/upload`,
    headers = {},
    onProgress,
  } = options;

  const formData = new FormData();
  formData.append('file', file);

  // Get auth token from cookie
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  };

  const token = getCookie('accessToken');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error('Invalid JSON response'));
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Upload failed'));
    };

    xhr.open('POST', endpoint);
    
    // Set authorization header if token exists
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    // Set additional headers
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.send(formData);
  });
};

/**
 * Upload multiple files
 */
export const uploadFiles = async (
  files: File[],
  options: UploadOptions = {}
): Promise<UploadResponse[]> => {
  const uploadPromises = files.map(file => uploadFile(file, options));
  return Promise.all(uploadPromises);
};

/**
 * Upload files with progress tracking for multiple files
 */
export const uploadFilesWithProgress = async (
  files: File[],
  onProgress?: (fileIndex: number, progress: number, overallProgress: number) => void
): Promise<UploadResponse[]> => {
  const progressMap = new Map<number, number>();
  
  const calculateOverallProgress = () => {
    const total = Array.from(progressMap.values()).reduce((sum, progress) => sum + progress, 0);
    return total / files.length;
  };

  const uploadPromises = files.map((file, index) => 
    uploadFile(file, {
      onProgress: (progress) => {
        progressMap.set(index, progress);
        const overallProgress = calculateOverallProgress();
        onProgress?.(index, progress, overallProgress);
      },
    })
  );

  return Promise.all(uploadPromises);
};

