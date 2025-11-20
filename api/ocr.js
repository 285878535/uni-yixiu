import request from "@/utils/request"
// 拍照
export function sendimgOcrApi(data) {
  return request({
    url: "/chat/image/ocr",
    method: "post",
    data,
  })
}
