import {ill_request} from "@/network/illustration/illustration_request";


export function uploadImage(formData){
  return ill_request({
    method:"post",
    url:'/upload/image',
    data:{
      file:formData
    }
  })
}

export function getUploadImage(url){
  return ill_request({
    url:'/upload/getUploadImg/' + window.btoa(url),
  })
}
