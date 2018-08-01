/* 
    交易页交易区表格
*/
import './AreaTabs.scss';
import React from 'react';
import {  Icon,   } from 'antd';
import { setSymbol } from '../../utils';
import { Scrollbars } from 'react-custom-scrollbars';
import intl from 'react-intl-universal';
import cs from 'classnames';


interface IProps {
    tradeList: any[];
    selectCoin: (e:any, item:any) => void;
    saveCoin: (e:any, item:any, areaIndex:number) => void;
    coinId: string|number;
    areaIndex: number;
    calculateEX:(pr:string) => string;
}


export default class AreaTabs extends React.Component<IProps, any> {

    render() {

            const TrList = this.props.tradeList.map( (item, index) => {
                   
                    return (
                        <li 
                            key={index.toString()} 
                            className={String(this.props.coinId) === String(item.id)?'select-coin-tr':''}
                            onClick={(e) => { this.props.selectCoin(e, item)}}
                        >
                            <div style={{textAlign:'left',paddingLeft:10,overflow:'hidden'}}>
                                <Icon 
                                        type={item.isc?"star":"star-o"} 
                                        className={cs('custom-select',{'custom-slect-add':item.isc})}
                                        onClick={ (e) => {this.props.saveCoin(e, item, this.props.areaIndex)}}
                                />
                                <span > {item.na}</span>
                            </div>
                            <div 
                                className={setSymbol(item.ty, 'addColor')} 
                                style={{overflow:'hidden'}}
                            >
                                {item.np}
                                <span style={{fontSize:12, color:"#8EA0B5"}}>/{this.props.calculateEX(item.np)}</span>
                            </div>
                            <div 
                                className={setSymbol(item.ty, 'addColor')}  
                                style={{paddingRight:10,boxSizing:'border-box',textAlign:'right',overflow:'hidden'}}
                            >
                                {setSymbol(item.ty)}{item.ud}%
                            </div>
                            <div 
                                style={{paddingRight:10,boxSizing:'border-box',textAlign:'right',overflow:'hidden'}}
                            >
                                {item.gv}%
                            </div>
                        </li>
                    )
            });

            return (
                <div className="trade-tab">
                        <div className="trade-area-title">
                            <p style={{paddingLeft:10}}>{intl.get("交易区")}</p>
                            <p >{intl.get('最新价')}</p>
                            <p  style={{textAlign:'right', paddingRight:10}}>{intl.get("24H涨跌")}</p>
                            <p  style={{textAlign:'right', paddingRight:10}}>{intl.get("24H成交量")}</p>
                        </div>
                    <Scrollbars   
                            style={{  width: 586, height:280 }}
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