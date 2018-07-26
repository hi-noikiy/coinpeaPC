/* 
    reducers 汇总
*/
import { combineReducers } from 'redux';
import nav from '../layouts/NavRedux';
import assets from '../views/AssetsRedux';
import home from '../views/HomeRedux';
import login from '../views/LoginRedux';
import personal from '../views/Personal/PersonalRedux';
import trade from '../views/TradeRedux';


export default combineReducers({
        assets,
        home,
        login,
        nav,
        personal,
        trade,
});