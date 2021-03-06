// @ts-nocheck
/* eslint-disable */
import { DeviceRegistrationInfo } from "./interface";
import http, { AxiosResponse } from "axios";

export const getDevices = (params: { skip?: number; limit?: number }) =>
  http.request<string[], AxiosResponse<string[]>>({
    url: `/devices`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

export const register = (params: DeviceRegistrationInfo) =>
  http.request<any, AxiosResponse<any>>({
    url: `/devices`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });
