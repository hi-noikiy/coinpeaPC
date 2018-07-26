/* 
    Trade页下所有*Redux汇总
*/

import { combineReducers } from 'redux';
//交易页 交易区
import coinArea from '../components/trade/TradeTabsListRedux.js';
import delegateDates from '../components/trade/DelegateTavsPannelRedux.js';
import tradeStock from '../components/trade/TradePriceListRedux.js';



export default combineReducers({
    coinArea,
    delegateDates,
    tradeStock
})