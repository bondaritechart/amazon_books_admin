import { Flex, TextField } from '@radix-ui/themes';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

interface InputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?:
    | 'number'
    | 'search'
    | 'time'
    | 'text'
    | 'hidden'
    | 'tel'
    | 'url'
    | 'email'
    | 'date'
    | 'datetime-local'
    | 'month'
    | 'password'
    | 'week'
    | undefined;
}

export const TextInput = <T extends FieldValues>({
  name,
  label,
  type = 'text',
}: InputProps<T>) => {
  const { register } = useFormContext();

  return (
    <Flex direction="column" gap="1">
      <label>{label}</label>
      <TextField.Root type={type} {...register(name)} />
    </Flex>
  );
};
