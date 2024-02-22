import {ill_request} from "@/network/illustration/illustration_request";

export function getPieMsgPack(param){
  return ill_request({
    url:'/analysis/getPieMsgPack',
    params:{
      analysisParam:JSON.stringify(param)
    }
  })
}

export function getLineMsgPack(param){
  return ill_request({
    url:'/analysis/getLineMsgPack',
    params:{
      analysisParam:JSON.stringify(param)
    }
  })
}

export function getSixDemMsgPack(param){
  return ill_request({
    url:'/analysis/getSixDemMsgPack',
    params:{
      analysisParam:JSON.stringify(param)
    }
  })
}

export function getTotalMsgInfo(){
  return ill_request({
    url:'/analysis/getTotalMsgInfo',
  })
}




