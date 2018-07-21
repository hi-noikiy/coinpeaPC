/* 
    
    home页 banner下面小K线

*/

import React, { Component } from 'react';
//import { Button } from 'antd';
import { NavLink } from "react-router-dom";
import { is, fromJS } from 'immutable';
import { recommendList } from '../../api/home.js';
import { setPrecision, createdSymbol,_LocalStorage, times, addColor} from '../../utils/index.ts';
import './MarketLine.scss';
import intl from 'react-intl-universal';
import ReactHighcharts from "react-highcharts";


class ChartList extends React.Component {

    state = {
        config :{

            tooltip:{
                enabled: false
            },
            credits:{
                enabled: false
            },
            reflow:true,
            chart:{
                type: 'area',
                height:100,
                width:232,
                marginTop: 34,
                events:{
                    load: function(event) {
                      /*  const series = this.series[0];
                       const chart = this;
                       setTimeout(() =>{
                            series.addPoint([100, 0.4], true, true);
                       },3000) */
                    }
                },
                margin: [0, 0, 0, 0],
                backgroundColor:'#f9fdfe'
            },

            title: {
                text: null
            },
            legend: {
                enabled: false
            },

            xAxis: {
              type:'datetime',
              labels: {
                enabled: false
              },
              visible: false,
              tickPositions: []
            },

            yAxis:{
                endOnTick: false,
                startOnTick: true,
                labels: {
                    enabled: false
                  },
                title:{
                    text:null
                },
                gridLineWidth:0,
                tickPositions: [0]
            },
            plotOptions:{
                series: {
                    color: '#cfedf8'
                },
                area: {  
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, '#eef9fb'],
                            [1,'#eef9fb' ]
                        ]
                    },
                    marker: {
                         enabled: false
                    },
                    lineWidth:2,
                    states: {
                        hover: {
                            lineWidth: 2
                        }
                    },
                    threshold: null
                }
            },
            series:[{
                data: this.props.coinInfo.objs
            }]
          },
          
    }

   
    componentDidMount() {
        const chart = this.refs.chart.getChart();
        // this.getdata(chart);
      
    }

    //计算汇率
    calculateEX = (value) => {
      
        const ls = new _LocalStorage();
        var exRate = 1;
        const hdData = ls.get('rate');
      
       // if(!_Map.isMap(hdData.exRate))  
      
        if(!hdData['BTC']) return (createdSymbol(ls.get('lang'))+'0');
       
        if(ls.get('lang')) {
          
            exRate = hdData[ls.get('lang')]?hdData[(ls.get('lang'))]:hdData['BTC'];
           
        } else {
            
            //默认语言
            exRate =  hdData['zh_CN'];
          
        }
      
        let val = (times(times(hdData['BTC'], value),  ls.get('lang') === 'en_US'? 1: exRate));
       
        if(val > 0 && val < 1) {
           val =  String(setPrecision(val, 8));
         
        } else {
        
            val = String(setPrecision(val, 2))
        }

        if(val.indexOf('.') > -1  && val.split('.')[1] ) {
                const a = val.split('.');
                return (createdSymbol(ls.get('lang')) + a[0]+'.'+a[1])
        } else {
            return (createdSymbol(ls.get('lang')) + val)
        }
        
      // return  (this.createdSymbol(ls.get('lang').lang) + times(times(hdData['BTC'], usrInfo.amount), exRate?exRate:1))
        
    }

    getdata(chart){
        var series = chart.series[0],
        shift = series.data.length > 5; 
        const point = this.props.coinInfo.objs;
        chart.series[0].addPoint(point, true, shift);
        setTimeout(()=>this.getdata(chart),5000);
    }
    addColor = (value) => {
       
        let a = value;
        switch(value) {
            case 1:
             a = 'buy';
             break;
             case -1:
             a = "sell";
             break;
             default:
             a  = '';
        }
       
        return addColor(a);
    }
    
    render() {
        
        const coinInfo = this.props.coinInfo;
      
        let increaseNum;

        if(coinInfo.tp>0){
            increaseNum= `+${coinInfo.ud}`
        }else if(coinInfo.tp === 0){
            increaseNum= `${coinInfo.ud}`
        }else{
            increaseNum=`-${coinInfo.ud}`
        }
      
        return (
         
            <div className="home-chart" > 
                {/* ?id="+coinInfo.coinPair.coinId+"&na="+coinInfo.coinPair.id */}
                <NavLink 
                    className="home-chart-des"
                   /*  onClick={() => {
                            const a = window.location.pathname;
                            this.ls.set('iconUrl', url) 
                            window.location.href = `${a}trade?na=${na.replace('/','_')}&active=${key}`
                    }} */
                    to={`/trade?na=${coinInfo.coinRelationName.replace('/','_')}`} //&active=${coinInfo.active}
                >
                    <div className="home-chart-des-top">
                        <p>{coinInfo.coinRelationName}</p>
                        <div><span  className={this.addColor(coinInfo.tp)}>{increaseNum}%</span></div>
                    </div>
                    <div className="home-chart-des-bottom">
                        <p>
                            <span className={this.addColor(coinInfo.tp)}>{coinInfo.np}</span>
                            <span className="price">{this.calculateEX(coinInfo.np)}</span>
                        </p>
                        <p className="tradeCount" >{intl.get("成交额")}：{setPrecision(coinInfo.vot, 2)+' '+coinInfo.coinRelationName.split('/')[1]}</p>
                    </div>
                </NavLink>
                <ReactHighcharts 
                     config={this.state.config}
                     ref="chart"
                />
            </div>
        )
    }
} 


class MarKetLine extends  Component {

    constructor(props) {
        super(props);
       
        this.state = {
            chartList:[],
          
        }
     
    }
   componentDidMount() {
        this.getList();
       
       // console.log(this.refs.chart0.getChart())
   }

   shouldComponentUpdate(nextProps,nextState) {
        
        const thisProps = this.props || {}, thisState = this.state || {};

        if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
            Object.keys(thisState).length !== Object.keys(nextState).length) {
            return true;
        }
      
        for (const key in nextProps) {
          if (!is(fromJS(thisProps[key]), fromJS(nextProps[key]))) {
            return true;
          }
        }
      
        for (const key in nextState) {
          if (thisState[key] !== nextState[key] || !is(fromJS(thisState[key]), fromJS(nextState[key]))) {
            return true;
          }
        }
        return false;
   
    }

    //获取列表数据
    getList = () => {
        recommendList().then( res => {
           if(res.status === 1) {
                res.data.forEach( (v, i) => {
                    this.props.all.forEach( (val, index) => {
                        if(v.coinRelationName.split('/')[1] === val.name) {
                        
                            v.active = index;
                        } 
                    });
                })
               this.setState({
                    chartList:res.data
               })
            
            //    setTimeout(()=>this.getList(),3000);
           }
        })
    }

    render() {
      
        const list = this.state.chartList.map( (item, index) => {
           
            return  (
                        <ChartList 
                            key={index.toString()+Math.random()}
                            chartIndex={index}
                            coinInfo={item}
                            data={[item.lp, item.hp, item.np]}
                          
                        />
                           
                       
                    )
        })

        return (
            <div className="home-chart-wrap" >
              {list}
            </div>
        )
    }

 
}

export default MarKetLine;