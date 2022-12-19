import { SECOND } from '@constants/common';
import { TokenManagerSingleTon } from '@services/token';
import Axios from 'axios';
import changeCase from 'change-object-case';
import { ServerError } from './exceptions';

const isDebug = process.env.NODE_ENV !== 'production';

export const serverProxy = Axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: SECOND * 5,
    responseType: 'json',
    withCredentials: true,
});

export function generateError(errorData: any) {
    if (errorData.response) {
        const message = `${errorData.message}. ${JSON.stringify(errorData.response.data) || ''}.`;
        return new ServerError(message, errorData.response.status);
    }

    const message = `${errorData.message}.`;
    return new ServerError(message, 0);
}

serverProxy.interceptors.request.use(
    (config) => {
        config.headers['Authorization'] = `Bearer ${TokenManagerSingleTon.getInstance().accessToken}`;
        return config;
    },
    (error) => {
        if (isDebug) {
            // console.log(error);
        }
    }
);

serverProxy.interceptors.response.use(
    (response) => {
        if (response.data instanceof Array) {
            response.data = changeCase.camelArray(response.data, { recursive: true, arrayRecursive: true });
        } else {
            response.data = changeCase.camelKeys(response.data, { recursive: true, arrayRecursive: true });
        }

        return response;
    },
    (error) => {
        throw generateError(error);
    }
);
