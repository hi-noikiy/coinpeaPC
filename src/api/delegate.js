/**
 * 委托管理接口
 */
import 'es6-promise'
import { _mAjax } from '.';

 //委托记录
 export const delegateNote = (data) => _mAjax('/coinex-interface/api/deal/queryEntrust', {'method':'post', data: data});

 //市场列表
 export const delegateList = () => _mAjax(' /coinex-interface/api/coinInfo/regionCoinList');

 //撤销委托
 export const cancelDelegate = (data) => _mAjax('/coinex-interface/api/deal/cancelEntrust', {'method':'post', data: data});

  //成交记录
  export const succeededRecord = (data) => _mAjax('/coinex-interface/api/deal/succeededRecord', {'method':'post', data: data});

