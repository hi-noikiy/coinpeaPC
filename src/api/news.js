
import { _mAjax } from '.';
// 新闻左侧标题
export const newsTabs = () => _mAjax(` /coinex-interface/api/websit/article/informationList`)

// 新闻右侧内容
export const newsLists = (id) => _mAjax(`/coinex-interface/api/websit/article/articleList`,{'methods': 'get', data:{typeId: id}});

//挖矿文章类接口

export const articleList = (data) => _mAjax('/coinex-interface/api/websit/article/miningArticle', {'methdos':'get', data});
