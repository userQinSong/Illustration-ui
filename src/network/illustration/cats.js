import {ill_request} from "@/network/illustration/illustration_request";

export function getTagList(){
  return ill_request({
    url:'/cat/getTagList',
  })
}

export function getTypeList(){
  return ill_request({
    url:'/cat/getTypeList',
  })
}


