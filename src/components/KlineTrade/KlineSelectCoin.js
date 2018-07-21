/* 
    专业K线页面 选择币种组件
*/

import React from 'react';
import './KlineSelectCoin.scss';
import cs from 'classnames';
import { Icon } from 'antd';
import { addSymbols, setPrecision } from '../../utils';
import { Scrollbars } from 'react-custom-scrollbars';
import { indexOf, remove } from 'lodash';

class KlineSelectCoin extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isAcive:false,
            selectCoinArea:1,
            coinId:'',
            coinName:'BNB/BTC',
            checkedCoin:[],
            data: [
                    {
                        "coins": [
                            {
                                "coinPair": {
                                    "coinId": 2,
                                    "dealStatus": 1,
                                    "id": 1,
                                    "name": "LTC/BTC",
                                    "pricePrecision": 8,
                                    "quantityPrecision": 6,
                                    "regionId": 1,
                                    "status": 1
                                },
                                "t": {
                                    "increase": -0.2,
                                    "isCollect": 1,
                                    "last": 0.01
                                }
                            }
                        ],
                        "region": {
                            "id": 1,
                            "name": "自选区"
                        }
                    },
                    {
                        "coins": [
                            {
                                "coinPair": {
                                    "coinId": 2,
                                    "dealStatus": 1,
                                    "id": 1,
                                    "name": "LTC/BTC",
                                    "pricePrecision": 8,
                                    "quantityPrecision": 6,
                                    "regionId": 1,
                                    "status": 1
                                },
                                "t": {
                                    "increase": -0.2,
                                    "isCollect": 1,
                                    "last": 0.01
                                }
                            }
                        ],
                        "region": {
                            "id": 1,
                            "name": "BTC"
                        }
                    },
                    {
                        "coins": [
                            {
                                "coinPair": {
                                    "coinId": 2,
                                    "dealStatus": 1,
                                    "id": 1,
                                    "name": "LTC/ETH",
                                    "pricePrecision": 8,
                                    "quantityPrecision": 6,
                                    "regionId": 1,
                                    "status": 1
                                },
                                "t": {
                                    "increase": -0.2,
                                    "isCollect": 1,
                                    "last": 0.01
                                }
                            }
                        ],
                        "region": {
                            "id": 1,
                            "name": "ETH"
                        }
                    },
                    {
                        "coins": [
                            {
                                "coinPair": {
                                    "coinId": 2,
                                    "dealStatus": 1,
                                    "id": 1,
                                    "name": "LTC/BNB",
                                    "pricePrecision": 8,
                                    "quantityPrecision": 6,
                                    "regionId": 1,
                                    "status": 1
                                },
                                "t": {
                                    "increase": -0.2,
                                    "isCollect": 1,
                                    "last": 0.01
                                }
                            }
                        ],
                        "region": {
                            "id": 1,
                            "name": "BNB"
                        }
                    },
                    {
                        "coins": [
                            {
                                "coinPair": {
                                    "coinId": 2,
                                    "dealStatus": 1,
                                    "id": 1,
                                    "name": "LTC/USDT",
                                    "pricePrecision": 8,
                                    "quantityPrecision": 6,
                                    "regionId": 1,
                                    "status": 1
                                },
                                "t": {
                                    "increase": -0.2,
                                    "isCollect": 1,
                                    "last": 0.01
                                }
                            }
                        ],
                        "region": {
                            "id": 1,
                            "name": "USDT"
                        }
                    }
                ],
              
        }
    }

    //显示币种
    showCoin = () => {
        this.setState((preState) => ({
            isAcive:!preState.isAcive
        }))
    }

    //选择交易区
    changeCoin = (index) =>{
        this.setState({
            selectCoinArea:index
        }) 
    }

    //选中币
    selectCoin = (e, coinId) =>{
        
        //通过字符串的形式传入coinId和交易区Id
       /*  window.widget.onChartReady(function(){
            window.widget.setSymbol('coinId=5','15', function(data){
                console.log(data);
            });
        }) */
       
        this.setState({
            coinId: coinId
        });
        e.stopPropagation();
    }

     //添加自选
     saveCoin = ( e, coinId) => {
      
        if(indexOf(this.state.checkedCoin, coinId) > -1) {
            remove(this.state.checkedCoin, n => {
                    return n === coinId;
                })
        } else {

            this.state.checkedCoin.push(coinId);
  
        }
        this.setState({checkedCoin:this.state.checkedCoin.concat([])});
        e.stopPropagation();

    }

    render() {
       
        //生产交易区头部
        const tradeHd = [];
        const list = [];

        this.state.data.forEach((item, index) => {
            tradeHd.push(
                            <div 
                                key={Math.random()*Math.random()**100} 
                                onClick={() =>this.changeCoin(index)}
                                className={cs({'selectCoinArea': this.state.selectCoinArea === index})}
                            >
                                {item.region.name}
                            </div>
                        );
            const trs = item.coins.map((val, num) => {
                return (
                    <tr 
                        key={Math.random()*Math.random()**100}
                        onClick={(e) => this.selectCoin(e, val.coinPair.coinId)}
                        className={this.state.coinId === val.coinPair.coinId?'selectCoinArea-coinPair':'' }
                    >
                        <td style={{textAlign:'center'}}>
                            <Icon 
                                style={{color:this.state.checkedCoin.includes(val.coinPair.coinId)?'#3DADD9':'#BCBCBC',fontSize:16}}
                                type={this.state.checkedCoin.includes(val.coinPair.coinId)?"star":"star-o"} 
                                onClick={(e) => this.saveCoin(e, val.coinPair.coinId)}
                            />
                        </td>
                        <td>{val.coinPair.name}</td>
                        <td>{setPrecision(val.t.last, val.coinPair.pricePrecision)}</td>
                        <td className={cs({'down':val.t.increase < 0, 'up':val.t.increase>0})}>
                            {addSymbols(val.t.increase)}
                        </td>
                        <td>{val.t.total} BTC</td>
                    </tr>
                )
            })
            list.push(
                <div  
                      key={Math.random()*Math.random()**100} 
                      style={{display:this.state.selectCoinArea === index ? 'block':'none', width:'100%'}}
                      className={cs('KlineSelectCoin-table')}
                >
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>市场</th>
                                <th>价格</th>
                                <th>24h涨跌</th>
                                <th>
                                    24h成交量
                                    <Icon type="arrow-down"  style={{color:'#49CCFF'}}/>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {trs}
                        </tbody>
                    </table>
                </div>
            )
        }) 
        return (
            <div id="KlineSelectCoin">
                <div 
                    className={cs("KlineSelectCoin-name",{ "active-select": this.state.isAcive})}
                    onClick={this.showCoin}
                >
                    <span>{this.state.coinName}</span>
                    <Icon type="caret-down" className="KlineSelectCoin-slide"/>
                </div>
                <div className={cs("KlineSelectCoin-line ")} style={{display:this.state.isAcive?'block':'none'}}></div>
                <div 
                    className={cs("KlineSelectCoin-list animated", {'fadeInDown': this.state.isAcive, 'fadeOutRight':!this.state.isAcive})} 
                    style={{display:this.state.isAcive?'block':'none'}}
                >
                    <div style={{background:'rgb(29,42,59)'}}>
                        <div className="KlineSelectCoin-nav">
                            {tradeHd}
                        </div>
                        <Scrollbars 
                                    style={{ width: 666, height:378, }}
                                    renderThumbVertical={({ style, ...props }) =>
                                    <div {...props} style={{ ...style, borderRadius:8,backgroundColor:'#3C4A59', width: '5px', }}/>
                                }
                            >
                            {list}
                        </Scrollbars>
                    </div>
                </div>
            </div>
        )
    }
}


export default  KlineSelectCoin;