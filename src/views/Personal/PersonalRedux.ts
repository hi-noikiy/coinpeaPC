/* 
    个人中心页下所有*Redux.js汇总
   
*/
import { combineReducers } from 'redux';

// 引入个人中心表格列表的reducer和actionCreator
import account from '../../components/personal/AccountInfoRedux';


export default combineReducers({
    account
});
