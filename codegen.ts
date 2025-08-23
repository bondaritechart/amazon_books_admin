import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:5000/graphql',
  documents: ['src/**/*.ts'],
  generates: {
    './src/types/': {
      preset: 'client',
    },
  },
};

export default config;
