'use client';

import { TextInput } from '@/components/form/text-input/text-input';
import { Routes } from '@/constants/routes';
import { useLogin } from '@/data-access/auth/hooks/use-login';
import { setAuthToken } from '@/lib/auth-server';
import { useForm, FormProvider } from 'react-hook-form';
import classes from './login.module.scss';
import { Card, Container, Flex, Heading, Button } from '@radix-ui/themes';
import Cookies from 'js-cookie';

interface FieldValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const methods = useForm<FieldValues>();
  const [login, { loading }] = useLogin();
  const onSubmit = async (data: FieldValues) => {
    try {
      const resp = await login({
        variables: {
          input: data,
        },
      });

      if (resp?.data) {
        // await setAuthToken(resp.data.login.token);
        Cookies.set('accessToken', resp.data.login.token);
        window.location.href = Routes.DASHBOARD;
      }
    } catch (e) {
      console.log('debug e', e);
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
                    Login
                  </Heading>
                  <Flex direction="column" gap="2">
                    <TextInput label="Email" name="email" type="email" />
                    <TextInput
                      label="Password"
                      name="password"
                      type="password"
                    />
                  </Flex>
                  <Button loading={loading} type="submit">
                    Login
                  </Button>
                </Flex>
              </form>
            </FormProvider>
          </Card>
        </Flex>
      </Container>
    </div>
  );
}
