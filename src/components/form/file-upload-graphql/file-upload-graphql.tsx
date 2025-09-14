import { Flex, Button, Text, Card, Progress, Callout } from '@radix-ui/themes';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { useRef, ChangeEvent, useState, useCallback } from 'react';
import { TrashIcon, UploadIcon, CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useFileUpload, FileUploadProgress } from '@/data-access/file/hooks/use-file-upload';
import { UploadResponse } from '@/lib/file-upload';

interface FileUploadGraphQLProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  accept?: string;
  multiple?: boolean;
  saveMetadata?: boolean; // Whether to save file metadata to GraphQL
  onUploadComplete?: (responses: UploadResponse[]) => void;
}

export const FileUploadGraphQL = <T extends FieldValues>({
  name,
  label,
  accept,
  multiple = false,
  saveMetadata = false,
  onUploadComplete,
}: FileUploadGraphQLProps<T>) => {
  const { setValue, watch } = useFormContext<T>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const files = watch(name) as UploadResponse[] | UploadResponse | null;
  
  const { uploadSingleFile, uploadMultipleFiles, saveMetadataToGraphQL, isUploading, progress } = useFileUpload({
    onProgress: (progress: FileUploadProgress) => {
      console.log(`File ${progress.fileIndex}: ${progress.progress}% - Overall: ${progress.overallProgress}%`);
    },
    onSuccess: (responses: UploadResponse[]) => {
      if (multiple) {
        setValue(name, responses as any);
      } else {
        setValue(name, responses[0] as any);
      }
      onUploadComplete?.(responses);
      setUploadError(null);
    },
    onError: (error: Error) => {
      setUploadError(error.message);
    },
  });

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setUploadError(null);
    
    try {
      const fileArray = Array.from(selectedFiles);
      
      if (multiple) {
        const responses = await uploadMultipleFiles(fileArray);
        
        // Save metadata to GraphQL if requested
        if (saveMetadata) {
          await Promise.all(responses.map(response => saveMetadataToGraphQL(response)));
        }
      } else {
        const response = await uploadSingleFile(fileArray[0]);
        
        // Save metadata to GraphQL if requested
        if (saveMetadata) {
          await saveMetadataToGraphQL(response);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, [multiple, uploadSingleFile, uploadMultipleFiles, saveMetadata, saveMetadataToGraphQL]);

  const handleRemoveFile = useCallback((indexToRemove?: number) => {
    if (multiple && Array.isArray(files)) {
      const updatedFiles = files.filter((_, index) => index !== indexToRemove);
      setValue(name, updatedFiles as any);
    } else {
      setValue(name, null as any);
    }
    setUploadError(null);
  }, [multiple, files, setValue, name]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const renderFileList = () => {
    if (!files) return null;

    if (multiple && Array.isArray(files)) {
      return (
        <Flex direction="column" gap="2">
          {files.map((uploadResponse, index) => (
            <Card key={index} variant="surface" size="1">
              <Flex justify="between" align="center">
                <Flex direction="column" gap="1">
                  <Text size="2" weight="medium">{uploadResponse.filename}</Text>
                  <Text size="1" color="gray">
                    {(uploadResponse.size / 1024).toFixed(1)} KB • {uploadResponse.mimeType}
                  </Text>
                </Flex>
                <Flex align="center" gap="2">
                  <CheckIcon color="green" />
                  <Button
                    variant="ghost"
                    size="1"
                    color="red"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <TrashIcon />
                  </Button>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      );
    } else if (files && 'url' in files) {
      return (
        <Card variant="surface" size="1">
          <Flex justify="between" align="center">
            <Flex direction="column" gap="1">
              <Text size="2" weight="medium">{files.filename}</Text>
              <Text size="1" color="gray">
                {(files.size / 1024).toFixed(1)} KB • {files.mimeType}
              </Text>
            </Flex>
            <Flex align="center" gap="2">
              <CheckIcon color="green" />
              <Button
                variant="ghost"
                size="1"
                color="red"
                onClick={() => handleRemoveFile()}
              >
                <TrashIcon />
              </Button>
            </Flex>
          </Flex>
        </Card>
      );
    }

    return null;
  };

  return (
    <Flex direction="column" gap="2">
      <label>{label}</label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={isUploading}
      />
      
      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        disabled={isUploading}
        style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}
      >
        <UploadIcon />
        {isUploading ? 'Uploading...' : (multiple ? 'Choose Files' : 'Choose File')}
      </Button>

      {/* Progress bar */}
      {isUploading && progress && (
        <Flex direction="column" gap="1">
          <Progress value={progress.overallProgress} size="2" />
          <Text size="1" color="gray">
            {multiple && `File ${progress.fileIndex + 1}: `}
            {Math.round(progress.overallProgress)}% complete
          </Text>
        </Flex>
      )}

      {/* Error display */}
      {uploadError && (
        <Callout.Root color="red" variant="soft">
          <Callout.Icon>
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>{uploadError}</Callout.Text>
        </Callout.Root>
      )}

      {/* File list */}
      {renderFileList()}
    </Flex>
  );
};

