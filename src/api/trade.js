//交易页接口
import { _mAjax } from '.';


//买
 export const buy = (data) =>_mAjax('/coinex-interface/api/deal/buy', {method:'post', data});

 //卖
 export const sale = (data) =>_mAjax('/coinex-interface/api/deal/sell', {method:'post', data});

 //撤销委托
 export const cacelEntrust = (id) => _mAjax('/coinex-interface/api/deal/cancelEntrust',{method:'post', data:{dealEntrust:{id:id}}})