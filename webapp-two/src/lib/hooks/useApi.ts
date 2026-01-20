import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

import { keyCloak } from "@/lib/keycloak/client";

/**
 * Create an axios instance with base URL from config.
 */
const api = axios.create({
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
});

/**
 * Handle api request.
 */
api.interceptors.request.use(async (config) => {
    if (keyCloak && keyCloak.token) {
        config.headers["Authorization"] = `Bearer ${keyCloak.token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * useAPI hooks.
 * 
 * @return {Object}
 */
export const useApi = () => {
    const GET = async <T,>(path: string, options?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return await api.get(path, options);
    };

    const POST = async <T,>(path: string, data: any, options?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return await api.post(path, data, options);
    };

    const PUT = async <T,>(path: string, data: any, options?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return await api.put(path, data, options);
    };

    const PATCH = async <T,>(path: string, data: any, options?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return await api.patch(path, data, options);
    };

    const DELETE = async <T,>(path: string, options?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
        return await api.delete(path, options);
    };

    return { GET, POST, PUT, PATCH, DELETE };
};

export type {
    AxiosRequestConfig,
    AxiosResponse,
};