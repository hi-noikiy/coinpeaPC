//深度图
import React from 'react';
import  ReactHighcharts from  'react-highcharts' ;
import { setPrecision, addTotal } from '../../utils/index.ts';
import { is ,fromJS} from 'immutable';

import intl from 'react-intl-universal';

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
    configDeep = (ordersDecimalDigitsPrice, ordersDecimalDigitsNum, data, height, top,bgcolor) => {
      console.log(document.querySelector('.ContralTitle').getBoundingClientRect().height)
        return {
            chart: {
              type: "area",
              marginTop: top||20,
              reflow: false,
              height:height || document.querySelector('.ContralTitle').getBoundingClientRect().height ,
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
                    color: "rgb(227, 236, 240)"
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
                color: "rgb(227, 236, 240)"
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
            color: "#06B07C",
            type:'area',
            lineWidth:1,
            lineColor:"#06B07C",
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