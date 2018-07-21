/* 
    币种介绍
*/

import React from 'react';
import { Tabs } from 'antd';
import './Coin.scss';
import './SiteContent.scss';
import {withRouter} from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';
import { coinlist , coinContent} from '../api/coin'
import qs from 'querystring'
import ArticalTwo from '../components/siteContent/ArticalTwo';
import intl from 'react-intl-universal';


const TabPane = Tabs.TabPane;

class Coin extends  React.Component {

    state = {
        List:[],
        name:'',
        content:'',
        index:0
    }
    redirect = (path) => {
        this.props.history.push(path);
    }


    onChange = (showKey) => {
        this.props.history.push('/coin?symbol='+showKey)
        this.state.List.forEach( (item) => {
            if(item.sortName === showKey ) this.setState({ name:item.chineseName+'('+item.englishName+')' })
        })
    }


    componentDidMount(){
        this.coinlist();
    }
    
    coinlist = async () => {
        const res= await coinlist();
        if(res.status === 1){
            if(window.location.search===''){
                this.setState({
                    name:res.data[0].chineseName+'('+res.data[0].englishName+')',
                })
            }else{
                const search = qs.parse(window.location.search);
                res.data.forEach((item,index)=>{
                    if( search['?symbol']===item.sortName){
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


    render(){

        const search = qs.parse(window.location.search)['?symbol'];
        const showKey = search?search:'BTC';
        //关于我们
        const Links = this.state.List.map( (item, index) => { 
         
            return  <TabPane tab={`${item.chineseName}(${item.englishName})`} key={item.sortName.toString()}>
                        <ArticalTwo typeid={item.id}></ArticalTwo>
                    </TabPane>
        });
        
        return(
            <div id="SiteContent">
                <Tabs tabPosition='left' activeKey={showKey.toString()} key={showKey} onChange={this.onChange}>
                {Links}
                </Tabs>
            </div>
        )
    }
}

export default withRouter(Coin);