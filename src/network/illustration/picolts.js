import {ill_request} from "@/network/illustration/illustration_request";

export function getPicoltList(param){
  return ill_request({
    url:'/picolt/getPicolts',
    params:{
      picoltParam:JSON.stringify(param)
    }
  })
}

export function getPicListByPicoltId(param){
  return ill_request({
    url:'/picolt/getPicListByPicoltId',
    params:{
      picParam:JSON.stringify(param)
    }
  })
}

export function getPicListByUserId(param){
  return ill_request({
    url:'/picolt/getPicListByUserId',
    params:{
      picParam:JSON.stringify(param)
    }
  })
}

export function getPicoltDetail(param){
  return ill_request({
    url:'/picolt/getPicoltDetail',
    params:{
      picoltDetailParam:JSON.stringify(param)
    }
  })
}

export function changePicoltAttitude(param){
  return ill_request({
    url:'/picolt/changePicoltAttitude',
    params:{
      picoltDetailParam:JSON.stringify(param)
    }
  })
}

export function changePicAttitude(param){
  return ill_request({
    url:'/picolt/changePicAttitude',
    params:{
      picDetailParam:JSON.stringify(param)
    }
  })
}

export function uploadPicolt(param){
  return ill_request({
    url:'/picolt/uploadPicolt',
    params:{
      picoltUploadParam:JSON.stringify({
        user_id:param.user_id,
        picolt:{
          picolt_name: param.picolt_name,
          picolt_tag: param.picolt_tag,
          picolt_cover:param.picolt_cover,
          brief_intro: param.brief_intro
        },
        uploadPicList:param.uploadPicList
      })
    }
  })
}



