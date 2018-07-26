
import 'es6-promise'
import { _mAjax } from '.';


// 获取个人资产列表
export const GetUserAssetList = () =>_mAjax('/coinex-interface/api/asset/userAssetList');
 

// 获取币种列表
export const GetAllCoin = () =>_mAjax('/coinex-interface/api/coinInfo/allCoins');


// 获取币种充值记录
export const GetRecharge = (data) =>_mAjax('/coinex-interface/api/asset/rechargeRecords', {'method':'post', data: data});


// 获取币种充值地址
export const GetRechargeAddr = (coinId) =>_mAjax(`/coinex-interface/api/userAsset/queryWalletAddr`, {method:'get', data:{ coinId: coinId}});


// 获取资产信息  
export const GetAssetInfo = (coinId) =>_mAjax('/coinex-interface/api/asset/userAssetList',{ data: coinId});

// 获取个人总资产信息
export const GetUserAsset = () =>_mAjax('/coinex-interface/api/asset/userAsset');


// 获取提币地址列表
export const GetWithdrawAddr = (id) =>_mAjax('/coinex-interface/api/userAsset/withdrawAddrs',{'method': 'post',data:{userMemberWithdrawAddress:{coinId:id}}});


// 获取币种提币记录
export const GetWithdraw = (data) =>_mAjax('/coinex-interface/api/asset/withdrawRecords',{method:'post',data: data});

// 撤销提币
export const CancleWithdraw = (id) =>_mAjax('/coinex-interface/api/asset/cancelWithdraw', {data: {withdrawId:id}});


// 添加提币地址
export const createWithdrawAddr = (data) =>_mAjax('/coinex-interface/api/userAsset/createWithdrawAddr',{'method': 'post', data:data });


// 删除提币地址
export const delWithdrawAddr = (AddrId) =>_mAjax('/coinex-interface/api/userAsset/delWithdrawAddr',{'method': 'get', data:{id:AddrId}});


// 提币
export const WithdrawCoin = (withdrawData) =>_mAjax('/coinex-interface/api/asset/withdraw', {'method':'post', data:withdrawData});


//用户认证信息
export const authentication = () => _mAjax('/coinex-interface/api/usermember/userVerify');

//获取短信验证码
export const getPhonCode = () => _mAjax('/coinex-interface/api/communication/smsverificode/sendSmsCode');

//获取分发记录
export const distributeRecords = (data) => _mAjax("/coinex-interface/api/asset/distributeRecords",{'method': 'post', data:data});