
//列表组件
import React from 'react';
import cs from 'classnames';
import './PriceList.scss';
const PriceList = (props) => {
  
        return(

            <li 
                onClick={(e) =>{props.listClickHandle(e)}} 
                className={cs("list-wrap",{'list-sale-color':props.type===1 || props.type === 'salePrice', 'list-buy-color': props.type===0 || props.type === 'buyPrice'})}
            >
                <div  className={cs("list-left")}>{props.left}</div>
                <div  className={cs("list-cent",  {'new-price-sale':( props.type ===1 || props.type === 'salePrice'), 'new-price-buy':  (props.type===0 || props.type === 'buyPrice')})}>{props.center}</div>
                <div  className={cs("list-right", {'new-price-sale':( props.type ===1 || props.type === 'salePrice'), 'new-price-buy':( props.type ===0 || props.type === 'buyPrice')})}>
                    <div >{props.right}</div>
                    <div style={{width:props.addWidth}} className={cs('list-bg', {'buy-list-bg': props.type ===0 || props.type === 'buyPrice', 'sell-list-bg': props.type === 1 || props.type === 'salePrice'})}></div>
                </div>
            </li>
        ) 
}

export default PriceList;