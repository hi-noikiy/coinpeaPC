/* 
    最新成交列表
    PriList: 列表组件
*/

import React from 'react';
import PriceList from '../shared/PriceList';
import moment from 'moment';
import { is } from 'immutable';
import { Scrollbars } from 'react-custom-scrollbars';
import './NewTradeList.scss';
import intl from "react-intl-universal"
import $ from 'jquery'

class NewTradeList  extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            newTradeList:[
                {
                    time: 1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                },
                {
                    time:1522215543012,
                    price:'0.00000615',
                    num:29.9,
                    type:'sale'
                },
                {
                    time:1522215543002,
                    price:0.00000615,
                    num:29.9,
                    type:'sale'
                },
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'sale'
                },
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                }
                ,
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                }
                ,
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                },
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                },
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                },
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                },
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                },
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                },
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                },
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                },
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                },
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                },
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                },
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                },
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                },
                {
                    time:1522215543002,
                    price:'0.00000615',
                    num:29.9,
                    type:'buy'
                }
            ] 
        }
    }  
    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {}, thisState = this.state || {};
		if( Object.keys(thisProps).length !== Object.keys(nextProps).length ||
			Object.keys(thisState).length !== Object.keys(nextState).length) {
			
			return true;
		}
		
		for (const key in nextProps) {
          
                if (!is(thisProps[key], nextProps[key])) {
                    return true;
                }
			}
		
			for (const key in nextState) {
               
                if (thisState[key] !== nextState[key] || !is(thisState[key],nextState[key])) {
                    
                    return true;
                }
			}

			return false;
    }
    render() {
      
        const list = this.props.record?this.props.record.map( (item, index) => {
              
                return (
                        
                        <PriceList 
                            key={index.toString()}
                            left={moment(item.ti).format("HH:mm:ss")}
                            center={item.pr}
                            type={item.ty}
                            right={item.qu}
                            listClickHandle={()=>{}}
                        />
                )
        }):<li className="noData">{intl.get('暂无数据')}</li>;
       
         return (
             <div className="new-trade-wrap">
                    <div className="new-trade-title">
                        {intl.get('最新成交')}
                    </div>
                    <div className="new-trade-list-hd">
                        <p style={{width:"38%"}}>{intl.get('成交时间')}</p>
                        <p style={{width:"32%"}}>{intl.get('成交价格')}</p>
                        <p style={{width:"30%", textAlign:'right'}}>{intl.get('成交量')}</p>
                    </div>
                    <Scrollbars 
                            style={{ width: 280, height: this.props.height || 312, }}
                            renderThumbVertical={({ style, ...props }) =>
                            <div {...props} style={{ ...style, borderRadius:8,backgroundColor: this.props.scrollBg, width: '5px', }}/>
                         }
                    >
                        <ul className="new-trade-list">{list}</ul>
                    </Scrollbars>
             </div>
         )
    }
}

export default NewTradeList;