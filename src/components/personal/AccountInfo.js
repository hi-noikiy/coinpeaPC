/* 
    账户信息内容页
*/
import React, { Component } from 'react';
import {Avatar,Table,Icon , Switch  } from 'antd';
import { Link } from 'react-router-dom';
import './AccountInfo.scss';
import { connect } from 'react-redux';
import moment from 'moment';
import { userInfo , unBondNote ,OpenPhone,
    } from '../../api/personal'
import { msgUnCheck , googleCheck , msgCheck , idcardCheck , idcardUnCheck , idcardFailCheck , idcardChecking,
     } from './AccountInfoRedux'
import { message } from 'antd';

import intl from 'react-intl-universal';

const pIncon1 = require('../../assets/07_01.icon01.png');
const pIncon2 = require('../../assets/07_01.icon02.png');
const pIncon3 = require('../../assets/07_01.icon03.png');
const pIncon4 = require('../../assets/07_01.icon04.png');
const idcardPic1 = require('../../assets/07_01.notice.png');
const idcardPic2 = require('../../assets/07_01.notice2.png');
const idcardPic3 = require('../../assets/07_01.notice3.png');

//表格栏目
const columns = [{
    key:'createTime',
    className:'one',
    title: intl.get('登录时间'),
    dataIndex: 'createTime',  
    width:'1'
}, {
    key:'loginWay',
    className:'two',
    title: intl.get('登录方式'),
    dataIndex: 'loginWay',
    width:'1',
}, {
    key:'ip',
    className:'three',
    dataIndex: 'ip',
    title: intl.get('IP地址'),
    width: '1',
}];
class AccountInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data:[],
            email:'',
            id:'',
            ip:'',
            idcardPic:'',
            prevtime:'',
            phone:'',
            openGoogle:false,
            openPhone:false
        }
    }
    componentDidMount() {      
        this.getUserInfo() 
    }
    componentWillUnmount() {
        
    }
    //获取个人信息
    getUserInfo = async ()=> {
        const res= await userInfo();
        if(res.status === 1){
            this.setState({
                email: res.data.userInfo.email,
                id: res.data.userInfo.no,
                ip: res.data.userInfo.ip,
                prevtime:res.data.userInfo.lastUpdate,
                data:res.data.logs,
                phone:res.data.userInfo.phone,
                openGoogle:res.data.userInfo.userMemberExtendDo.withdrawOpenGA,
                openPhone:res.data.userInfo.userMemberExtendDo.withdrawOpenNote
            }) 
           
             if(res.data.userInfo.userMemberExtendDo.gooleStauts){//谷歌认证状态 0未绑定 1已绑定
                this.props.googleCheck()
            }
            
            if(res.data.userInfo.identifiStatus === 0){ // 身份认证 0未认证 1认证成功 2认证失败 3认证中
                this.props.idcardUnCheck()
                this.setState({
                    idcardPic:idcardPic1
                })
            }else if(res.data.userInfo.identifiStatus === 1){
                this.props.idcardCheck()
                this.setState({
                    idcardPic:idcardPic3
                })
            }else if(res.data.userInfo.identifiStatus === 2){
                this.props.idcardFailCheck()
                this.setState({
                    idcardPic:idcardPic1
                })
            }else if(res.data.userInfo.identifiStatus === 3){
                this.props.idcardChecking()
                this.setState({
                    idcardPic:idcardPic2
                })
            }
            if(res.data.userInfo.userMemberExtendDo.noteAuthStatus){//短信认证状态0未认证 1已认证
                this.props.msgCheck();
            }
        }
    }

    unbind(){
        unBondNote({'phone':this.state.phone}).then(data=>{
            message.success(data.msg);
            if(data.status === 1){
                this.props.msgUnCheck();
            }   
        })
    }

    //关闭或者开启短信验证
    changePhoneState = (obj) => {
       
        if(obj.hasOwnProperty('type')) {
            
            OpenPhone({type:obj.type}).then(res =>{

                    message.info(res.msg)

                    if(res.status === 1) {
                        obj.type === 1 && this.setState({
                            openPhone:true,
                        })

                        obj.type === 0 && this.setState({
                            openGoogle:true,
                        })
                    }
                })
           
        } else {
              
            this.props.history.push(`/${obj['redirect']}`)
        }
    }
    
    render() {  
        const loginNote = this.state.data.map( (item,index)=>{// 0app 1wap 2pc
            let terminalType;
            if(item.terminalType === 0){
                terminalType='app'
            }else if(item.terminalType === 1){ 
                terminalType='wap'
            }else if(item.terminalType === 2){ 
                terminalType='pc'
            }
            return {
                key:index,
                createTime: moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
                loginWay: terminalType,
                ip: item.ip
            }
        })
        let userMessage;
        if (this.props.acccount.idcardCheck === 0) {
            userMessage = (
                <p><Icon type="warning" style={{ fontSize:16,color:'#FF4B4B' }} /><span style={{color:'#8A8A8A'}}>{intl.get('未认证')}</span><Link  to="/accountcheck">{intl.get('认证')}</Link></p>
            
            )
          } else if(this.props.acccount.idcardCheck === 1){
            userMessage = (
                <p></p>
               /*  <p><Icon type="check" style={{ fontSize:16,color:'#78A429' }} /><span>{intl.get('已认证')}</span><a href="javascript:;"></a></p> */
            )
          } else if(this.props.acccount.idcardCheck === 2){
            userMessage = (
                <p>
                    <Icon type="warning" style={{ fontSize:16,color:'#FF4B4B' }} /><span style={{color:'#8A8A8A'}}>{intl.get('认证失败')}</span>
                    <Link  to="/accountcheck">{intl.get('认证')}</Link>
                </p>
            )
          } else if(this.props.acccount.idcardCheck === 3){
            userMessage = (
                <p><i style={{background:'url('+idcardPic2+ ') no-repeat' }} className="iconIdCard"></i><span style={{color:'#8A8A8A'}}>{intl.get('认证中')}</span></p>
            )
          }

         
        return (
                <div className="account">
                    <div className="info clear">
                        <div className="info_l"> <img src={require('./../../assets/01_02.portrait02.svg')} alt='' width="40" height="40" style={{marginRight:'8px'}}/></div>
                        <div className="info_r">
                            <h5>
                                {this.state.email}
                               {/*  <span style={{background:'url('+this.state.idcardPic+ ') no-repeat 5px rgba(73,204,255,.12)' }}>
                                    {this.props.acccount.idcardType}
                                </span> */}
                            </h5>
                            <span>ID：{this.state.id}</span>
                            <div className="switch" style={{display:'none'}}>{intl.get('BNB')}<span>{intl.get('折扣')}</span> <Switch defaultChecked size="small"/></div>                          
                        </div>
                    </div>
                    <div className="personalTable">
                        <div className="personTitle">
                            <h3>{intl.get('安全设置')}</h3>
                            <p><span>{intl.get('上次登录时间')}：{moment(this.state.prevtime).format('YYYY-MM-DD HH:mm:ss')}</span> IP：{this.state.ip}</p>
                        </div>
                        <ul className="safeSet">
                           <li className="clear">
                                <p>
                                    <img alt="" src={pIncon1} />
                                    <span>{intl.get('登录密码')}</span>
                                </p>
                                <p>
                                    <span></span>
                                    <Link to="/changepassword" >{intl.get('修改')}</Link>
                                </p>
                            </li>
                           {/*<li className="clear"><p><img alt="" src={pIncon2} /><span>{intl.get('身份认证')}</span></p>
                                { userMessage }
                            </li>*/}
                            <li className="clear">
                                <p>
                                    <span className="clearPic">
                                        <img src={pIncon3} alt="" />
                                    </span>
                                    <span>
                                        {intl.get('短信认证')}
                                    </span>
                                </p>
                                {
                                    this.props.acccount.msgCheck?
                                    <p>
                                        {/* <Icon type="check" style={{ fontSize:16,color:'#78A429' }} />
                                        <span>{intl.get('已绑定')}</span> 
                                        <a href="javascript:;" onClick={() =>this.changePhoneState({redirect:'updatePhone'})}>{intl.get('修改')}</a> */}
                                        {
                                            this.state.openPhone ? <a 
                                                                        href="javascript:;" 
                                                                        onClick={() => this.changePhoneState({redirect:'closePhone'})}>
                                                                            {intl.get('关闭')}
                                                                    </a>:
                                            <a href="javascript:;" onClick={() => this.changePhoneState({'type':1})}>{intl.get('开启')}</a>
                                        }
                                       
                                    </p>:
                                    <p>
                                        <Icon type="warning" style={{ fontSize:16,color:'#FF4B4B' }} />
                                        <span style={{color:'#8A8A8A'}}>{intl.get('未绑定')}</span>
                                        <Link to="/bindphonenum">{intl.get('绑定')}</Link>
                                    </p>
                                }
                            </li>
                            <li className="clear"><p><span className="clearPic"><img alt="" src={pIncon4} /></span><span>{intl.get('谷歌认证')}</span></p>
                                {
                                    this.props.acccount.googleCheck?
                                    <p>
                                       {/*  <Icon type="check" style={{ fontSize:16,color:'#78A429' }} />
                                        <span>{intl.get('已认证')}</span><a href="javascript:;"></a> */}
                                        {
                                            this.state.openGoogle ? <a href="javascript:;" onClick={() =>this.changePhoneState({redirect:'closeGoogle'})}>{intl.get('关闭')}</a>:
                                            <a href="javascript:;" onClick={() => this.changePhoneState({'type':0})}>{intl.get('开启')}</a>
                                        }
                                      
                                    </p>:
                                    <p>
                                        <Icon type="warning" style={{ fontSize:16,color:'#FF4B4B' }} />
                                        <span style={{color:'#8A8A8A'}}>{intl.get('未认证')}</span>
                                        <Link  to="/googlecheck">{intl.get('认证')}</Link>
                                    </p>
                                }
                           </li>
                        </ul>
                        <h3 className="noteTitle">{intl.get('登录日志')}</h3>
                        <div className="note">
                             <Table columns={columns} pagination={false} dataSource={loginNote} size="middle" locale={{emptyText: intl.get('暂无数据') }} /> 
                        </div>
                    </div>
                </div>
        )
    }
}

const mapStatetoProps = (state)=>{
    return {
        acccount: state.personal.account,
    }
}

const actionCreators = { msgUnCheck ,googleCheck , msgCheck , idcardCheck , idcardUnCheck , idcardFailCheck , idcardChecking}

export default connect(
    mapStatetoProps,
    actionCreators
)(AccountInfo);
