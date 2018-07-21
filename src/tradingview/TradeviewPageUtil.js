
import $ from "jquery";
import qs from 'querystring';
import intl from 'react-intl-universal';

const datafeedConfig = (params) => {
  let { resolution, Datafeeds, serverUrl, pushInterval, coinPairId, symbolName } = params;
  
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
    debug: true,
    symbol: search?search:symbolName,
    sybolId:coinPairId,
    interval: resolution,
    container_id: 'tv_chart_container',
    datafeed: new Datafeeds.UDFCompatibleDatafeed(serverUrl, pushInterval),
    width: "100%",
    height:'398',
  //  library_path: './',
    locale: 'zh',
    drawings_access: {
      type: 'black',
      tools: [{
        name: 'Regression Trend',
      }],
    },
    custom_css_url:'night.css',
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
   enabled_features: ['study_templates', 'dont_show_boolean_study_arguments', 'side_toolbar_in_fullscreen_mode', "hide_last_na_study_output",], //"hide_last_na_study_output" 隐藏成交量旁的na
   // charts_storage_url: 'http://saveload.tradingview.com',
    charts_storage_api_version: '1.1',
    client_id: 'tradingview.com',
    user_id: 'public_user_id',
    /*         time_frames: [
              { text: "1min", resolution: "5s", description: "1 min" },
              { text: "1h", resolution: "1", description: "1 hour" },
              { text: "1d", resolution: "5", description: "1 Days" },
            ], */
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
        "paneProperties.legendProperties.showLegend": true, //控制MA展开
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
    }
  }
}

const chartReady = (widget) => {
 
  let buttonArr = [
    {
      value: "1line",
      period: "1min",
      text: intl.get("分时"),
    },
    {
      value: "1",
      period: "1min",
      text: "1min",
    },
    {
      value: "5",
      period: "5min",
      text: "5min",
    },
    {
      value: "15",
      period: "15min",
      text: "15min",
    },
    {
      value: "30",
      period: "30min",
      text: "30min",
    },
    {
      value: "60",
      period: "1hour",
      text: "1hour",
    },
  
    {
      value: "360",
      period: "6hour",
      text: "6hour",
    },
    {
      value: "720",
      period: "12hour",
      text: "12hour",
    },
    {
      value: "1D",
      period: "1D",
      text: intl.get("日线"),
    },
    {
      value: "1W",
      period: "1W",
      text: intl.get("周线"),
    },
  ]

  let btn = {};

  let handleClick = (e, value) => {
 
      
      
        if(value === "1line") {
          widget.chart().setChartType(2);
          $(e.target).addClass('select').closest('div.space-single').siblings('div.space-single').find('div.button').removeClass('select');
        } else {
          widget.chart().setChartType(1);
            $(e.target).addClass('select').closest('div.space-single').siblings('div.space-single').find('div.button').removeClass('select');
    
        }
       
        widget.chart().setResolution(value);
      
  }

  buttonArr.forEach((v, i) => {
  
    btn = widget.createButton().on('click', function (e) {
       handleClick(e, v.value);
    });

    if(i === 2) {
      btn[0].className += ' select';
    }
      btn[0].innerHTML = v.text;
      btn[0].title = v.text;
  })
}

export default {
  datafeedConfig,
  chartReady
}
