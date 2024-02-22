import {ill_request} from "@/network/illustration/illustration_request";

export function getPersonInfo(param){
  return ill_request({
    url:'/person/getPersonInfo',
    params:{
      user_id:param.user_id
    }
  })
}

export function getConcernPersonListByUserId(param){
  return ill_request({
    url:'/person/getConcernPersonListByUserId',
    params:{
      userParam:JSON.stringify(param)
    }
  })
}

export function changeAttentionOnePerson(param){
  return ill_request({
    url: '/person/changeAttentionOnePerson',
    params: {
      userParam:JSON.stringify(param)
    }
  })
}

export function getAttentionOnePerson(param){
  return ill_request({
    url: '/person/getAttentionOnePerson',
    params: {
      userParam:JSON.stringify(param)
    }
  })
}

export function editPersonalMsg(param){
  return ill_request({
    url: '/person/editPersonalMsg',
    params: {
      userParam:JSON.stringify(param)
    }
  })
}

export function pushRemainTime(param){
  return ill_request({
    url:'/person/editPersonalMsg',
    params:{
      userParam:JSON.stringify(param)
    },
  })
}

export function GetPhone(param){
  return ill_request({
    url:'/person/logByPhoneNumber',
    params:{
      phone_number:param.CellPhone
    }
  })
}



