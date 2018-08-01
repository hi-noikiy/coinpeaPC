/* 

    交易页面委托面板
*/
import { Button } from 'antd';
import './DelegateTabsPannel.scss';
import React from 'react';
import DelegateTabs from './DelegateTabs';

import cs from 'classnames';

import { is } from 'immutable';
import intl from 'react-intl-universal';
import Clock from '../shared/Clock';

class DelegateTabsPannel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex :0,
            tradeState:'all'
        }
    }
  
    toogleTrade = (e,index) => {
        const types = index === 0? 'all' : 'allHis';
         
            this.setState({
                activeIndex: index,
                tradeState:'all'
            })

     
        this.props.deleTabsHdClcik(index, types);

        try {
            
            const pos = e.target.offsetLeft + e.target.offsetWidth/2-38+'px';
            this.refs.delegater.style.transform = `translate3d(${pos}, 0px, 0px)`;   
        } 

        catch(e) {
            console.log(e.target)
        }
       
    }

    controlDelegateList = (val, fn) => {
        this.setState({
            tradeState:val
        });
   
        fn(this.state.activeIndex, val);
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
            if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
               
                return true;
            }
          }

          return false;
    }

    render () {
    
        //生成头部及内容
        const pannelContent = [];
        const pannelHd = this.props.pannelHdList.map((item, index) => {
           
            pannelContent.push(<DelegateTabs 
                                            key={index.toString()}
                                            isShow={index === this.state.activeIndex}
                                            columns={item.columns}
                                            dataSource={item.dataSource}
                                            rowKeys={index.toString()}
                                />)
            return (
                        <span 
                                key={index.toString()}
                                className={cs({'isActive':this.state.activeIndex === index})}
                                onClick={(e) => {this.toogleTrade(e,index)}}
                        >{item.name}</span>
            )
        });
        
        console.log(this.props.showClock)
      
       return (
        <div className="delegateTabs trade-content-center-b">
         
                <div className="tradeInpPannel-top">
                    <div className="delegateTabs-top">
                        <div className="triangle" ref="delegater"></div>
                        {pannelHd}

                    </div>

                    {
                        this.props.showClock ? 
                        <div className="date">
                            <Clock />
                        </div>
                        :
                        <div className="delegateTabs-right">
                           {/*  <span
                                    onClick={ () => this.controlDelegateList('buy', this.props.deleTabsHdClcik)}
                                    className={cs({'isActive':this.state.tradeState === 'buy'})}   
                            >{intl.get("买入")}</span>
                            <span   
                                    onClick={ () => this.controlDelegateList('sale', this.props.deleTabsHdClcik)}
                                    className={cs({'isActive':this.state.tradeState === 'sale'})}
                            >{intl.get("卖出")}</span>
                            <span   
                                    onClick={ () => this.controlDelegateList('all', this.props.deleTabsHdClcik)}
                                    className={cs({'isActive':this.state.tradeState === 'all'})}
                            >{intl.get("全部")}</span> */
                           }
                            <Button type="primary" size="small" ghost onClick={() => this.props.moreClick(this.state.activeIndex)}>{intl.get("查看更多")}></Button>
                         </div>
                    }
                    
                   
                </div>
            {pannelContent}
        </div>
       )
    }
}

export default DelegateTabsPannel;