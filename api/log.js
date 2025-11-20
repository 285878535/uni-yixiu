import request from "@/utils/request"

// 记日志查询
export function getQueryLog(params) {
  return request({
    url: "/log/queryLog",
    method: "get",
    params: params,
  })
}

// 更新日志
export function getUpdateChatLog(data) {
  return request({
    url: "log/updateChatLog",
    method: "put",
    data,
  })
}
//获取日志详情
export function getLog(id) {
  return request({
    url: `/log/${id}`,
    method: "get",
  })
}
// 关联对话
export function getRelatedLog(params) {
  return request({
    url: "/log/related",
    method: "get",
    params: params,
  })
}
// 获取修车次数
export function getCarCount() {
  return request({
    url: "/log/getRepairCountAndDay",
    method: "get",
  })
}