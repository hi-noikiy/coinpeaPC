import { _mAjax } from './index.js';

//资询列表
export const issueList = (data) => _mAjax('/coinex-interface/api/questionCategory/findQuestionContentReplyList', {'method':'post', data: data});

//提问
export const submitIssue = (data) => _mAjax('/coinex-interface/api/questionCategory/submitQuestion', {'method':'post', data: data});

//问题分类

export const issueType = () => _mAjax('/coinex-interface/api/questionCategory/questionCategoryList', {'method':'post'});
