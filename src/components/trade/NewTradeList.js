/* 
    最新成交列表
    PriList: 列表组件
*/
import './NewTradeList.scss';
import React from 'react';
import PriceList from '../shared/PriceList';
import moment from 'moment';
import { is } from 'immutable';
import { Scrollbars } from 'react-custom-scrollbars';

import intl from "react-intl-universal"


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
                            right={moment(item.ti).format("HH:mm:ss")}
                            center={item.qu}
                            type={item.ty}
                            left={item.pr}
                            listClickHandle={()=>{}}
                        />
                )
        }):<li className="noData">{intl.get('暂无数据')}</li>;
       
         return (
             <div className="new-trade-wrap">
                   {/*  <div className="new-trade-title">
                        {intl.get('最新成交')}
                    </div> */}
                    <div className="new-trade-list-hd">
                        <p>{intl.get('价格')}</p>
                        <p>{intl.get('数量')}</p>
                        <p>{intl.get('时间')}</p>
                    </div>
                    <Scrollbars 
                            style={{ width: this.props.width|| 280, height: this.props.height || 312, }}
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