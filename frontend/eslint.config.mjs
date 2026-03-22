import next from 'eslint-config-next';

const config = [
  {
    ignores: ['.next/**', '.open-next/**'],
  },
  ...next,
];

export default config;
