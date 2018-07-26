/* 
    个人中心页入口
*/
import React, { Component } from 'react';
import AccountInfo from '../../components/personal/AccountInfo';
import AccountCheck from './subpage/AccountCheck';
import API from './../../components/personal/API';
import { ACTION_IS_ADD_CLASS } from '../../layouts/NavRedux';
import { connect } from 'react-redux';
import TabHead from '../../components/shared/TabHead';

import intl from 'react-intl-universal';

import './Personal.scss';

class Personal extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            breadText: [intl.get('个人中心'), intl.get('身份认证'),'API'],
            columText:intl.get('个人中心'),
            showComponent:[<AccountInfo history={this.props.history}/>,<AccountCheck />,<API />],
           
        }

      
    }

    componentDidMount() {
        //添加导航背景色
        this.props.dispatch(ACTION_IS_ADD_CLASS());
        
    }
    
    componentWillUnmount(){
        this.mounted = false;
    }
   
    
    render() {
   
        const searchKey = this.props.history.location.search;
     
        let showKey = 0;
        if(searchKey === ("?certification")) {
            showKey = 1;
        
        } else if (searchKey === ("?api")) {
            showKey = 2;
        } else {
            showKey = 0;
        }
      
        return (
            <div id="personal">
                <TabHead 
                    breadText={this.state.breadText} 
                    columText={this.state.columText}
                    activeIndex={showKey}
                    changeTab={this.changeTab.bind(this)}
                
                />
                <div className="personal-con">
                    {this.state.showComponent[showKey]}
                </div>
            </div>
        )
    }
    //切换面包屑导航
    changeTab(index) {
       
        let search;
        switch(index) {
            case 1:
          
                search = 'certification';
                break;
            case 2:
                search = 'api';
                break;
            default:
          
             search = '';
             break;
            
        }
      
        this.props.history.push('/personal?'+search);
    }
}
export default connect(
)(Personal)