import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  baseUrl: 'api',
  appName: 'Unity App',
  enableDebugMode: true,
  logLevel: 'debug',
};
