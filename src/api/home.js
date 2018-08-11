//主页接口
import { _mAjax } from '.';
//获取交易区
 export const userList = () =>_mAjax('http://139.129.233.239/mockjs/4/api/index/markets');

//获取首页推荐币种列表
export const recommendList = () => _mAjax('/coinex-interface/api/coinInfo/topCoin');


//获取公告信息
export const getNotice = () => _mAjax('/coinex-interface/api/websit/article/markArticle?mark=1', {'method': 'get'});

//获取服务条款Id
export const  getServeID = () => _mAjax('/coinex-interface/api/websit/article/markArticle?mark=2', {'method': 'get'});

//获取友情链接  
export const getLink = () => _mAjax('/coinex-interface/api/index/websit/blogroll');

//站点信息
export const getSiteInfo = () => _mAjax('/coinex-interface/api/index/websit/baseInfo');


//获取轮播图
export const getCarousel = () => _mAjax('/coinex-interface/api/index/websit/slideshow');

// 关于我们
export const getSite = (id) => _mAjax(`/coinex-interface/api/websit/article/websiteList`,{'method': 'get'});

//添加自选
export const addSelect = (id) =>  _mAjax(`/coinex-interface/api/coincollect/createcollect`,{'method': 'post', data:{coinRelationId:id}});

//删除自选
export const delSelect = (id) => _mAjax('/coinex-interface/api/coincollect/deletecollect', {method:'post', data:{ id: id}});

//验证登陆
export const  validate = () => _mAjax('/coinex-interface/api/sys/system');

//挖矿
export const  tradingIsMining = () => _mAjax('/coinex-interface/api/index/websit/tradingIsMining');

//手续费返还
export const rebate = (data) => _mAjax('/coinex-interface/api/deal/poundagedayreturn/dealreturn',{method:'post',data});