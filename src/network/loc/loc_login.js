import {loc_request} from "@/network/loc/loc_request";

export function loc_login(form){
  return loc_request({
    url:'/user/login',
    params:{
      phone_number: form.phone_number,
      password: form.password,
    }
  })
}

export function loc_register(form){
  return loc_request({
    url:'/user/register',
    params:{
      user_name:form.user_name,
      phone_number:form.phone_number,
      password: form.password,
      id_card:form.id_card
    }
  })
}
