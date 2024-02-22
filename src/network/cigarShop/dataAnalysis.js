import {shop_request} from "@/network/cigarShop/shop_request";

export function getCigarIncomeDataAnalysis(shop_id){
  return shop_request({
    url:'/dataAnalysis/cigarIncomeDataAnalysis',
    params:{
      shop_id:shop_id
    }
  })
}

export function getCigarRepertoryDataAnalysis(shop_id){
  return shop_request({
    url:'/dataAnalysis/cigarRepertoryDataAnalysis',
    params:{
      shop_id:shop_id
    }
  })
}

export function getCigarSoldCountAnalysis(shop_id){
  return shop_request({
    url:'/dataAnalysis/getCigarSoldCountAnalysis',
    params:{
      shop_id:shop_id
    }
  })
}


