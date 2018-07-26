import 'es6-promise'
import { _mAjax } from '.';
 

//修改密码
export const ChangePwd = (postDate) => _mAjax('/coinex-interface/api/usercentre/modifyLoginPwd', {method:'post',data: postDate})

//谷歌认证
export const GoogleChk = (num) => _mAjax(`/coinex-interface/api/usercentre/validateauthenticator`, {method:'get',data: num})
// 获取谷歌密钥
export const GooleAuth = ()=>_mAjax('/coinex-interface/api/usercentre/googleAuth',{method: 'get'})
//关闭谷歌认证
export const GoogleCL = (data) => _mAjax('/coinex-interface/api/usercentre/colesWithdrawGA',{method:'post', data})


//获取个人信息
export const userInfo = (postDate) => _mAjax('/coinex-interface/api/usercentre/userInfo') 

//修改手机
export const unBondNote = (data) => _mAjax('/coinex-interface/api/usercentre/unBondNote',{method:'post', data})

//手机号码绑定
export const BondNote = (data) => _mAjax('/coinex-interface/api/usercentre/noteBond', {method:'post', data});
//开启短信验证
export const OpenPhone = (data) => _mAjax('/coinex-interface/api/usercentre/openWithdrawStatus', {data});

//关闭短信验证
export const ClosePhone = (data) => _mAjax('/coinex-interface/api/usercentre/colesWithdrawNote', {method:'post', data});
//关闭短信验证时获取验证码
export const  closeGetPhonecode = () =>  _mAjax('/coinex-interface/api/communication/smsverificode/sendSmsCode');


// 获取验证码
export const getVerification = (phoneNum) => _mAjax('/coinex-interface/api/communication/smsverificode/validateSmsCode', {method:'post', data:phoneNum});
// 验证验证码
export const identification = (phoneNum) => _mAjax('/coinex-interface/api/communication/smsverificode/identification', {method:'post', data:phoneNum});

//护照认证国籍列表
export const nationalList = () => _mAjax('/coinex-interface/api/sysauthcountry/list',{method:'post'});

// 提交身份认证
export const postAuthenInfo = (data) => _mAjax('/coinex-interface/api/usercentre/memAuthenInfo', {method:'post', data:data});
// 我的邀请个人信息
export const myInvite = () => _mAjax('/coinex-interface/api/usercentre/myInvite', {method:'get'});

// 我的邀请banner
export const myInviteBanner = () => _mAjax('/coinex-interface/api/index/websit/activityshow', {method:'get'});

// 我的邀请排名
export const myInviteRank = () => _mAjax('/coinex-interface/api/index/websit/commissionRanked', {method:'get'});


//我的邀请记录
export const myInviteList = (data) => _mAjax('/coinex-interface/api/usercentre/myInvitation',{method:'post',data});

//我的返佣记录
export const myRebirth = (data) => _mAjax('/coinex-interface/api/usercentre/myBonusRecord',{method:'post',data});

//api

//创建api
export const createApi = (data) => _mAjax('/coinex-interface/api/usermember/api/create',{method:'post',data});

//删除全部密钥
export const delectAll = (data) => _mAjax('/coinex-interface/api/usermember/api/delete',{method:'post',data});

//删除某一密钥
export const delectOne = (data) => _mAjax('/coinex-interface/api/usermember/api/deleteone',{method:'post',data});

//我的密钥列表
export const mySerect = () => _mAjax('/coinex-interface/api/usermember/api/mylist',{method:'post'});

//编辑我的密钥列表
export const editSerect = (data) => _mAjax(' /coinex-interface/api/usermember/api/update',{method:'post',data});

//用户api配置
export const apiConfig = () => _mAjax('/coinex-interface/api/houseseting/detail',{method:'post'})
 

//谷歌验证状态
export const googleStatus = () => _mAjax('/coinex-interface/api/usercentre/checkgoogle',{method:'post'});

//获取国家
export const getCountry = () => _mAjax('/coinex-interface/api/sysauthcountry/areaList',{method:'get'});