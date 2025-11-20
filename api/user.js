import request from "@/utils/request"

export function getVcodeApi(params) {
  return request({
    url: "/login/vcode",
    method: "get",
    params: params,
  })
}

export function loginApi(data) {
  return request({
    url: "/login",
    method: "post",
    data,
  })
}

export function getProjectConfigApi(data) {
  return request({
    url: "/login/config",
    method: "get",
    data,
  })
}

export function sendPictureApi(data) {
  return request({
    url: "/login/upload/picture",
    method: "post",
    data,
  })
}

export function getRoleLevelListApi() {
  return request({
    url: "/login/load/wd",
    method: "get",
  })
}

export function getUserInfo() {
  return request({
    url: "/login/user/info",
    method: "get",
  })
}

export function getProjectCodeApi(params) {
  return request({
    url: "/login/area/code",
    method: "get",
    params: params,
  })
}

export function sendUserInfoApi(data) {
  return request({
    url: "/login/user/update",
    method: "post",
    data,
  })
}

// 支付宝
export function getAlipay(data) {
  return request({
    url: "/alipay/pay",
    method: "post",
    data,
  })
}
//退出登录
export function logoutApi() {
  return request({
    url: "/logout",
    method: "post",
  })
}
