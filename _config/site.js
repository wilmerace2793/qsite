/*
* In javascript the variables are declared in camelcase but I like use snake case,
* if you want you can rename them as you want and remove the rule in .eslintrc line 35
*/
const base_url = env('BASE_URL', 'http://localhost:8000');
const api_url = base_url + '/api/isite/v1';


export default {
  baseUrl: base_url,
  apiUrl : api_url,
  siteSettings : api_url + '/tmp',
  settings: api_url + '/settings',
}
