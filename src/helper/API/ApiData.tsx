import AuthStorage from '../AuthStorage';
import { API } from '../../config/API/api.config';

export const BaseURL = API.endpoint + '/';


const axios = require('axios').default;

const defaultHeaders = {
    isAuth: true,
    AdditionalParams: {},
    isJsonRequest: true
};


interface apiResponse {
    data: {
        data: any,
        message: string,
        status: number
    },
    status: number
}


export const ApiGet = (type: string) => {
    const s = type.includes('?') ? '&' : '?';
    return new Promise((resolve, reject) => {
        axios.get(`${BaseURL}${type}${s}lang=${AuthStorage.getLang()}`, getHttpOptions())
            .then((responseJson: apiResponse) => {
                resolve(responseJson.data);
            })
            .catch((error: any) => {
                if (error?.response?.status === 401) {
                    AuthStorage.deauthenticateUser();
                    window.location.href = "/"
                }
                if (error && error.hasOwnProperty('response') &&
                    error.response && error.response.hasOwnProperty('data') && error.response.data &&
                    error.response.data.hasOwnProperty('error') && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}


export const ApiGetNoAuth = (type: string) => {
    const s = type.includes('?') ? '&' : '?';
    return new Promise((resolve, reject) => {
        axios.get(`${BaseURL}${type}${s}lang=${AuthStorage.getLang()}`, getHttpOptions({ ...defaultHeaders, isAuth: false }))
            .then((responseJson: apiResponse) => {
                resolve(responseJson.data);
            })
            .catch((error: any) => {
                if (error?.response?.status === 401) {
                    AuthStorage.deauthenticateUser();
                    window.location.href = "/"
                }
                if (error && error.hasOwnProperty('response') &&
                    error.response && error.response.hasOwnProperty('data') && error.response.data &&
                    error.response.data.hasOwnProperty('error') && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}


export const ApiPost = (type: string, userData: any) => {
    const s = type.includes('?') ? '&' : '?';
    return new Promise((resolve, reject) => {
        axios.post(`${BaseURL}${type}${s}lang=${AuthStorage.getLang()}`, userData, getHttpOptions())
            .then((responseJson: apiResponse) => {
                resolve(responseJson.data);
            })
            .catch((error: any) => {
                if (error?.response?.status === 401) {
                    AuthStorage.deauthenticateUser();
                    window.location.href = "/"
                }
                if (error && error.hasOwnProperty('response') &&
                    error.response && error.response.hasOwnProperty('data') && error.response.data &&
                    error.response.data.hasOwnProperty('error') && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}


export const ApiPostNoAuth = (type: string, userData: any) => {
    const s = type.includes('?') ? '&' : '?';
    return new Promise((resolve, reject) => {
        axios.post(`${BaseURL}${type}${s}lang=${AuthStorage.getLang()}`, userData, getHttpOptions({ ...defaultHeaders, isAuth: false }))
            .then((responseJson: apiResponse) => {
                resolve(responseJson.data);
            })
            .catch((error: any) => {
                if (error?.response?.status === 401) {
                    AuthStorage.deauthenticateUser();
                    window.location.href = "/"
                }
                if (error && error.hasOwnProperty('response') &&
                    error.response && error.response.hasOwnProperty('data') && error.response.data &&
                    error.response.data.hasOwnProperty('message') && error.response.data.message) {
                    reject(error.response.data.message);
                } else {
                    reject(error);
                }
            });
    });
}


export const ApiPatch = (type: String, userData: any) => {
    const s = type.includes('?') ? '&' : '?';
    return new Promise((resolve, reject) => {
        axios.patch(`${BaseURL}${type}${s}lang=${AuthStorage.getLang()}`, userData, getHttpOptions())
            .then((responseJson: apiResponse) => {
                resolve(responseJson);
            })
            .catch((error: any) => {
                if (error?.response?.status === 401) {
                    AuthStorage.deauthenticateUser();
                    window.location.href = "/"
                }
                if (error && error.hasOwnProperty('response') &&
                    error.response && error.response.hasOwnProperty('data') && error.response.data &&
                    error.response.data.hasOwnProperty('error') && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}


export const ApiDelete = (type: string, userData: any) => {
    const s = type.includes('?') ? '&' : '?';
    return new Promise((resolve, reject) => {
        axios.delete(`${BaseURL}${type}${s}lang=${AuthStorage.getLang()}`, getHttpOptions())
            .then((responseJson: apiResponse) => {
                resolve(responseJson);
            })
            .catch((error: any) => {
                if (error?.response?.status === 401) {
                    AuthStorage.deauthenticateUser();
                    window.location.href = "/"
                }
                if (error && error.hasOwnProperty('response') &&
                    error.response && error.response.hasOwnProperty('data') && error.response.data &&
                    error.response.data.hasOwnProperty('error') && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}

export const ApiPut = (type: string, userData: any) => {
    const s = type.includes('?') ? '&' : '?';
    return new Promise((resolve, reject) => {
        axios.put(`${BaseURL}${type}${s}lang=${AuthStorage.getLang()}`, userData, getHttpOptions())
            .then((responseJson: any) => {
                resolve(responseJson);
            })
            .catch((error: any) => {
                if (error?.response?.status === 401) {
                    AuthStorage.deauthenticateUser();
                    window.location.href = "/"
                }
                if (error && error.hasOwnProperty('response') &&
                    error.response && error.response.hasOwnProperty('data') && error.response.data &&
                    error.response.data.hasOwnProperty('error') && error.response.data.error) {
                    reject(error.response.data.error);
                } else {
                    reject(error);
                }
            });
    });
}



export const getHttpOptions = (options = defaultHeaders) => {
    let headers = {
        Authorization: "",
        'Content-Type': "application/json",

    };

    if (options.hasOwnProperty('isAuth') && options.isAuth) {
        headers['Authorization'] = AuthStorage.getToken() ?? "";
    }

    if (options.hasOwnProperty('isJsonRequest') && options.isJsonRequest) {
        headers['Content-Type'] = 'application/json';
    }

    if (options.hasOwnProperty('AdditionalParams') && options.AdditionalParams) {
        headers = { ...headers, ...options.AdditionalParams };
    }

    return { headers }
}