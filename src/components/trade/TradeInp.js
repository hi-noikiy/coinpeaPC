/* 
    交易页 输入框
    PriceInp: 输入框
*/
import React from 'react';
import {Button} from 'antd';
import cs from 'classnames';
import PriceInp from './priceInp';
import { setPrecision } from '../../utils';
import intl from "react-intl-universal";

import './TradeInp.scss';


const percent = ['25%', '50%', '75%', '100%'];

const TradeInp = ( props ) => {
 
   return(
        <div className={cs('tradeInp-wrap', props.class)}>
            <div className="tradeInp-title">
                <h3 className={cs({'buy':props.type==='buy', 'sale':props.type==='sale'})}>
                    {props.type==='buy'? intl.get('买入'): intl.get('卖出')}&nbsp;{props.title}
                </h3>
                <p className="tradeInp-title-des">
                        {props.subTitle}{intl.get('可用')}：<span>{props.balance}</span>
                </p>
            </div>    
            <div className="tradeInp-content">
                <PriceInp 
                        {...props}
                        tooltip={intl.get('请输入价格')}
                        value={props.price}
                        inpType={props.priceInpType}
                        tradeType={props.tradeType}
                        types='price'
                        r_text={props.coinArea}   
                />

                {
                    props.tradeType === 'market' ? <div style={{width:'100%', height:15}}></div>: <p className="price-des">≈ {props.exChangeRate?props.exChangeRate :'0'}</p> 
                }

                 <PriceInp 
                        {...props} 
                        l_text={intl.get("数量")}
                        tooltip={intl.get('请输入数量')}
                        value={props.num}
                        inpType={props.numInpType}
                       
                />
                <div onClick={(e) => {props.selectPercent(e, props.numInpType)}} className={cs("selectPercent",{'sale': props.type === 'sale'})}>
                    { percent.map( (val, index) => {
                        return <span key={index.toString()} index={index} className={props.percentIndex===index?'activePercent':''}>{val}</span>
                    })}
                </div>

                {/* 手续费及交易额 */}
                {
                   //setPrecision(props.count, props.pricePre?props.pricePre:8)} 交易额有多少显示多少
                    props.tradeType === 'market' ? <div className="fees-wrap"><p>{intl.get("手续费")}: <span>{props.fees?props.fees:0}%</span></p></div>
                                                 : <div className="fees-wrap">
                                                      {/*   <p>手续费: <span>{props.fees?props.fees:0}%</span></p> */}
                                                        <p>{intl.get("交易额")}: <span>{props.count}&nbsp;{props.coinArea}</span> <span style={{color:'#8EA0B5'}}>(≈ {props.countEX?props.countEX :'0'})</span></p>
                                                   </div>
                }
                <Button 
                            onClick={props.btnClick} 
                            className={cs('myBtn', {'buy-myBtn': props.type==='buy', 'sale-myBtn': props.type==="sale"})}
                >{props.btnText}</Button>
            </div>
        </div>
   )
}

export default TradeInp;