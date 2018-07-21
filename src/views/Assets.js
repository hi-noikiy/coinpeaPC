/* 
    个人中心页入口
*/
import React, { Component } from 'react';
import { message, Modal } from 'antd';
import { connect } from 'react-redux';

import intl from 'react-intl-universal';

//自定义组件

import TabHead from '../components/shared/TabHead'
import Funds from '../components/assets/Funds';
import Recharge from '../components/assets/Recharge';
import Withdraw from '../components/assets/Withdraw';
import Distribution from '../components/assets/Distribution'



//action
import { ACTION_IS_ADD_CLASS } from '../layouts/NavRedux';
import {  setActiveCoinId } from '../components/assets/GetallCoinRedux';

//css
import './Assets.scss';
import { Record } from 'immutable';

//api
import { authentication} from '../api/funds';

class Assets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadText: [intl.get('资金'),intl.get('充值'),intl.get('提币'),intl.get('分发记录')],
            columText:intl.get('资产管理'),
            activeIndex: 0,
            activeCoin:'',
            visible: false,
        }
    }
    componentDidMount() {
        //添加导航背景色
        this.props.dispatch(ACTION_IS_ADD_CLASS());
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    showModal = () => {
        this.setState({
          visible: true,
        });
      }
    
    handleOk = () => {
        this.setState({
            visible: false,
          });
          this.props.history.push('/personal?certification');
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }


    render() {
     
        let personalCon;

        if(this.state.activeIndex === 0){
            personalCon = <Funds changeTab={this.changeTab.bind(this)}  />
        }else if(this.state.activeIndex === 1){
            personalCon = <Recharge   activeCoin={this.state.activeCoin}  />
        }else if(this.state.activeIndex === 2){
            personalCon = <Withdraw />
        }else{
            personalCon = <Distribution />
        }

       
        return (
            <div id="assets">
                <TabHead
                    breadText={this.state.breadText} 
                    columText={this.state.columText}
                    activeIndex={this.state.activeIndex}
                    changeTab={this.changeTab.bind(this)}
                />
                <div className="personalCon">
                    {personalCon}
                </div>
                {/*  */}
                <Modal
                    width="500px"
                    className="asset-modal"
                    visible={this.state.visible}
                    title={null}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                   
                    footer={null}
                    >
                        <p>{intl.get('请先进行实名认证')}</p>
                        <div className="goto" onClick={this.handleOk}>{intl.get('现在就认证')}</div>
                        
                </Modal>
            </div>
        )
    }
    
    //切换面包屑导航
    changeTab(index,coinid, coinName, status, count, freeze, useable, icon) {
        
        //提币时请求身份验证
        if(index === 2) {
            authentication().then(res => {
               if(res.data.identifiStatus === 0 || res.data.identifiStatus === 2 ) {
                  
                        this.showModal();
                        return;
                        
               } else if(res.data.identifiStatus === 3){

                    message.info(intl.get('身份认证审核中'));
                    
               } else if(res.data.identifiStatus === 1){
                        if(!this.props.Funds || !this.props.Funds.data.length && !this.props.Funds.srcData.length ) return ;
                        const Funds = this.props.Funds.data[0] || this.props.Funds.srcData[0];
                        const _id = Funds.coinBasicInfoDo.id ? Funds.coinBasicInfoDo.id:1;
                        const _name  = Funds.coinBasicInfoDo.sortName? Funds.coinBasicInfoDo.sortName:'BTC';
                        const id = coinid ? coinid : _id,
                            name = coinName?coinName: _name;
                    
                        const _icon = icon ? icon:Funds.coinBasicInfoDo.icoinUrl;
                        const [count1, freeze1, useable1] = [count?count: Funds.total, freeze?freeze:Funds.frozen_fmt, useable?useable:Funds.total_fmt] 
                
                        const text = index === 1 ? intl.get('充值'):intl.get('提现');
                        if(status === 0) return message.warning(`${intl.get('该币种暂时不允许')} ${text}`); 
                        this.props.dispatch(setActiveCoinId(id, name,  count1, freeze1, useable1, _icon));
                
                        this.setState({
                            activeIndex: index,
                            activeCoin: coinName       
                        }) 
               } else {
                   message.info(res.msg)
               }
            })
        } else {
            if(!this.props.Funds || !this.props.Funds.data.length && !this.props.Funds.srcData.length ) return ;
                const Funds = this.props.Funds.data[0] || this.props.Funds.srcData[0];
                const _id = Funds.coinBasicInfoDo.id ? Funds.coinBasicInfoDo.id:1;
                const _name  = Funds.coinBasicInfoDo.sortName? Funds.coinBasicInfoDo.sortName:'BTC';
                const id = coinid ? coinid : _id,
                    name = coinName?coinName: _name;
            
                const _icon = icon ? icon:Funds.coinBasicInfoDo.icoinUrl;
                const [count1, freeze1, useable1] = [count?count: Funds.total, freeze?freeze:Funds.frozen_fmt, useable?useable:Funds.total_fmt] 
        
                const text = index === 1 ? intl.get('充值'):intl.get('提现');
                if(status === 0) return message.warning(`${intl.get('该币种暂时不允许')} ${text}`); 
                this.props.dispatch(setActiveCoinId(id, name,  count1, freeze1, useable1, _icon));
        
                this.setState({
                    activeIndex: index,
                    activeCoin: coinName       
                }) 
            }
        }

       
}





export default connect((state) => {return { Funds:state.assets.Funds}})(Assets);