import {shop_request} from "@/network/cigarShop/shop_request";

export function goBuy(recordMsg,willBuyMsg){
  return shop_request({
    method:"post",
    url:'/buyCigar/goBuy',
    data:{
      user_id:recordMsg.user_id,
      shop_id:recordMsg.shop_id,
      address:recordMsg.address,
      total_price:recordMsg.total_price,
      willBuyMsg:JSON.stringify(willBuyMsg),
      rank:recordMsg.rank
    }
  })
}


