/* 
    Home页下所有*Redux.js汇总
   
*/

import { combineReducers } from 'redux';
// 引入交易区表格列表的reducer和actionCreator
import tradeList from '../components/home/HomeTabsListRedux';


export default combineReducers({
    tradeList
});



