/* 
    Home页交易区表格
*/

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Avatar, Icon, Button, message  } from 'antd';
import {  remove  } from 'lodash';
import {  _LocalStorage, setSymbol} from '../../utils';
import intl from "react-intl-universal";
import  cs from "classnames"

import { is } from 'immutable';

//api 
import { addSelect, delSelect } from '../../api/home';

//css
import './TradeTabs.scss';
 class TradeTabs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedArr:[]
          }
         this.ls = new _LocalStorage();
    }

    componentDidMount() {
        this.setState(preState => {
            
        })
    }

    goToTrade = (id, na, url, key) => {
       /*    this.props.history.push(`/trade?id=${id}&na=${na}&active=${key}`);
          this.ls.set('iconUrl', url) */
        //  const a = window.location.pathname;
          this.ls.set('iconUrl', url) 
         this.props.history.push(`/trade?na=${na.replace('/','_')}`) //&active=${key}
    }

     //添加自选
     select = (e, item, areaIndex) => {
       
        item.isc  = !item.isc;
        //未登录 则保存在本地
        if(!this.props.loginState) {
            item.isc ? this.addLocalStore(item): this.removeLocalStore(item.id);
        } else {
            item.isc ? addSelect(item.id).then(res => {
               // message.info(res.msg)
            }) : delSelect(item.id).then(res => {
               // message.info(res.msg)
            }) ;
        }
        this.props.saveCoin({id:item.id, select:item.isc, areaIndex: areaIndex});
      //  this.props.dispatch(ACTION_SAVE_COIN_LOCAL({id:item.id, select:item.isc, areaIndex: areaIndex}));
      /*   this.props.data.data[areaIndex].data.update(item.id.toString(), v => v.isc = 1 ) */
        e.stopPropagation();

    }

    //本地存储自选
    addLocalStore = (coin) => {
      
        const lcdata = this.ls.get('checkedCoinArr') || {};
        lcdata[coin.id] = coin;
        this.ls.set('checkedCoinArr', lcdata);
    }

    //删除本地存储
    removeLocalStore = (coinId) => {
        
       
        const lcdata = this.ls.get('checkedCoinArr');
   
        if(lcdata[coinId]) {
           
            delete lcdata[coinId];
        }
    
       this.ls.set('checkedCoinArr', lcdata);
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

    render() {
        
          const { data } = this.props;
       
         // const { checkedArr } = this.state;
        
         const TrList = data.length ? data.map( (item, index) => {
             
                    return (
                        <tr key={(Math.random()*index**300).toString()}>
                            <td style={{cursor:'pointer'}}>
                                <Icon 
                                        type={item.isc?"star":"star-o"}
                                        style={{fontSize:14, color:item.isc?'#3DADD9':'#AFBCCB'}}
                                        onClick={(e)=>{this.select(e, item, this.props.areaIndex)}}
                                 />
                            </td>
                            <td style={{textAlign:'left'}} >
                                <Avatar
                                    src={item.url}
                                    style={{ verticalAlign: 'middle', marginRight:10 }}  />
                                {item.na}
                            </td>
                            <td><span >{item.np}</span>/<span className="times">{item.times}</span></td>
                            <td style={{width:140}} className={setSymbol(item.ty, 'addColor')}>{setSymbol(item.ty)}{item.ud}%</td>
                            <td>{item.hp}</td>
                            <td>{item.lp}</td>
                            <td style={{width:170}}>{item.gv}</td>
                            <td>
                                <Button 
                                        type="primary" 
                                        onClick={()=>{this.goToTrade(item.id, item.na, item.url, this.props.areaIndex)}}>{intl.get('去交易')}</Button>
                            </td>
                        </tr>
                    )
            }):<tr><td></td><td></td><td></td><td style={{width:140}}></td><td style={{textAlign:'center',}}>{intl.get("暂无数据")}</td><td></td><td style={{width:170}}></td><td></td></tr>
            return (
               
                <table className="home-tab">
                    <thead>
                        <tr>
                            <th></th>
                            <th style={{width:170}}>{intl.get('交易对')}</th>
                            <th style={{width:140}}>{intl.get("最新成交价")}</th>
                            <th className="tab-sort" style={{width:140}}>
                                <span>{intl.get("24H涨跌")}</span>
                                <span className="base-select-arrow">
                                    <Icon 
                                            type="caret-up" 
                                            className={this.props.isUp ==='up'?'isUp':'' }
                                            onClick={() =>{this.props.tabSort({sortType:'24h',type:'up'})}}
                                     />
                                    <Icon
                                            type="caret-down" 
                                            className={this.props.isDown ==='down'?'isDown':'' }
                                            onClick={() =>{ 
                                                           
                                                            this.props.tabSort({sortType:'24h',type:'down'})
                                                         }} 
                                    />
                                </span>
                            </th>
                            <th >{intl.get("24H最高价")}</th>
                            <th >{intl.get("24H最低价")}</th>
                            <th className="tab-sort" style={{width:170}}> 
                                <span>{intl.get("24H成交量")}</span>
                                <span className="base-select-arrow">
                                    <Icon 
                                            type="caret-up"
                                            className={this.props.isCountUp ==='countUp'?'isCountUp':'' }
                                            onClick={() =>{this.props.tabSort({sortType:'count',type:'up'})}}  
                                    />
                                    <Icon 
                                            type="caret-down"
                                            className={this.props.isCountDown ==='countDown'?'isCountDown':'' }
                                            onClick={() =>{this.props.tabSort({sortType:'count',type:'down'})}} 
                                    />
                                </span>
                            </th>
                            <th style={{width:160}}>{intl.get("操作")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TrList}
                    </tbody>
                </table>
            )    
      }

    
  }


  export default withRouter(TradeTabs);