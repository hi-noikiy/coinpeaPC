/* 
    关于我们页入口
*/
import React, { Component } from 'react';
import { Tabs } from 'antd';
import { ACTION_IS_ADD_CLASS } from '../layouts/NavRedux';
import { connect } from 'react-redux';
import './SiteContent.scss';
import Artical from '../components/siteContent/Artical';
import { getQueryString } from '../utils'
//api
import { getSite }  from '../api/home';

const TabPane = Tabs.TabPane;

class SiteContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list:[],         
        }
    }
    componentDidMount() {
        //添加导航背景色
        this.props.dispatch(ACTION_IS_ADD_CLASS());
        this.getInfo();
      
    }

    getInfo = async () => {
        const res = await getSite();
        if(res.status === 1) {  
            this.setState({
                list: res.data
            });
            
            console.log(res.data)
        }
     } 

    onChange = (showKey) => {
      
        this.props.history.push('/site?index='+showKey)
    }

  
    render() {
         const showKey = this.props.location.search?getQueryString('index'):0;
         console.log(showKey)
        //关于我们
        const Links = this.state.list.map( (item, index) => { 
            return  <TabPane tab={item.typeName} key={index.toString()}>
                        <Artical typeid={item.id}></Artical>
                    </TabPane>
        }); 
        return (
            <div id="SiteContent">
                <Tabs tabPosition='left' activeKey={showKey}  onChange={this.onChange}>
                  {Links}
                </Tabs>
            </div>
        )
    }   
}
export default connect(
    
)(SiteContent)