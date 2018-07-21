/* 
    交易页交易面板
    TradeInp: 输入框面板组件
*/

import React from 'react';
import TradeInp from './TradeInp';
import cs from 'classnames';
import { message}  from 'antd';
import { is , fromJS} from 'immutable';
import { times, setPrecision,precision_zero ,shallowEqualImmutable } from '../../utils';
import { connect } from 'react-redux';

import './TradeInpPannel.scss';
import intl from "react-intl-universal";

import { CHANGE_ASSETS_ACTION } from '../../views/LoginRedux'

//api
import { buy, sale } from '../../api/trade';




class TradeInpPannel extends React.Component {
     
    constructor(props) {
        super(props);
        this.state = {
            tradeType: "limitPrice",
            buyVal:'',
            buyNum:'',
            saleVal:'',
            saleNum:'',
            buyPercentIndex:-1,
            salePercentIndex:-1,
            buyCount:0,
            saleCount:0,
            btnLock:false
        }
    }
   
    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {}, thisState = this.state || {};
	
		if( Object.keys(thisProps).length !== Object.keys(nextProps).length ||
			Object.keys(thisState).length !== Object.keys(nextState).length) {
			
			return true;
		}
        

       
     
		for (const key in nextProps) {
               
                if (!is(fromJS(thisProps[key]), fromJS(nextProps[key])) && typeof nextProps[key] !== 'function' && typeof thisProps[key] !== 'function' ) {
                 
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
    //切换交易面板
    toogleTrade = (pos, type) => {
       
        this.refs.transforTrade.style.transform = `translate3d(${pos}, 0px, 0px)`;
        this.setState({
            tradeType: type,
            buyVal:'',
            buyNum:'',
            saleVal:'',
            saleNum:'',
            buyPercentIndex: -1,
            salePercentIndex:-1,
            buyCount:0,
            saleCount:0,
            
        });
    }

    //买卖
    trade = (type) => {
       message.destroy();
        if(this.state.tradeType === 'limitPrice') {
            const data = {
                dealEntrust:{
                    coinRelationId: this.props.id,
                    price: this.props[`${type}Price`],
                    quantity: this.state[`${type}Num`]
                }
            }
           
            if(!data.dealEntrust.price || !data.dealEntrust.quantity ) return message.info(intl.get('价格或者数量不能为空'), () =>{
                this.setState({
                    btnLock:false,
                   
                })
            });

            this.setState({
                btnLock:true
            })

            if(type === 'buy') {
               
               if(Number(this.state.buyCount) > Number(this.props.regAmount)) {

                        this.setState({
                            btnLock:false,
                        
                        })
                        return message.info(intl.get("余额不足"));
               } 

                    buy(data)
                    .then(res => {
                        if(res.status === 1) {
                            message.success(res.msg);
                            this.props.setPrice('areaBalance',res.data.total);
                            //this.props.getUserAssets();  //交易完更新资产信息
                        } else {
                            message.error(res.msg);
                        }

                        this.setState({
                            btnLock:false,
                            buyNum:'',
                            buyCount:0,
                            buyPercentIndex:' '
                        })
                    })
            } else {
               if(Number(this.state.saleNum) > Number(this.props.coinAmount))  {
                  
                    this.setState({
                        btnLock:false,
                    })

                    return message.info(intl.get("余额不足"));
               }
                sale(data)
                .then(res => {
                    if(res.status === 1) {
                        message.success(res.msg);
                        this.props.setPrice('coinBalance',res.data.total );
                    } else {
                        message.error(res.msg);
                    }

                    this.setState({
                        btnLock:false,
                        saleNum:'',
                        saleCount:0,
                        salePercentIndex:' '
                    })
                })

            }

        } else {
            this.setState({
                btnLock:false,
               
            })
        }
    }
    
    //获取焦点
    onChange = (e, type) => {
         
        const {value} = e.target;
       
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
         
        if ((!isNaN(value) && reg.test(value)) || value === '' ) {
        
            if(type === 'buyPrice' || type === 'salePrice') {
                 if(!this.precision(value,this.props.pricePre?this.props.pricePre:8))  return;
            } 

            if(type === 'buyNum' || type === 'saleNum') {
                if(!this.precision(value, this.props.quanPre?this.props.quanPre:8))  return;
            } 
         
            switch(type) {

                case 'buyPrice':
                this.props.setPrice(type, value);
               
                this.setState({
                    buyCount:setPrecision(times(value, this.state.buyNum?this.state.buyNum:0), 8),
                    buyPercentIndex: '',
                })
                break;
                
                case 'buyNum':
                    this.setState({
                        buyNum: value,
                        buyCount: setPrecision(times(value?value:0, this.props.buyPrice?this.props.buyPrice:0), 8),
                        buyPercentIndex: '',
                      })
                break;
                case 'salePrice':
                    this.props.setPrice(type, value);

                    this.setState({
                        saleCount:setPrecision(times(value?value:0, this.state.saleNum?this.state.saleNum:0), 8),
                        salePercentIndex: '',
                    })
                break;
                case 'saleNum':
                    this.setState({
                        saleNum: value,
                        saleCount:setPrecision(times(value?value:0, this.props.salePrice?this.props.salePrice:0), 8),
                        salePercentIndex: '',
                      })
                break;
                default:
                return;
            }
        }
    }

    //控制精度函数
    precision = (value, precision) => {
        if(value.indexOf('.') === -1) return true;
       
        return   value.split('.')[1].length <= precision
    }
    //btn click handle
    btnClickHandl = (type) => {
      
         const a = () => {

            if(this.state.btnLock) return false;
            
            if(!this.props.loginState)  {
                this.props.history.push('/login');
    
            } else  {
              
                this.trade(type);
            }
        }
        return a
    }
    //选择百分比
    selectPercent = (e, type) => {
        if(e.target.className === 'selectPercent' || e.target.className === 'selectPercent sale') return false;
        const index = Number(e.target.getAttribute('index'));
        const val = parseInt(e.target.innerText) / 100;
        e.target.className="activePercent";

        
        if(type === 'buyNum') {
            
            const count  = this.props.buyPrice===0?0:this.props.regAmount/this.props.buyPrice;

            if(this.props.buyPrice === 0 ) {

                this.setState({
                    buyCount:0,
                    buyPercentIndex: index,
                    buyNum:0,
                })
            } else {
                this.setState({
                    buyNum:setPrecision(times(count,val),this.props.quanPre),
                    buyPercentIndex: index,
                    buyCount:setPrecision(times(times(count,val), this.props.buyPrice),this.props.quanPre)
                })
            }
           
        } else {
          
            if(this.props.salePrice === 0) {
                this.setState({
                    saleCount:0,
                    salePercentIndex: index,
                    saleNum:0
                })
            } else {
            
                this.setState({
                    saleNum:setPrecision(times(this.props.coinAmount,val), this.props.quanPre),
                    salePercentIndex:index,
                    saleCount:setPrecision(times(times(this.props.coinAmount,val), this.props.salePrice),this.props.quanPre)
                })
            }
            
        }
        e.stopPropagation();
        
    }
   
    componentWillReceiveProps(nextProps) {
        if(nextProps.id !== this.props.id) {
             this.setState({
               
                 buyVal:'',
                 buyNum:'',
                 saleVal:'',
                 saleNum:'',
                 buyPercentIndex: -1,
                 salePercentIndex:-1,
                 buyCount:0,
                 saleCount:0,
                 
             });
        } 
     }
     
    render() {
       
        return (
            <div className="tradeInpPannel">
                <div className="tradeInpPannel-top">
                    <div className="triangle" ref="transforTrade"></div>
                    <span 
                            className={cs({'isActive':this.state.tradeType === 'limitPrice'})}
                            onClick={(e) => {this.toogleTrade('0px', 'limitPrice')}}
                    >{intl.get("限价交易")}</span>
                   {/*  <span 
                            className={cs({'isActive':this.state.tradeType === 'market'})}
                            onClick={(e) => {this.toogleTrade('77px', 'market')}} 
                            style={{marginLeft:20}}
                    >市价交易</span> */}
                </div>
                <div className="tradeInpPannel-content">
                    <TradeInp 
                        type="buy"
                        title={this.props.title}
                        subTitle={this.props.subTitle}
                        balance={this.props.regAmount} //余额
                        tradeType={this.state.tradeType}
                        l_text={intl.get("买价")}
                        r_text={this.props.title}
                        btnText={this.props.loginState? intl.get("买入"): intl.get("登录")+'/'+intl.get("注册") }
                        btnClick={this.btnClickHandl('buy')}
                        onChange={this.onChange}
                        price={this.props.buyPrice}
                        num={this.state.buyNum}
                        priceInpType='buyPrice'
                        numInpType='buyNum'
                        selectPercent={this.selectPercent}
                        percentIndex={this.state.buyPercentIndex}
                        coinArea={this.props.coinArea}
                        count={precision_zero(this.state.buyCount, 8)} //交易额
                        fees={this.props.buyFees}
                        exChangeRate={this.props.exChangeRate(this.props.buyPrice||0)}
                        countEX={this.props.exChangeRate(this.state.buyCount || 0)}
                        pricePre={this.props.pricePre}//价格精度
                        quanPre={this.props.quanPre}//数量精度
                    />
                    <div className="split-line"></div>
                    <TradeInp 
                         type="sale"
                         title={this.props.title}
                         subTitle={this.props.title}
                         balance={this.props.coinAmount}  //余额
                         tradeType={this.state.tradeType}
                         l_text={intl.get("卖价")}
                         r_text={this.props.title}
                         btnText={this.props.loginState? intl.get("卖出"): intl.get("登录")+'/'+intl.get("注册")}
                         btnClick={this.btnClickHandl('sale')}
                         onChange={this.onChange}
                         price={this.props.salePrice}
                         num={this.state.saleNum}
                         priceInpType='salePrice'
                         numInpType='saleNum'
                         selectPercent={this.selectPercent}
                         percentIndex={this.state.salePercentIndex}
                         coinArea={this.props.coinArea}
                         count={precision_zero(this.state.saleCount, 8)} //交易额
                         fees={this.props.saleFees}
                         countEX={this.props.exChangeRate(this.state.saleCount)}
                         exChangeRate={this.props.exChangeRate(this.props.salePrice || 0)}
                         pricePre={this.props.pricePre}//价格精度
                         quanPre={this.props.quanPre}//数量精度
                    />
                </div>
            </div>
        )
    }
} 



const mapDispatchToProps = (dispatch) => {
    return {
        getUserAssets:()=>dispatch(CHANGE_ASSETS_ACTION())
    }
}



export default connect(undefined,mapDispatchToProps)(TradeInpPannel);