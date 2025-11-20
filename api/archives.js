import request from "@/utils/request"
//资料上新
export function recentlyUpdatedApi() {
  return request({
    url: "/archive/recentlyUpdated",
    method: "get",
  })
}

//常见故障
export function commonFaultsApi(logIds = "") {
  return request({
    url: "/archive/commonFaults" + logIds,
    method: "get",
  })
}
