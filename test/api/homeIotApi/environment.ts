// @ts-nocheck
/* eslint-disable */
import { TemperatureSummary, ForecastResponse, TemperatueZoneStatus, HeaterState, ApiResponse } from "./interface";
import http, { AxiosResponse } from "axios";

export const temperatureSummary = (params: { [key: string]: never }) =>
  http.request<TemperatureSummary, AxiosResponse<TemperatureSummary>>({
    url: `/temperature`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

export const getForecast = (
  params: { [key: string]: never },
  pathParams: {
    days: number;
  }
) =>
  http.request<ForecastResponse, AxiosResponse<ForecastResponse>>({
    url: `/temperature/forecast/${arguments[1].days}`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

export const getZoneTemperature = (
  params: { [key: string]: never },
  pathParams: {
    zoneId: string;
  }
) =>
  http.request<TemperatueZoneStatus, AxiosResponse<TemperatueZoneStatus>>({
    url: `/temperature/${arguments[1].zoneId}`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

export const getHeaterState = (
  params: { [key: string]: never },
  pathParams: {
    zoneId: string;
  }
) =>
  http.request<HeaterState, AxiosResponse<HeaterState>>({
    url: `/temperature/${arguments[1].zoneId}/heater`,
    method: "get",
    params: params,
    data: {},
    responseType: "json"
  });

export const setHeaterState = (
  params: { [key: string]: never },
  pathParams: {
    zoneId: string;
    state: string;
  }
) =>
  http.request<ApiResponse, AxiosResponse<ApiResponse>>({
    url: `/temperature/${arguments[1].zoneId}/heater/${arguments[1].state}`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });
