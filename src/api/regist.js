
//注册登录接口
import { _mAjax } from '.';
export const registUrl = (params) =>_mAjax('/coinex-interface/api/usermember/register', {'method': 'post', data: params});
// 忘记密码
export const forgetpw = (params) =>_mAjax('/coinex-interface/api/usermember/forgetpw', {'method': 'post', data: params});
//变更密码
export const reforgetpw = (params) =>_mAjax('/coinex-interface/api/usermember/resetPassword', {'method': 'post', data: params});
//登录
export const loginUrl = (params) =>_mAjax('/coinex-interface/api/usermember/login', {'method': 'post', data: params});

//退出登录
export const loginOut = () => _mAjax('/coinex-interface/api/usermember/loginOut')
// 再次发送邮xiang
export const sendEmail = (params) =>_mAjax('/coinex-interface/api/usermember/sendActivation', {'method': 'get', data: params});
// 校验邮箱
export const checkEmail = (params) =>_mAjax('/coinex-interface/api/usermember/checkExist', {'method': 'post', data: params});

//二次登陆
export const aginValid = (params) => _mAjax('/coinex-interface/api/usermember/validate_login', {'method':'post', data:params});

//登陆 获取短信二次验证 码

export const aginPhone = (params) => _mAjax('/coinex-interface/api/communication/smsverificode/validateSmsCodeForLogin',{'method':'post',data:params});