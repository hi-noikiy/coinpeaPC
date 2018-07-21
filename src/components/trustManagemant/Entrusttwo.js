/* 
    委托页面列表组件
*/

import React from 'react';
import { Icon } from 'antd';
import moment from 'moment';
import './EntrustList.scss';
import intl from 'react-intl-universal'

const formatVal = (val) => {
    let values = '';
    switch(val) {
        case 1: 
        values = intl.get('未成交');
        break; 
        case 2:
        values = intl.get('部分成交');
        break; 
        case 3:
        values = intl.get('完全成交');
        break; 
        case 4:
        values = intl.get('撤销');
        break;
        default:
        return values = intl.get('未成交');
    }
   return values;
}

const formatColor = (val) => {
    if(val === 1) {
        return 'buy-coin';
    } else {
        return 'sell-coin';
    }
}

const Entrusttwo = (props) => {
   
    //生成头部
    const head = props.hdList.map( (item, index) => {
        return (
            <th  key={index.toString()} className="history-tr">
                <span>{item.name}</span>
                { item.sort?
                    <Icon 
                    type="caret-down" 
                    onClick={()=>{props.changeTradeData()}}
                    style={{marginLeft:6,transform:'scale(0.7)',verticalAlign:'initial',color:'#3dadd9',cursor:'pointer'}}/>:''}</th>
        )
    });


    //生成列表
    const body = props.bodyList.length?props.bodyList.map( (item, index)=>{
            return(
                    <tr key={index.toString()} >
                        <td>{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</td>
                        <td className={formatColor(item.type)}>{item.type===0? intl.get('买'): intl.get('卖')}</td>
                        <td>{item.price_fmt}</td>
                        <td>{item.quantity_fmt}</td>
                        <td>{item.amount_fmt}</td>
                        <td>{item.poundage_fmt}</td>
                    </tr>
            )
    }):<tr><td colSpan="7" style={{textAlign:'center',color: '#808080',padding:'60px 0'}}>{intl.get('暂无数据')}</td></tr>

    return(
        <table className="entrust-tabs">
            <thead>
                <tr>
                    {head}
                </tr>
            </thead>
            <tbody>
                {body}
            </tbody>
        </table>
    )
}

export default Entrusttwo;