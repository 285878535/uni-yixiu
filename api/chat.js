import request from "@/utils/request"
// 发送ai对话消息
export function sendMsg(data) {
  return request({
    // url: "/chat/dify",
    url: "/chat/completions",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer app-rEIvTTyhwhX8FBEiJy8AboRO",
    },
  })
}

// 获取手册等详情
export function getDocumentDetail(params) {
  return request({
    url: "/document/query/by/id",
    method: "post",
    params: params,
  })
}

// 获取手册等目录
export function getDocumentTitle(data) {
  return request({
    url: "/chat/manual/title",
    method: "post",
    data,
  })
}

// 获取手册等内容详情
export function getDocumentContent(params) {
  return request({
    url: "/document/query/by/id",
    method: "get",
    params: params,
  })
}

// 点击聊天信息获取目录
export function getChatDirectory(params) {
  return request({
    url: "/manual/query",
    method: "get",
    params: params,
  })
}

// 手册详情中的目录
export function getDetailDirectory(id) {
  return request({
    url: `/manual/directory/${id}`,
    method: "get",
  })
}

// 查询汽车
export function getCarModelApi() {
  return request({
    url: `/chat/load/car/model`,
    method: "get",
  })
}
// 新增历史对话
export function getCreteChatLog(data) {
  return request({
    url: "/log/creteChatLog",
    method: "post",
    data,
  })
}

// 获取总结日志
export function getAiSummary(data) {
  return request({
    url: "/chat/aiSummary",
    method: "post",
    data,
  })
}

//通过vin码查询车型
export function getVehicleModel(vinCode) {
  return request({
    url: `/chat/modelMatching/${vinCode}`,
    method: "get",
  })
}
