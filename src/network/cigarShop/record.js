import {shop_request} from "@/network/cigarShop/shop_request";

export function getRecords(user_id){
  return shop_request({
    url:'/record/getRecords',
    params:{
      user_id:user_id
    }
  })
}


