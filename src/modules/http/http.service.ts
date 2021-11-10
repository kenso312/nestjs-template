import { HttpResponse } from '@/shared/interfaces';
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Since Axios HttpService default return Observable, it does not fit in our usecase,
// so we use a custom module to implement secondary encapsulation of native axios library
// also extract .data from the response to prevent .data.data.data... chaining
// https://github.com/nestjs/nest/issues/2613#issuecomment-513141287

@Injectable()
export class HttpService {
  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      timeout: 5000,
    });

    this.instance.interceptors.request.use(
      (config) => {
        // Do something before request is sent
        return config;
      },
      (error) => {
        // Do something with request error
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return (await this.instance.get(url, config)).data;
  }

  async head<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return (await this.instance.head(url, config)).data;
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return (await this.instance.delete(url, config)).data;
  }

  async options<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return (await this.instance.options(url, config)).data;
  }

  async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return (await this.instance.post(url, data, config)).data;
  }

  async put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return (await this.instance.put(url, data, config)).data;
  }

  async patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    return (await this.instance.patch(url, data, config)).data;
  }
}
