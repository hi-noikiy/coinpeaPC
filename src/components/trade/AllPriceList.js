
//买盘 卖盘 全部列表
import React from 'react';
import PriceList from '../shared/PriceList';
import { setPrecision, precision_zero } from '../../utils';


const AllPriceList = (props) =>{
   
    const AllList = props.listData.map(( item, index ) => {
        
        return (
            <PriceList 
                key={index.toString()}
                left={item.pr}
                center={precision_zero(item.qu, props.quanPre)} // 买价格精度
                type={props.type}
                right={setPrecision(item.money.toFixed(), props.pricePre)} // setPrecision(item.money, props.pricePre)
                addWidth={props.addWidth(props.listData, item.qu, 280)}
                listClickHandle={() => {props.listClickHandle(props.type, item.pr, item.id)}}
            />
        ) 
    })
    return AllList;
}

export default AllPriceList;