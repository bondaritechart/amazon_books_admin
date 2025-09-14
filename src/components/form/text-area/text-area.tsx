import { Flex, TextArea as RaTextArea } from '@radix-ui/themes';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
}

export const TextArea = <T extends FieldValues>({
  name,
  label,
}: InputProps<T>) => {
  const { register } = useFormContext();

  return (
    <Flex direction="column" gap="1">
      <label>{label}</label>
      <RaTextArea {...register(name)} />
    </Flex>
  );
};
