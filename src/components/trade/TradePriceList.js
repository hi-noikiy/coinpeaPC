//交易页列表组件
import React from 'react';
import { Avatar, Icon } from 'antd';
import { sumBy, replace } from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import { addColor } from '../../utils';

//自定义组件
import AllList from './AllPriceList';

//样式表
import './TradePriceList.scss';

//图片
import Icon_all_1 from "../../assets/02_01.all.svg";
import Icon_buy_1 from "../../assets/02_01.buy.svg";
import Icon_sale_1 from "../../assets/02_01.sale.svg";

import Icon_all_2 from "../../assets/02_04.all.svg";
import Icon_buy_2 from "../../assets/02_04.buy.svg";
import Icon_sale_2 from "../../assets/02_04.sale.svg";
import { is, fromJS } from 'immutable';
import intl from 'react-intl-universal';
import cs from 'classnames';


export default class TradePriceList extends React.Component {

    constructor(props) {

        super(props);
        this.state = {

            allList:{
                sale:[
                        {
                            price:'0.00000446',
                            num:'887,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.00544612311',
                            num:'112,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.0000043344',
                            num:'50,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.00000446',
                            num:'887,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.00544612311',
                            num:'112,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.0000043344',
                            num:'50,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.00000446',
                            num:'887,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.00544612311',
                            num:'112,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.0000043344',
                            num:'50,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.00000446',
                            num:'887,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.00544612311',
                            num:'112,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.0000043344',
                            num:'50,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.00000446',
                            num:'887,196',
                            countPrice:'3.95689416'
                        },
                       
                        
                ],
                buy:[
                       
                        {
                            price:'0.00000446',
                            num:'887,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.00544612311',
                            num:'112,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.0000043344',
                            num:'50,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.0000043344',
                            num:'50,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.00000446',
                            num:'887,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.00544612311',
                            num:'112,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.0000043344',
                            num:'50,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.0000043344',
                            num:'50,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.00000446',
                            num:'887,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.00544612311',
                            num:'112,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.0000043344',
                            num:'50,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.00544612311',
                            num:'112,196',
                            countPrice:'3.95689416'
                        },
                        {
                            price:'0.0000043344',
                            num:'50,196',
                            countPrice:'3.95689416'
                        }
                    ]
            },
            saleList:[
                {
                    price:'0.00000446',
                    num:'887,196',
                    countPrice:'3.95689416'
                },
                {
                    price:'0.00000446',
                    num:'887,196',
                    countPrice:'3.95689416'
                },
                {
                    price:'0.00000446',
                    num:'887,196',
                    countPrice:'3.95689416'
                }
            ],
            buyList:[
                {
                    price:'0.00000456',
                    num:'8557,196',
                    countPrice:'8.956894111'
                },
                {
                    price:'0.00000456',
                    num:'8557,196',
                    countPrice:'8.956894111'
                },
                {
                    price:'0.00000456',
                    num:'8557,196',
                    countPrice:'8.956894111'
                }
            ],
            priceListFlag:0,
            newPrice:'',
            recommendBuy:'',
            recommendSale:'',
            
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {}, thisState = this.state || {};
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
               
                if (thisState[key] !== nextState[key] || !is(fromJS(thisState[key]),fromJS(nextState[key]))) {
                    
                    return true;
                }
			}

            return false;
           
    }
    //深度合并
    mergeChange = (val) => {
        console.log(val)
    }


    //切换买卖列表
    toggleTrade = (val, index) => {
       
       this.refs.flag.style.transform = `translate3d(${val}, 0px, 0px)`;
       this.setState({
            priceListFlag:index
       });
    }

    //计算宽度
    addWidth = (arr,  curCount, width) => {
     
      
        let count = sumBy(arr, ( val ) => {  return Number(replace(val.qu, ',','')) });
       
        return  Math.ceil(replace(curCount, ',', '')/replace(count, ',','') * width);
    }

   

    render() {
     
        //list ： 生成交易盘列表 
        let list = null;
            const ty = this.props.exType.ty !== undefined ? this.props.exType.ty : -1;
         
        switch(this.state.priceListFlag) {
            case 0: 
            list = this.props.sale.length || this.props.buy.length ? <ul>
                    <AllList 
                            listData={this.props.sale.slice(0,12).reverse()} 
                            type="salePrice" 
                            addWidth={this.addWidth}
                            listClickHandle={this.props.getPrice}
                            pricePre ={this.props.pricePre } // 买价格精度
                            quanPre={this.props.quanPre} //卖价格精度
                    />
                        <li 
                              ref="alls"
                              onClick={() => {  this.props.getPrice('buyPrice', this.refs.alls.getAttribute('data')); this.props.getPrice('sale', this.refs.alls.getAttribute('data'));}}
                            className={cs("price-list-newPrice", {"buy-coin":ty === 0, 'sell-coin': ty===1}) } 
                            data={this.props.newPrice}><span>{this.props.newPrice}</span> ≈ {this.props.money}
                        </li>
                    <AllList 
                            listData={this.props.buy.slice(0,12)} 
                            type="buyPrice"
                            addWidth={this.addWidth}
                            listClickHandle={this.props.getPrice}
                            pricePre ={this.props.pricePre } // 买价格精度
                            quanPre={this.props.quanPre} //卖价格精度
                    />
                </ul> : <ul><li className="noData">{intl.get("暂无数据")}</li></ul>;
            break;
            case 1: 
            list =  this.props.sale.length  ?
                <Scrollbars 
                    style={{ width: 280, height: this.props.height || 786, }}
                    renderThumbVertical={({ style, ...props }) =>
                        <div {...props} style={{ ...style, borderRadius:8,backgroundColor:'#3C4A59', width: '5px', }}/>
                    }
                >
                    <ul>
                        <li 
                             ref="sales"
                             onClick={() => {this.props.getPrice('buyPrice', this.refs.sales.getAttribute('data')); this.props.getPrice('sale', this.refs.sales.getAttribute('data'));}}
                            className={cs("price-list-newPrice", {"buy-coin":ty === 0, 'sell-coin': ty===1}) } 
                            data={this.props.newPrice}><span>{this.props.newPrice}</span> ≈ {this.props.money}
                        </li>
                        <AllList 
                                listData={this.props.sale} 
                                type="salePrice" 
                                addWidth={this.addWidth}
                                listClickHandle={this.props.getPrice}
                                pricePre ={this.props.pricePre } // 买价格精度
                                quanPre={this.props.quanPre} //卖价格精度
                        />
                    </ul>
                </Scrollbars> :<ul><li className="noData">{intl.get("暂无数据")}</li></ul> ;
            break;
            case 2:
            list =   this.props.buy.length ?
                <Scrollbars 
                    style={{ width: 280, height: this.props.height || 786, }}
                    renderThumbVertical={({ style, ...props }) =>
                        <div {...props} style={{ ...style, borderRadius:8,backgroundColor:'#3C4A59', width: '5px', }}/>
                    }
                >
                    <ul>
                        <li 
                            ref="buys"
                            onClick={() => {this.props.getPrice('buyPrice', this.refs.buys.getAttribute('data')); this.props.getPrice('sale', this.refs.buys.getAttribute('data'));}}
                            className={cs("price-list-newPrice", {"buy-coin":ty === 0, 'sell-coin': ty===1}) } 
                            data={this.props.newPrice}><span>{this.props.newPrice}</span> ≈ {this.props.money}
                        </li>
                        <AllList 
                                listData={this.props.buy} 
                                type="buyPrice"
                                addWidth={this.addWidth}
                                listClickHandle={this.props.getPrice}
                                pricePre ={this.props.pricePre } // 买价格精度
                                quanPre={this.props.quanPre} //卖价格精度
                        />
                    </ul>
                </Scrollbars>:<ul><li className="noData">{intl.get("暂无数据")}</li></ul> ;
            
            break;
            default:
            break;
        }
       
        return (
            <div className="TradePricesList-wrap">
                {/* 头部切换交易区 */}
                <div className="TradePricesList-wrap-top">
                    <div className="TradePricesList-wrap-top-toggle">
                        <div className="triangle" ref="flag"></div>
                        <Avatar 
                                src={Icon_all_1} size="small"
                                style={{cursor:'pointer',marginRight:12}} 
                                shape="square" 
                                className="select-trade-session" 
                                onClick={(e) => {this.toggleTrade('0px',0)}}
                               
                        />
                        <Avatar 
                                src={Icon_buy_1} 
                                size="small"  
                                style={{cursor:'pointer',marginRight:12}} 
                                shape="square" 
                                onClick={(e) => {this.toggleTrade('36px',1)}}
                        />
                        <Avatar 
                                src={Icon_sale_1} size="small"
                                style={{cursor:'pointer',marginRight:12}} 
                                shape="square"
                                onClick={(e) => {this.toggleTrade('72px',2)}}
                        />
                    </div>
                    <div className="deep-merge-wrap">
                        {/* <span className="deep-merge-title">深度合并：</span>
                        <div className="deep-merge">
                            <div className="deep-merge-tooltip-wrap">
                                <span className="checked-merge">8位小数</span>
                                <Icon type="down" style={{fontSize:12,marginLeft:5}} />
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* 买卖盘列表 */}
                <div className="TradePricesList-title">
                    <p style={{width:'32%',textAlign:'left'}}>{intl.get("价格")}({this.props.coinArea})</p>
                    <p style={{width:'32%',textAlign:'right'}}>{intl.get("数量")}({this.props.coinName})</p>
                    <p style={{width:"35%",textAlign:"right"}}>{intl.get("成交金额")}</p>
                </div>
                   
                {list}
            </div>
        )
    }
}
