import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import { uploadFile, uploadFiles, UploadResponse } from '@/lib/file-upload';
import { SAVE_FILE_METADATA, UPDATE_USER_AVATAR } from '../mutations/upload-file';

export interface FileUploadProgress {
  fileIndex: number;
  progress: number;
  overallProgress: number;
}

export interface UseFileUploadOptions {
  onProgress?: (progress: FileUploadProgress) => void;
  onSuccess?: (responses: UploadResponse[]) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for uploading files and optionally saving metadata to GraphQL
 */
export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<FileUploadProgress | null>(null);
  
  const [saveFileMetadata] = useMutation(SAVE_FILE_METADATA);

  const uploadSingleFile = useCallback(async (file: File): Promise<UploadResponse> => {
    setIsUploading(true);
    setProgress({ fileIndex: 0, progress: 0, overallProgress: 0 });

    try {
      const response = await uploadFile(file, {
        onProgress: (progress) => {
          const progressInfo = { fileIndex: 0, progress, overallProgress: progress };
          setProgress(progressInfo);
          options.onProgress?.(progressInfo);
        },
      });

      setProgress({ fileIndex: 0, progress: 100, overallProgress: 100 });
      options.onSuccess?.([response]);
      return response;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Upload failed');
      options.onError?.(errorObj);
      throw errorObj;
    } finally {
      setIsUploading(false);
    }
  }, [options]);

  const uploadMultipleFiles = useCallback(async (files: File[]): Promise<UploadResponse[]> => {
    setIsUploading(true);
    setProgress({ fileIndex: 0, progress: 0, overallProgress: 0 });

    try {
      const progressMap = new Map<number, number>();
      
      const calculateOverallProgress = () => {
        const total = Array.from(progressMap.values()).reduce((sum, progress) => sum + progress, 0);
        return total / files.length;
      };

      const uploadPromises = files.map((file, index) => 
        uploadFile(file, {
          onProgress: (fileProgress) => {
            progressMap.set(index, fileProgress);
            const overallProgress = calculateOverallProgress();
            const progressInfo = { fileIndex: index, progress: fileProgress, overallProgress };
            setProgress(progressInfo);
            options.onProgress?.(progressInfo);
          },
        })
      );

      const responses = await Promise.all(uploadPromises);
      setProgress({ fileIndex: files.length - 1, progress: 100, overallProgress: 100 });
      options.onSuccess?.(responses);
      return responses;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Upload failed');
      options.onError?.(errorObj);
      throw errorObj;
    } finally {
      setIsUploading(false);
    }
  }, [options]);

  const saveMetadataToGraphQL = useCallback(async (uploadResponse: UploadResponse) => {
    return saveFileMetadata({
      variables: {
        input: {
          url: uploadResponse.url,
          filename: uploadResponse.filename,
          size: uploadResponse.size,
          mimeType: uploadResponse.mimeType,
        },
      },
    });
  }, [saveFileMetadata]);

  return {
    uploadSingleFile,
    uploadMultipleFiles,
    saveMetadataToGraphQL,
    isUploading,
    progress,
  };
};

/**
 * Hook specifically for updating user avatar
 */
export const useAvatarUpload = () => {
  const [updateUserAvatar, { loading: isUpdating }] = useMutation(UPDATE_USER_AVATAR);
  
  const { uploadSingleFile, isUploading } = useFileUpload();

  const uploadAndUpdateAvatar = useCallback(async (file: File) => {
    try {
      // First upload the file
      const uploadResponse = await uploadSingleFile(file);
      
      // Then update the user's avatar in GraphQL
      const result = await updateUserAvatar({
        variables: {
          avatarUrl: uploadResponse.url,
        },
      });

      return result;
    } catch (error) {
      throw error;
    }
  }, [uploadSingleFile, updateUserAvatar]);

  return {
    uploadAndUpdateAvatar,
    isUploading: isUploading || isUpdating,
  };
};

