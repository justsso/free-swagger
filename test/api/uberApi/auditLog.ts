// @ts-nocheck
/* eslint-disable */
import { IPagedResult_AuditLogListDto } from "./interface";
import axios, { AxiosResponse } from "axios";

export const GetAuditLogs = (params: { StartDate?: string }) =>
  axios.request<IPagedResult_AuditLogListDto, AxiosResponse<IPagedResult_AuditLogListDto>>({
    url: `/api/services/app/AuditLog/GetAuditLogs`,
    method: "get",
    responseType: "json",
    params: params,
    data: {}
  });
