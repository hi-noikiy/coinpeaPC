/* 
    币种介绍
*/

import React from 'react';
import './Coin.scss';
import {withRouter} from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';
import { coinlist , coinContent} from '../api/coin'
import qs from 'querystring'
class Coin2 extends  React.Component {

    state = {
        List:[],
        name:'',
        content:'',
        index:0
    }
    redirect = (path) => {
        this.props.history.push(path);
    }

    //左侧 币 点击事件
    coinClickHandle = (sortName,id,chineseName,englishName,index) => {
        this.coinContent(id)
        this.setState({
            name:chineseName+'('+englishName+')',
            index:index
        })
        this.props.history.push(`/coin?symbol=${sortName}`)
    }
    componentDidMount(){
        this.coinlist();
    }
    coinlist = async () => {
        const res= await coinlist();
        if(res.status === 1){
            if(window.location.search===''){
                this.coinContent(res.data[0].id);
                this.setState({
                    name:res.data[0].chineseName+'('+res.data[0].englishName+')',
                })

            }else{
                const search = qs.parse(window.location.search);
                res.data.forEach((item,index)=>{
                    if( search['?symbol']===item.sortName){
                        this.coinContent(item.id);
                        this.setState({
                            name:item.chineseName+'('+item.englishName+')',
                            index:index
                        })
                    }

                })
            }
            this.setState({
                List:res.data, 
            })
        }
    }
    coinContent= async (id)=>{
        const res= await coinContent({'coinId':id});
        if(res.status === 1){
            this.setState({
                content:res.data.content
            })
        }

    }

    render(){
        const list = this.state.List.map( (item, index) => {
            return (
                <li
                    className={index===this.state.index?'avtive_li':''}
                    key={item.id} 
                    onClick={()=>{this.coinClickHandle(item.sortName,item.id,item.chineseName,item.englishName,index)}}>
                    ● {item.chineseName}({item.englishName})
                </li>
            )
        })
        return(
            <div className="coin-wrap">
                <div className="coin-top">
                    <h3 onClick={() => {this.redirect('/trade')}}>交易</h3>
                    <p>币种介绍--{this.state.name}</p>
                </div>
                <div className="coin-content">
                    <div className="coin-content-left">
                    <Scrollbars 
                            style={{ width: 250, height: 628, }}
                            renderThumbVertical={({ style, ...props }) =>
                            <div {...props} style={{ ...style, borderRadius:8,backgroundColor:'#E5E5E5', width: '4px', }}/>
                         }
                    >
                    <ul className="coin-list">{list}</ul>
                    </Scrollbars>
                    </div>
                    <div className="coin-content-right">
                        <Scrollbars 
                                style={{ width: 845, height: 586, }}
                                renderThumbVertical={({ style, ...props }) =>
                                <div {...props} style={{ ...style, borderRadius:8,backgroundColor:'#E5E5E5', width: '4px', }}/>
                            }
                        >  
                            <div dangerouslySetInnerHTML={{__html:this.state.content}}></div>
                        </Scrollbars>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Coin);