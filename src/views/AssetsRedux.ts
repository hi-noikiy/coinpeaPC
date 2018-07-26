/* 
    资产管理页所有*Redux.js汇总
   
*/
import { combineReducers } from 'redux';

//引入资金的redux
import Funds from '../components/assets/FundsRedux';
import GetallCoin from '../components/assets/GetallCoinRedux';


export default combineReducers({
    Funds,
    GetallCoin
});
