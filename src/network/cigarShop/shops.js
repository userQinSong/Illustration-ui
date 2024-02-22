import {shop_request} from "@/network/cigarShop/shop_request";

export function getShops(){
  return shop_request({
    url:'/shop/getShops',
    params:{}
  })
}

export function getHaveShops(user_id){
  return shop_request({
    url:'/shop/getHaveShops',
    params:{
      user_id:user_id
    }
  })
}

export function getShopMsg(shop_id){
  return shop_request({
    url:'/shop/getShopMsg',
    params:{
      shop_id:shop_id,
    }
  })
}

export function getCigarList(shop_id){
  return shop_request({
    url:'/shop/getCigarList',
    params:{
      shop_id:shop_id,
    }
  })
}

export function getLimitCigarList(shop_id,priceLimit){
  return shop_request({
    url:'/shop/getLimitCigarList',
    params:{
      shop_id:shop_id,
      minPrice:priceLimit.minPrice,
      maxPrice:priceLimit.maxPrice
    }
  })
}


