const moduleName = 'isite';
const moduleVersion = 'v1';
const baseApiUrl = `${env('BASE_URL', 'http://localhost:8000')}/api`;
const urlBase = `${baseApiUrl}/${moduleName}/${moduleVersion}`

export default {
  urlBase : urlBase,
  version: moduleVersion,
  settings: `${urlBase}/settings`,
  appVersion: `${urlBase}/site/version`,
  siteSettings: `${urlBase}/site/settings`,
  permissions: `${urlBase}/site/permissions`,
}
