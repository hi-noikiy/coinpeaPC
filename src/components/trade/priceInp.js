/* 
    价格输入框组件
*/
import React from 'react';
import { Input, Tooltip } from 'antd';
import cs from 'classnames';
import { formatNumber }  from '../../utils';

import './priceInp.scss';




const PriceInp = (props) => {

    const { value, tooltip } = props;
    const title = value ? (<span className="numeric-input-title">
                            {value !== '-' ? formatNumber(value) : '-'}
                          </span>)
                        : <span className="numeric-input-title" style={{fontSize:12}}>{tooltip}</span>;

        return ( 
            <div className={cs("prcieInp-wrap")} style={{backgroundColor:props.tradeType === 'market' && props.types === 'price'  ? '#D8D8D8':''}}>
                <span>{props.l_text}</span>
                <Tooltip
                    trigger={['focus']}
                    title={title}
                    placement="topLeft"
                    overlayClassName="numeric-input"
                >
                    <Input
                        {...this.props}
                        onChange={(e) => {props.onChange(e, props.inpType)}}
                        onBlur={props.onBlur}
                        placeholder={props.placeholder}
                        maxLength="15"
                        value={props.value} 
                        disabled={props.tradeType === 'market' && props.types === 'price'}
                    />
                </Tooltip>
                <span>{props.r_text}</span>
            </div>
        )
} 

export default PriceInp;