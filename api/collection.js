import request from "@/utils/request"
// 添加书签
export function addCollection(data) {
  return request({
    url: "/user/create/bookmark",
    method: "post",
    data,
  })
}
// 查询书签
export function getCollectionListApi(params) {
  return request({
    url: "/user/query/bookmark",
    method: "get",
    params,
  })
}
// 查询书签详情
export function getCollectionDetailApi(params) {
  return request({
    url: "/user/detail",
    method: "get",
    params,
  })
}
