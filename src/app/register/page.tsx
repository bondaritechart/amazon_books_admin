'use client';

import { TextInput } from '@/components/form/text-input/text-input';
import { useRegister } from '@/data-access/auth/hooks/use-register';
import { setAuthToken } from '@/lib/auth-server';
import { useForm, FormProvider } from 'react-hook-form';
import classes from './registrer.module.scss';
import { Card, Container, Flex, Heading, Button } from '@radix-ui/themes';

interface FieldValues {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}

export default function RegisterPage() {
  const methods = useForm<FieldValues>();

  const [register] = useRegister();

  const onSubmit = async (data: FieldValues) => {
    const resp = await register({
      variables: {
        input: data,
      },
    });
    if (resp?.data) {
      await setAuthToken(resp.data.register.token);
      alert('Registered successfully!');
    }
  };

  return (
    <div className={classes.wrapper}>
      <Container px="4" size="1" height="100dvh">
        <Flex direction="column" height="100%" justify="center">
          <Card variant="classic">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Flex direction="column" gap="4" p="4">
                  <Heading size="6" weight="medium">
                    Register
                  </Heading>
                  <Flex direction="column" gap="2">
                    <TextInput label="Email" name="email" type="email" />
                    <TextInput
                      label="Password"
                      name="password"
                      type="password"
                    />
                    <TextInput label="Username" name="username" />
                    <TextInput label="First name" name="firstName" />
                    <TextInput label="Last name" name="lastName" />
                  </Flex>
                  <Button type="submit">Submit</Button>
                </Flex>
              </form>
            </FormProvider>
          </Card>
        </Flex>
      </Container>
    </div>
  );
}
