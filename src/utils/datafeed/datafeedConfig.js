import store from '../../redux/configureStore';
const configJSON =
  {
    "supports_search": true,
    "supports_time": true,
    "supports_timescale_marks": false,
    "supports_group_request": false,
    "supports_marks": false,
    "supported_resolutions": ["1", "5", "15", "30", "60",  "360", "720", "1D", "1W"],
  }


const symbolResolveJSON =
  {
    "name": "LTC/BTC",
    "exchange-traded": "",
    "exchange-listed": "",
    "timezone": "Asia/Shanghai",
    "session": '24x7',
  /*    "has_seconds": true,  改
     "seconds_multipliers": ["1S", "5S", "15S", "30S"], */
    "has_intraday": true,
     "intraday_multipliers": ["1", "5", "15", "30", "60",  "360", "720"],
     "has_weekly_and_monthly":true, 
    "has_daily": true,
    "has_empty_bars": true, //hai 
    //"force_session_rebuild":true,
    "has_no_volume": false,
    "description": "",
    "type": "index",
    "supported_resolutions": ["1", "5", "15", "30", "60",  "360", "720", "1D", "1W"],
    "ticker": "LTC/BTC",
    "minmov": 1,
    "minmov2": 0,
    "pointvalue": 1,
    'volume_precision': window._quanPre ? window._quanPre: 4,
    "pricescale": window._pricePre ? Math.pow(10, window._pricePre):100000000,
      
  }
export default {
  configJSON,
  symbolResolveJSON,
  // originSymbolResolveJSON
}

//["1", "5", "15", "30", "60", "120", "240", "360", "720", "1D", "1W"],