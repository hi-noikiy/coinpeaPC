//深度图
import React from 'react';
import  ReactHighcharts from  'react-highcharts' ;
import { setPrecision, addTotal } from '../../utils/index.ts';
import { is ,fromJS} from 'immutable';

import intl from 'react-intl-universal';

//import {  floor } from 'lodash';
//const data = {"buy":[[1.05000000,16769.000000000000],[1.05000000,12470.804000000000],[1.05000000,7045.400000000000],[0,97393.950000000000],[0,13396.880000000000],[0,19232.960000000000],[1.17100000E-7,5786.000000000000],[1.17100000E-7,4154.600000000000],[1.23200000E-7,11792.150000000000],[1.25200000E-7,90235.800000000000],[1.27200000E-7,483.000000000000],[1.27200000E-7,16261.190000000000],[1.29200000E-7,13617.000000000000],[1.29200000E-7,19806.840000000000],[1.29200000E-7,5910.600000000000],[1.31200000E-7,10853.000000000000],[1.33300000E-7,16344.000000000000],[1.33300000E-7,14062.000000000000],[1.37300000E-7,8002.170000000000],[1.37300000E-7,9993.800000000000],[1.37300000E-7,6198.000000000000],[1.41300000E-7,675.160000000000],[1.41300000E-7,17609.000000000000],[1.45400000E-7,2563.293000000000],[1.45400000E-7,3268.000000000000],[1.47400000E-7,2169.732000000000],[1.47400000E-7,8041.000000000000],[1.47400000E-7,15384.500000000000],[1.51400000E-7,20522.000000000000],[1.55500000E-7,9062.781000000000],[1.57500000E-7,11432.400000000000],[1.57500000E-7,6145.500000000000],[1.57500000E-7,17070.000000000000],[1.59500000E-7,7401.390000000000],[1.61500000E-7,5737.600000000000],[1.61700000E-7,19734.300000000000],[1.62500000E-7,11073.900000000000],[1.63300000E-7,16223.130000000000],[1.63400000E-7,5000.000000000000],[1.63500000E-7,5000.000000000000],[1.63900000E-7,18443.000000000000],[1.65000000E-7,11207.800000000000],[1.65200000E-7,12933.000000000000],[1.66400000E-7,3137.402000000000],[1.68000000E-7,1285.870000000000],[1.69000000E-7,1973.000000000000],[1.69600000E-7,751.580000000000],[1.69800000E-7,8268.050000000000],[1.70000000E-7,15523.376000000000],[1.71600000E-7,8976.390000000000],[1.72800000E-7,17317.400000000000],[1.73000000E-7,8738.000000000000],[1.73000000E-7,4052.983000000000],[1.73800000E-7,7158.000000000000],[1.74400000E-7,2346.700000000000],[1.74800000E-7,15271.091000000000],[1.75500000E-7,7787.220000000000],[1.76000000E-7,178.637000000000],[1.78700000E-7,14786.000000000000],[1.78900000E-7,96624.000000000000],[1.79900000E-7,19509.000000000000],[1.81500000E-7,1532.332000000000],[1.81700000E-7,19303.000000000000],[1.81700000E-7,16269.935000000000],[1.82500000E-7,138385.600000000000],[1.83000000E-7,169.613000000000],[1.83700000E-7,20562.688000000000],[1.83700000E-7,13397.000000000000],[1.83900000E-7,11776.000000000000],[1.84700000E-7,68999.000000000000],[1.85300000E-7,4597.600000000000],[1.86400000E-7,4386.000000000000],[1.87200000E-7,11542.500000000000],[1.87400000E-7,20113.860000000000],[1.88200000E-7,925.160000000000],[1.89000000E-7,3517.200000000000],[1.89800000E-7,14666.470000000000],[1.91400000E-7,1947.481000000000],[1.91400000E-7,17143.700000000000],[1.91600000E-7,1971.000000000000],[1.92200000E-7,12388.900000000000],[1.92600000E-7,7991.990000000000],[1.93600000E-7,2023.724000000000],[1.94400000E-7,2000.000000000000],[1.94600000E-7,12760.348000000000],[1.94800000E-7,13791.500000000000],[1.97500000E-7,15146.000000000000],[1.98100000E-7,7503.000000000000],[1.98300000E-7,10569.900000000000],[1.98500000E-7,13046.759000000000],[2.01900000E-7,932.400000000000],[2.06100000E-7,23245.000000000000]],"sell":[[3.25400000E-7,7158.862000000000],[3.23000000E-7,14840.000000000000],[3.20700000E-7,14834.530000000000],[3.20700000E-7,14099.000000000000],[3.20000000E-7,110.194000000000],[3.11300000E-7,13054.000000000000],[3.11300000E-7,18791.500000000000],[3.11300000E-7,115003.200000000000],[3.08900000E-7,4173.000000000000],[3.08900000E-7,7912.200000000000],[3.08900000E-7,18928.810000000000],[3.08900000E-7,12132.480000000000],[3.06500000E-7,11771.000000000000],[3.04200000E-7,18710.800000000000],[3.04200000E-7,14686.906000000000],[3.00000000E-7,40.860000000000],[2.99500000E-7,18668.100000000000],[2.99500000E-7,5771.036000000000],[2.97100000E-7,3744.700000000000],[2.94800000E-7,12956.100000000000],[2.94800000E-7,178306.308000000000],[2.92400000E-7,2123.980000000000],[2.90000000E-7,13151.561000000000],[2.90000000E-7,17670.130000000000],[2.89000000E-7,91.087000000000],[2.87700000E-7,1706.860000000000],[2.80800000E-7,14617.400000000000],[2.80400000E-7,16819.900000000000],[2.77300000E-7,5933.300000000000],[2.76600000E-7,5017.124000000000],[2.76400000E-7,1033.848000000000],[2.74000000E-7,754.000000000000],[2.74000000E-7,11825.800000000000],[2.73300000E-7,5997.000000000000],[2.72100000E-7,3491.400000000000],[2.70500000E-7,13391.538000000000],[2.70000000E-7,17333.600000000000],[2.69300000E-7,3303.240000000000],[2.68000000E-7,603.978000000000],[2.67200000E-7,12362.630000000000],[2.66700000E-7,2374.679000000000],[2.66000000E-7,13837.774000000000],[2.65700000E-7,15022.000000000000],[2.64600000E-7,5790.000000000000],[2.64600000E-7,16200.000000000000],[2.62400000E-7,440.100000000000],[2.60600000E-7,4209.569000000000],[2.60100000E-7,5893.020000000000],[2.60100000E-7,45117.000000000000],[2.59600000E-7,7636.142000000000],[2.59600000E-7,15349.200000000000],[2.59400000E-7,11587.900000000000],[2.58900000E-7,6042.900000000000],[2.57700000E-7,5219.192000000000],[2.57700000E-7,10870.000000000000],[2.56300000E-7,20485.893000000000],[2.56100000E-7,12494.730000000000],[2.55800000E-7,12834.700000000000],[2.55100000E-7,1827.000000000000],[2.54900000E-7,14439.000000000000],[2.54200000E-7,16535.000000000000],[2.53500000E-7,6111.800000000000],[2.52100000E-7,3419.000000000000],[2.48800000E-7,2626.000000000000],[2.48500000E-7,4569.000000000000],[2.48300000E-7,11116.800000000000],[2.47600000E-7,11224.383000000000],[2.46400000E-7,10005.000000000000],[2.44800000E-7,18250.100000000000],[2.44500000E-7,15929.400000000000],[2.43300000E-7,35047.240000000000],[2.41900000E-7,13480.000000000000],[2.40500000E-7,13644.866000000000],[2.40000000E-7,2126.500000000000],[2.40000000E-7,20774.000000000000],[2.35800000E-7,100.911000000000],[2.20500000E-7,17353.055000000000]]};
class DeepChart extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            config: {}
        }  
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {}, thisState = this.state || {};
        if(nextProps.index !== 1 ) return false;
		
        if( Object.keys(thisProps).length !== Object.keys(nextProps).length ||
          	Object.keys(thisState).length !== Object.keys(nextState).length) {
           
          	return true;
        }
        
        for (const key in nextProps) {
            if (!is(fromJS(thisProps[key]), fromJS(nextProps[key]))) {
			
              return true;
            }
          }
        
          for (const key in nextState) {
			
            if (JSON.stringify(thisState[key]) !== JSON.stringify(nextState[key]) ) {
			
              return true;
            }
          }

          return false;
	}
	/* componentDidMount() {
		const data = {buy:this.props.buy, sell:this.props.sale }
	
		this.setState({
				config: this.configDeep(this.props.pricePre,this.props.quanPre, data, this.props.height, this.props.top,this.props.bgcolor)
			})
	
	} */

	componentWillReceiveProps(nextProps) {
		
		if(nextProps.index === 1) {
			const data = {buy:nextProps.buy, sell:nextProps.sale }
		
			this.setState({
					config: this.configDeep(nextProps.pricePre,nextProps.quanPre, data, nextProps.height, nextProps.top,nextProps.bgcolor)
				})
			
		}
		
			
	}

    //深度图配置
    configDeep = (ordersDecimalDigitsPrice, ordersDecimalDigitsNum, data,height, top,bgcolor) => {
     console.log()
        return {
            chart: {
              type: "area",
              marginTop: top||20,
              reflow: false,
              height:height || 'auto',
              pinchType: "x", //平移方向
              panning: true, //允许平移
              backgroundColor: bgcolor||'rgb(34, 39, 67)',
			  borderColor: "#000000", 
              plotBorderColor: "#636466",
              className: "dark-container",
              // plotBorderWidth: 1, 画图边框
              ignoreHiddenSeries: true,
              resetZoomButton: {
                theme: {
                        display: "none"
                        }
                    }
            },
            title: {
              text: " "
            },
            legend: {
              enabled: true,
              itemStyle: {
				      color: "#E0E0E3"
                },
                itemHoverStyle: {
                    color: "#FFF"
                },
                itemHiddenStyle: {
                    color: "#606063"
                }
            },
            credits: {
              enabled: false
            },
            xAxis: {
              allowDecimals: true,
              title: {
                enabled: false
              },
              overflow: "justify",
              lineWidth: 1,
              lineColor: "#777",
              gridLineWidth: 0,
              labels: {
                formatter: function() {
                  return setPrecision(
                    this.value,
                    ordersDecimalDigitsPrice
                  );
                },
                style: {
                  color: 'rgb(142,160,181)'
                 },
                x: 0,
                y: 26,
                startOnTick: true,
                endOnTick: false,
              //  step: 3
              }
            },
            yAxis: {
              labels: {
                formatter: function() {
                  return setPrecision(this.value, ordersDecimalDigitsNum)/1000+'k';
                },
                align: "left",
                x: 0,
                y: -2,
               // step: 0,
                style: {
                  color: "#777"
                },
            
              },
              title: {
                enabled: false
              },
              lineWidth: 1,
              lineColor: "#777",
              gridLineWidth: 1,
              gridLineColor: "rgba(255,255,255,0.1)",
              gridLineDashStyle: "Dash",
              endOnTick: false
            },
            plotOptions: {
              area: {
                // pointStart: 0,
                fillOpacity: 0.75,
                marker: {
                  enabled: false,
                  symbol: "circle",
                  radius: 2,
                  states: {
                    hover: {
                      enabled: true,
                      lineWidth:1,
                    }
                  }
                }
              }
            },
            tooltip: {
                backgroundColor: "rgba(34, 49, 67, 0.9)",
                borderColor:"rgba(137,183,56,1)",
                shadow:true,
                style: {
                    color: "#F0F0F0"
			          },
              pointFormatter: function() {
                return (
                    "<p>" +
                     intl.get('价格') +
                    ":" + setPrecision(this.x, ordersDecimalDigitsPrice) +
                   "</p>"+
                    "<p>" + this.series.name + ": " + setPrecision(this.y, ordersDecimalDigitsNum) +
                  "</p>"
                );
              },
              headerFormat: ' ',
              followTouchMove: true,
              useHTML: true,
            },
            
              style: {
                color: "#fff"
              },
              backgroundColor: "#223141",
              borderColor: "#172431",
              borderRadius: 3,
              borderWidth: 1,
              series: this.transformData(data, ordersDecimalDigitsPrice)
              
          };

          
    }

   //求和
   total(arr) {

        const a = {
            num: 0,
            totalArr: []
        };
       
        arr.forEach(item => {
        
            a.num = addTotal(a.num , item.qu);
          
            a.totalArr.push(setPrecision(a.num, this.props.quanPre));
        });

        console.log(a)
       
        return a;
  }

     //转换深度图数据
  transformData(data, ordersDecimalDigitsPrice) {
        let num = 0;
        let buyX = [];
        let sellX = [];
        let buys;
        let sells;
        let b = null;
        buys = this.total(data.buy).totalArr;
        sells = this.total(data.sell).totalArr;
        
        const bRever = buys.reverse();
        const sRever = sells;
        let maxBuy = [];
        let maxSell = [];
     
        data["buy"].forEach((item, index) => {

            b = Number(setPrecision(item.pr, ordersDecimalDigitsPrice));
            buyX.push([b, Number(bRever[bRever.length-index-1])]);
			      maxBuy.push(b);
			
        });
        
        
        //买最高价
        let maxb = Math.max.apply(Math, maxBuy);
       
        let newB = [];
        buyX.forEach((item, index) => {
            if (item[0] <= maxb && item[0] >= maxb / 2) {
            
              newB.push(item);
            }
           
        });
     
        data.sell.forEach((item, index) => {
            maxSell.push(
                parseFloat(
                    setPrecision(Number(item.pr), ordersDecimalDigitsPrice)
                )
            );
            sellX.push([
                parseFloat(
                  setPrecision(Number(item.pr), ordersDecimalDigitsPrice)
                ),
                Number(sRever[index])
            ]);
        });

        //卖最低价
        let maxs = Math.min.apply(Math, maxSell);

        let newS = [];
        sellX.forEach((item, index) => {
          if (item[0] <= maxs * 1.5 && item[0] >= maxs) {
               newS.push(item);
          }
         
        });
       
        var oSeries = [
          {
            name: intl.get('买入'),
            data: newB,
            color: "#89B738",
            type:'area',
            lineWidth:1,
            lineColor:"#89B738",
            fillOpacity:0.1,
			      animation:false,
          },
          {
            name: intl.get('卖出'),
            data: newS,
            color: 'rgb(228,82,82)',
            type:'area',
            lineWidth:1,
            lineColor:"#E45252",
            fillOpacity:0.1,
            animation:false,
          }
        ];

    
        return oSeries;
    }

    render() {
     
        return(

            <ReactHighcharts config={this.state.config}  ref="deepChart"/>
        
        )
    }
}

export default DeepChart;