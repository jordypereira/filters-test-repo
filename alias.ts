import { resolve } from 'path'

export const alias = {
  configuration: resolve(__dirname, './configuration/'),
  contracts: resolve(__dirname, './contracts/'),
  data: resolve(__dirname, './data/'),
  helpers: resolve(__dirname, './helpers/'),
  layouts: resolve(__dirname, './layouts/'),
  lib: resolve(__dirname, './lib/'),
  utils: resolve(__dirname, './utils/'),
  plugins: resolve(__dirname, './plugins/'),
  repositories: resolve(__dirname, './repositories/'),
  server: resolve(__dirname, './server/'),
  tools: resolve(__dirname, './tools/'),
  types: resolve(__dirname, './types/'),
}
