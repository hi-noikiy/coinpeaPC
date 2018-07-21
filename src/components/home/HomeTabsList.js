/* 
    Home页交易区tab列表组件
    TradeTabs: 交易区列表
    Search: 列表搜索
*/
import React, { Component } from 'react';
import { is, toArray } from 'immutable';
import { Tabs} from 'antd';

import {  ACTION_SORT_TABS_24H, ACTION_SORT_TABS_COUNT,  } from './HomeTabsListRedux';

//自定义组件
import Search from './Search';
import TradeTabs from './TradeTabs';

//css
import './HomeTabsList.scss';
/* let timer = null;
let timer2 = null */;

//变量
const TabPane = Tabs.TabPane;
class HomeTabsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowSearch:false,
            searchVal:'',
            isUp:'',
            isDown:'',
            isCountUp:'',
            isCountDown:'',
            activeKey:'2',
        }
    }

  
    
    shouldComponentUpdate(nextProps, nextState) {

        const props = this.props ||{}, state = this.state || {};
        if(Object.keys(props).length !== Object.keys(nextProps).length || 
            Object.keys(state).length !== Object.keys(nextState).length) {
                return true;
        }

        for(let key in nextProps) {
            if( !is(props[key], nextProps[key]) ) {
                return true;
            }
        } 
        
        for(let key in nextState) {
            if( !is(state[key], nextState[key]) ) {
                return true;
            }
        } 

        return false;
    }

   
    render() {
       
        const {  tradeList } = this.props.tradeTabslist;
        const PaneList = tradeList.map( (item, index) => {
           
            return (
                <TabPane
                    tab={item.name}
                    key={(index+1).toString()}
                    
                >
                    <TradeTabs
                            {...this.props}
                            areaIndex={index} 
                            data={ item.data?item.data.toArray():[] } 
                            tabSort={this.tabSort }
                            isDown={this.state.isDown}
                            isUp={this.state.isUp}
                            isCountDown={this.state.isCountDown}
                            isCountUp={this.state.isCountUp}
                            
                    />
                </TabPane>
            )
        })
        
        return (
                <Tabs 
                    size="large"
                    onChange={this.changeTardeArea}
                    tabBarExtraContent={ tradeList.size?
                                        <Search
                                            searchClick={this.searchClick}
                                            isShowSearch={this.state.isShowSearch} 
                                            handleChange={this.handleChange} 
                                            value={this.state.searchVal} 
                                            hideSearch={this.hideSearch}
                                        />:null}
                    activeKey={this.state.activeKey}
                >
                    { PaneList }
                </Tabs>
           
        )
    }
    
    //tab排序
    tabSort = (sortBy) => {
        //点击排序，给箭头图标添加类名
       if(sortBy.type==='down') {
           if(sortBy.sortType === '24h') {
               this.setState({
                   isDown:'down',
                   isUp:'',
                   isCountDown:'',
                   isCountUp:''
               })
              
           }
           if(sortBy.sortType === 'count') {
                this.setState({
                    isCountDown:'countDown',
                    isCountUp:'',
                    isUp:'',
                    isDown:''
                })
           }
       } else {
                if(sortBy.sortType === '24h') {
                    this.setState({
                        isUp:'up',
                        isDown:'',
                        isCountDown:'',
                        isCountUp:''
                    })
                }
                if(sortBy.sortType === 'count') {
                    this.setState({
                        isCountUp:'countUp',
                        isCountDown:'',
                        isUp:'',
                        isDown:''
                    })
                }
       }
       //根据不同排序类型，排序state里数组
        switch(sortBy.sortType) {
            case '24h':
            this.props.sort24H({type:sortBy.type,areaIndex: this.state.activeKey});
            break;
            case 'count':
            this.props.sortCount({type:sortBy.type,areaIndex: this.state.activeKey});
            break;
            default:
            return null;
        }
    }
   
    //tabs切换交易区handle
    changeTardeArea = (key) => {
        this.setState({
            activeKey: key,
            isUp:'',
            isDown:'',
            isCountDown:'',
            isCountUp:''
        })
        // this.props.filters(Number(key)-1, this.state.searchVal);
    }

    //点击搜索框
    searchClick = () =>{
        const search = document.querySelector('#search');
        search.focus();
        
    }
    //搜索框changeHandle
    handleChange = (e) => {
        this.props.filters(Number(this.state.activeKey)-1, e.target.value);
        this.setState({
            searchVal: e.target.value
        })
    }
 
}

export default HomeTabsList;