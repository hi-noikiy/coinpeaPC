/* 
    交易页交易区表格
*/

import React, { Component } from 'react';
import {  Icon,   } from 'antd';
import { addColor, addSymbols, shallowEqualImmutable} from '../../utils';
import { setPrecision, setSymbol} from '../../utils';
import { Scrollbars } from 'react-custom-scrollbars';
import intl from 'react-intl-universal';

import cs from 'classnames';
import './TradeTabs.scss';

export default class TradeTabs extends Component {

 
    render() {
          
       
            const TrList = this.props.tradeList.map( (item, index) => {
                 
                    return (
                        <li 
                            key={index.toString()} 
                            className={String(this.props.coinId) === String(item.id)?'select-coin-tr':''}
                            onClick={(e) => {this.props.selectCoin(e, item)}}
                        >
                            <div style={{textAlign:'left',paddingLeft:10,width:'42%',overflow:'hidden'}}>
                           
                                <Icon 
                                        type={item.isc?"star":"star-o"} 
                                        className={cs('custom-select',{'custom-slect-add':item.isc})}
                                        onClick={ (e) => {this.props.saveCoin(e, item, this.props.areaIndex)}}
                                />
                                <span> {item.na}</span>
                            </div>
                            <div 
                                className={setSymbol(item.ty, 'addColor')} 
                                style={{width:'28%',overflow:'hidden'}}
                            >
                                {item.np}
                            </div>
                            <div 
                                className={setSymbol(item.ty, 'addColor')}  
                                style={{width:'30%',paddingRight:10,boxSizing:'border-box',textAlign:'right',overflow:'hidden'}}
                            >
                                {setSymbol(item.ty)}{item.ud}%
                            </div>
                        </li>
                    )
            });

            return (
                <div className="trade-tab">
                        <div className="trade-area-title">
                            <p style={{width:'42%',paddingLeft:10}}>{intl.get("交易区")}</p>
                            <p  style={{width:'38%'}}>{intl.get('最新价')}</p>
                            <p  style={{width:'20%',textAlign:'right', paddingRight:10}}>{intl.get("涨跌")}</p>
                        </div>
                    <Scrollbars   
                            style={{ width: 280, height: 362 }}
                            renderThumbVertical={({ style, ...props }) =>
                            <div {...props} style={{ ...style, borderRadius:8,backgroundColor:'#3C4A59', width: '5px', }}/>
                         }>
                    <ul>
                       {TrList.length?TrList: <li className="noData" style={{paddingLeft:"40%"}}>{intl.get("暂无数据")}</li>} 
                    </ul>
                    </Scrollbars>
                </div>
            )    
      }

    
  }