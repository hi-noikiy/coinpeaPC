import React from 'react';
import { connect } from "react-redux"; 
import Datafeeds from '../utils/datafeed/datafeed';
import tradeviewPageUtil from './TradeviewPageUtil';
import datafeedConfig from '../utils/datafeed/datafeedConfig';
import tradeviewPageUtil2 from './TradeviewPageUtil2';
import { shallowEqualImmutable, _LocalStorage } from '../utils';
import './TradeviewPage.scss';
import qs from 'querystring';

class TradeviewPage extends React.Component {
 

  componentDidMount() {
    
    datafeedConfig.symbolResolveJSON['volume_precision'] =  this.props.quanPre;
    datafeedConfig.symbolResolveJSON["pricescale"] = Math.pow(10, this.props.pricePre);
    
    window.wsClose = false;
   /* console.log('window.TradingView ->', window.TradingView);
    console.log('Datafeeds ->', Datafeeds);  */
  
    this.tradingViewGetReady();
   
   // if(window._onResetCacheNeededCallback) window._onResetCacheNeededCallback();
   
    window.ws.onopen = () => {
        
        if(window.ws.readyState === 1) {
                this.sendPing()
        }
    }
    
    window.ws.onclose =  ()  => {
        if(!window.wsClose) {
            const wsUrl = window.location.hostname === 'localhost' ? 'www.coinex8.com' :  window.location.hostname ;
            this.websocketUrl = `wss://${wsUrl}/coinex-interface/kline`;
            window.ws = new WebSocket(this.websocketUrl);
        }
    }
    
    window._createWidget = this.tradingViewGetReady;
   
  }

  sendPing = () => {
    if(window.ws.readyState === 1) {
        this.timer = setTimeout( () => {
            if(window.ws.readyState === 1) {
                window.ws.send('ping');
            }
            
            this.sendPing();
        }, 5000)
    }
   
  }

  shouldComponentUpdate(nextProps, nextState) {
      return shallowEqualImmutable(nextProps, nextState)
  }
 
  componentWillUnmount() {
   
      if(window.ws && window.ws.readyState === 1) {
           window.ws.close();
           window.wsClose = true;
        
      }
      if(window.widget) {
        window.widget.onChartReady(() => {
            window.widget.remove();
            window.hasWsMessage= false;
        })
           
      }
      
      clearTimeout(this.timer);
      this.timer = null;
    
  }

  
  // 开启websocket
  websocketStart = () => {
        const wsUrl = window.location.hostname === 'localhost' ? 'www.coinex8.com' :  window.location.hostname ;
        this.websocketUrl = `wss://${wsUrl}/coinex-interface/kline`;
        window.ws = new WebSocket(this.websocketUrl);
  }

  // 
  tradingViewGetReady = ()  =>{
  
        
        const coinPairId = this.props.coinAreaData.id ;
        const symbolName = this.props.coinAreaData.coin+'/'+this.props.coinAreaData.coinArea;

        let params = {
                resolution: "5",
                coinPairId:coinPairId,
                symbolName:symbolName,
                Datafeeds,   
                serverUrl: this.websocketUrl,
                pushInterval: 1000,
                pricePre:this.props.pricePre,
                quanPre:this.props.quanPre
        }
       
     
    window.TradingView.onready((() => {
      var utils;
      utils = tradeviewPageUtil;
     /*  if(window.location.pathname.indexOf('/ex/trade') > -1 ) {
        
          utils = tradeviewPageUtil;
        
      } else {
       
          utils = tradeviewPageUtil2;

      } */
      
      window.widget = new window.TradingView.widget(this.datafeedConfig(params));
      if(!(window.ws && window.ws.readyState === 1)){
            this.websocketStart();
      }
      
      window.widget.onChartReady(() => {
        
        window.widget.chart().executeActionById("drawingToolbarAcion");
        window.widget.chart().createStudy("Moving Average", false, false ,[5],  null,{'Plot.color' : '#965FC4'});
        window.widget.chart().createStudy("Moving Average", false, false ,[10], null,{'Plot.color' : '#84aad5'});
        window.widget.chart().createStudy("Moving Average", false, false ,[30], null, {'Plot.color' : '#55b263'});
        window.widget.chart().createStudy("Moving Average", false, false ,[60], null,  {'Plot.color' : '#b7248a'});
        tradeviewPageUtil.chartReady(window.widget);
         
      });

    })());


  }

  //TV 配置
  datafeedConfig = (params) => {
      const ls = new _LocalStorage();
      let lang = '';
      if(ls.get('lang') === 'zh_CN') {
        lang = 'zh'
      } else {
          lang = 'en'
      }
    let { resolution, Datafeeds, serverUrl, pushInterval, coinPairId, symbolName, pricePre, quanPre } = params;
   
    let style = {
          up: "#589065",
          down: "#ae4e54",
          bg: "#1d1d29",
          grid: "#1f2943",
          cross: "#9194A3",
          border: "#4e5b85",
          text: "#61688A",
          areatop: "rgba(122, 152, 247, .1)",
          areadown: "rgba(122, 152, 247, .02)"
      };
  
    const search = qs.parse(window.location.search)['?na'];
    

return {
      debug: false,
      symbol: search?search:symbolName,
      sybolId:coinPairId,
      interval: resolution,
      container_id: 'tv_chart_container',
      datafeed: new Datafeeds.UDFCompatibleDatafeed(serverUrl, pushInterval),
      width: "100%",
      height:'398',
     /*"minmov": 1,
      "minmov2": 0,
      "pointvalue": 1, 
      'volume_precision':1000000,
      "pricescale": 100000000, */
      library_path: './',
      locale: lang,
      drawings_access: {
        type: 'black',
        tools: [{
          name: 'Regression Trend',
        }],
      },
      
      custom_css_url: this.props.sun?'night.css':'',
      //autosize: true,
      timezone: "Asia/Shanghai",
      disabled_features: [
        'header_symbol_search',
        'use_localstorage_for_settings',
        'symbol_search_hot_key',
        'header_chart_type',
        'header_compare',
        'header_undo_redo',
        'header_screenshot',
        'header_saveload',
        'timeframes_toolbar',
        'context_menus',
        'property_pages', // 禁用 高开低收旁边的设置选项
      //  'adaptive_logo',
       'volume_force_overlay',
        'control_bar',  //底部的导航按钮 
       // 'left_toolbar',
        'header_indicators', //图表指标
        'header_settings', //设置
        'header_resolutions',  //时间下拉框
        // 'header_fullscreen_button' //全屏按钮
      ],
     enabled_features: ['same_data_requery', 'study_templates','dont_show_boolean_study_arguments', 'side_toolbar_in_fullscreen_mode', "hide_last_na_study_output",], //"hide_last_na_study_output" 隐藏成交量旁的na
     // charts_storage_url: 'http://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      overrides: {
          'volumePaneSize': "medium",
          'supports_marks' : false,
          'paneProperties.topMargin':'22',
          'supports_timescale_marks' : false,
          "scalesProperties.lineColor": style.text,
          "scalesProperties.textColor": style.text,
          "paneProperties.background": style.bg,
          "paneProperties.vertGridProperties.color": style.grid,
          "paneProperties.horzGridProperties.color": style.grid,
          "paneProperties.crossHairProperties.color": style.cross,
          "paneProperties.legendProperties.showLegend": false, //控制MA展开
          "paneProperties.legendProperties.showStudyArguments": true,
          "paneProperties.legendProperties.showStudyTitles": true,
          "paneProperties.legendProperties.showStudyValues": true,
          "paneProperties.legendProperties.showSeriesTitle": true,
          "paneProperties.legendProperties.showSeriesOHLC": true,
          "mainSeriesProperties.candleStyle.upColor": style.up,
          "mainSeriesProperties.candleStyle.downColor": style.down,
          "mainSeriesProperties.candleStyle.drawWick": true,
          "mainSeriesProperties.candleStyle.drawBorder": true,
          "mainSeriesProperties.candleStyle.borderColor": style.border,
          "mainSeriesProperties.candleStyle.borderUpColor": style.up,
          "mainSeriesProperties.candleStyle.borderDownColor": style.down,
          "mainSeriesProperties.candleStyle.wickUpColor": style.up,
          "mainSeriesProperties.candleStyle.wickDownColor": style.down,
          "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
          "mainSeriesProperties.hollowCandleStyle.upColor": style.up,
          "mainSeriesProperties.hollowCandleStyle.downColor": style.down,
          "mainSeriesProperties.hollowCandleStyle.drawWick": true,
          "mainSeriesProperties.hollowCandleStyle.drawBorder": true,
          "mainSeriesProperties.hollowCandleStyle.borderColor": style.border,
          "mainSeriesProperties.hollowCandleStyle.borderUpColor": style.up,
          "mainSeriesProperties.hollowCandleStyle.borderDownColor": style.down,
          "mainSeriesProperties.hollowCandleStyle.wickColor": style.line,
          "mainSeriesProperties.haStyle.upColor": style.up,
          "mainSeriesProperties.haStyle.downColor": style.down,
          "mainSeriesProperties.haStyle.drawWick": true,
          "mainSeriesProperties.haStyle.drawBorder": true,
          "mainSeriesProperties.haStyle.borderColor": style.border,
          "mainSeriesProperties.haStyle.borderUpColor": style.up,
          "mainSeriesProperties.haStyle.borderDownColor": style.down,
          "mainSeriesProperties.haStyle.wickColor": style.border,
          "mainSeriesProperties.haStyle.barColorsOnPrevClose": false,
          "mainSeriesProperties.barStyle.upColor": style.up,
          "mainSeriesProperties.barStyle.downColor": style.down,
          "mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
          "mainSeriesProperties.barStyle.dontDrawOpen": false,
          "mainSeriesProperties.lineStyle.color": style.border,
          "mainSeriesProperties.lineStyle.linewidth": 1,
          "mainSeriesProperties.lineStyle.priceSource": "close",
          "mainSeriesProperties.areaStyle.color1": style.areatop,
          "mainSeriesProperties.areaStyle.color2": style.areadown,
          "mainSeriesProperties.areaStyle.linecolor": style.border,
          "mainSeriesProperties.areaStyle.linewidth": 1,
          "mainSeriesProperties.areaStyle.priceSource": "close"
      
      },
      studies_overrides: {
       /*  "volume.volume.color.0": "#fff",
        "volume.volume.color.1": "#fff",
        "volume.volume.transparency": 70,
        "volume.volume ma.color": "#fff", 
       "volume.volume ma.transparency": 30,
       "volume.volume ma.linewidth": 5,
        "volume.show ma": false,
        "volume.options.showStudyArguments": true,
        "bollinger bands.median.color": "#33FF88",
        "bollinger bands.upper.linewidth": 7
        */
      },
    
    }
  }
  

  render() {
   
    return (
        <div className="kline-wrap">
        {/* <div className="kline-hd">
              <h4>BTC/USDT</h4>
              <p>8295.04</p>
              <p>≈5001.04 CNY</p>
              <p>
                  涨幅：
                 <span>-2.05%</span>
              </p>
              <p>
                  高：
                 <span>845465.215</span>
              </p>
              <p>
                  低：
                 <span>8262.220</span>
              </p>
              <p>
                  24H量：
                 <span>13532 BTC</span>
              </p>
          </div>  */}
          <div id="tv_chart_container" />
        </div>
    );
  }

}
const MapStateToProps = (state) => {
    return {
        coinAreaData:state.trade.coinArea,
    }
}

export default connect(MapStateToProps, undefined,undefined)(TradeviewPage);
