// @ts-nocheck
/* eslint-disable */
import { JsonResult_Guid } from "./interface";
import axios from "axios";

// 新增或编辑标准票, 需走审批流程
export const AddOrUpdateTicketTypical = (params: { [key: string]: never }) =>
  axios.request<JsonResult_Guid>({
    url: `/api/services/app/YmTicketTypical/AddOrUpdateTicketTypical`,
    method: "post",
    params: {},
    data: params,
    responseType: "json"
  });