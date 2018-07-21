/* 
    委托页面列表组件
*/

import React from 'react';
import { Icon } from 'antd';
import moment from 'moment';
import cs from 'classnames';
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
        return 'sell-coin';
    } else {
        return 'buy-coin';
    }
}

const Entrust = (props) => {
   
    //生成头部
    const head = props.hdList.map( (item, index) => {
        return (
            item.sort?
            <th  key={index.toString()}>
                <span>{item.name}</span>
                <Icon 
                type="caret-down" 
                onClick={()=>{props.changeTradeData()}}
                style={{marginLeft:6,transform:'scale(0.7)',verticalAlign:'initial',color:'#3dadd9',cursor:'pointer'}}/>
            </th>
            :
            <th  key={index.toString()}>
                 {
                    item.sort === 0 ?
                    <div className="exState-wrap" onClick={props.showEXState}>
                        <div>
                            <span>{item.name}</span>
                            <Icon 
                                type="caret-down" 
                              
                                style={{marginLeft:6,transform:'scale(0.7)',verticalAlign:'initial',color:'#3dadd9',cursor:'pointer'}}/>
                        
                        </div>
                        <div className={cs('select-exstate', {'isShow': props.isShow} , 'animate')}>
                            <ul>
                                <li   onClick={()=>{props.changeData(null)}}>{intl.get("全部")}</li>
                                <li   onClick={()=>{props.changeData(4)}}>{intl.get("撤销")}</li>
                                <li   onClick={()=>{props.changeData(1)}}>{intl.get("未成交")}</li>
                                <li   onClick={()=>{props.changeData(2)}}>{intl.get("部分成交")}</li>
                                <li   onClick={()=>{props.changeData(3)}}>{intl.get("完全成交")}</li>

                            </ul>
                        </div>
                    </div>
                    :
                    <span>{item.name}</span>
                }
            </th>
        )
    });


   

    //生成列表
    const body = props.bodyList.length?props.bodyList.map( (item, index)=>{
            let show;
            if(item.status===3 || item.status===4){
                show = false
            }else{
                show = true;
            }
            return(
                    <tr key={index.toString()} >
                        <td>{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</td>
                        <td className={formatColor(item.type)}>{item.type===0? intl.get('买'): intl.get('卖')}</td>
                        <td>{item.price_fmt}</td>
                        <td>{item.quantity_fmt}</td>
                        <td>{item.successQuantity_fmt}</td>
                        <td>{formatVal(item.status)}</td>
                        {show?<td className="sell-coin" style={{cursor:'pointer'}} onClick={()=>props.cancelDele({id:item.id})}>{intl.get("撤销")}</td>:<td></td>}
                    </tr>
            )
    }): <tr><td colSpan="7" style={{textAlign:'center',color: '#808080',padding:'60px 0'}}>{intl.get("暂无数据")}</td></tr>

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

export default Entrust;