import { Flex, Button, Text, Card } from '@radix-ui/themes';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { useRef, ChangeEvent } from 'react';
import { TrashIcon, UploadIcon } from '@radix-ui/react-icons';

interface FileUploadProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  accept?: string;
  multiple?: boolean;
}

export const FileUpload = <T extends FieldValues>({
  name,
  label,
  accept,
  multiple = false,
}: FileUploadProps<T>) => {
  const { setValue, watch, register } = useFormContext<T>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const files = watch(name) as FileList | File[] | null;
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      if (multiple) {
        setValue(name, Array.from(selectedFiles) as any);
      } else {
        setValue(name, selectedFiles[0] as any);
      }
    }
  };

  const handleRemoveFile = (indexToRemove?: number) => {
    if (multiple && Array.isArray(files)) {
      const updatedFiles = files.filter((_, index) => index !== indexToRemove);
      setValue(name, updatedFiles as any);
    } else {
      setValue(name, null as any);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const renderFileList = () => {
    if (!files) return null;

    if (multiple && Array.isArray(files)) {
      return (
        <Flex direction="column" gap="2">
          {files.map((file, index) => (
            <Card key={index} variant="surface" size="1">
              <Flex justify="between" align="center">
                <Text size="2">{file.name}</Text>
                <Button
                  variant="ghost"
                  size="1"
                  color="red"
                  onClick={() => handleRemoveFile(index)}
                >
                  <TrashIcon />
                </Button>
              </Flex>
            </Card>
          ))}
        </Flex>
      );
    } else if (files instanceof File) {
      return (
        <Card variant="surface" size="1">
          <Flex justify="between" align="center">
            <Text size="2">{files.name}</Text>
            <Button
              variant="ghost"
              size="1"
              color="red"
              onClick={() => handleRemoveFile()}
            >
              <TrashIcon />
            </Button>
          </Flex>
        </Card>
      );
    }

    return null;
  };

  // Register the input for form validation
  register(name);

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
      />
      
      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        style={{ cursor: 'pointer' }}
      >
        <UploadIcon />
        {multiple ? 'Choose Files' : 'Choose File'}
      </Button>
      
      {renderFileList()}
    </Flex>
  );
};

