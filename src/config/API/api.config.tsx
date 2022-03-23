import API_LOCAL from './api-local';
import API_PROD from './api-prod';
const hostname = window.location.hostname;
const port = window.location.port;
let isLocalApi =  +port >= 3000;

export const API =
    (hostname === 'localhost' && isLocalApi) ? API_LOCAL : API_PROD
// console.log("API", API, hostname, isLocalApi);