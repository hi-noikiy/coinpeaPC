/* 
    个人中心API内容页
*/

import React, { Component } from 'react';
import { Button,Input,Checkbox,Icon,Radio,message,Tooltip,Modal } from 'antd';
import { connect } from 'react-redux'
import './API.scss';
import cs from 'classnames';
import '../assets/Withdraw.scss';
import { withRouter } from 'react-router-dom';

import intl from 'react-intl-universal';

import success from '../../assets/success.svg';
import fail from '../../assets/fail.svg';
import verify from '../../assets/verify.svg';
import lock from '../../assets/07_10.secret.png';

//api
import { createApi, delectAll, delectOne, mySerect, editSerect, googleStatus, closeGetPhonecode, apiConfig } from '../../api/personal';

const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

const apiKeyOption = [
    { label: intl.get('读取信息'), value: 'read', },
    { label: intl.get('开放交易'), value: 'trade' },
    // { label: intl.get('开放提现'), value: 'withdraw'},
];

export  class API extends Component {
    constructor(props){
        super(props);
        this.state = {
            key: '',
            googleKey:'',
            phoneNum:'',
            secretKeyList:[],
            text:intl.get('获取验证码'),
            timerText:'60s',
            timer:60,
            apiIpNumber: 0,
            apiKeyNumber: 0,
            ipText:'',
            ipErr:'',
            documentLink:''
        }
    }

    componentDidMount(){
        this.getGoogleStatus();
        this.getSerect();
        apiConfig().then(res=>{
            if(res.status === 1){
                this.setState({
                    apiIpNumber:res.data.apiIpNumber,
                    apiKeyNumber:res.data.apiKeyNumber,
                    documentLink:res.data.documentLink
                })
            }else{
                message.error(res.msg);
            }
        })
    }

    //默认验证码弹窗
    getInitialState() {
        return {
          visible: false,
        };
    }

    //展示验证码弹窗
    showModal() {          
        if(!this.state.key){
            message.info(intl.get('请输入API Key备注名'));
            return
        }

        if(this.state.withdrawOpenNote && this.state.withdrawOpenGA){
            this.setState({
                visible2: true
            })   
        } else if(!this.state.withdrawOpenGA && !this.state.noteAuthStatus && this.state.gooleStauts){
            this.setState({
                visible3:true,
                tipText:intl.get('选择认证方式'),
                btnText:intl.get("开启谷歌认证"),
                btnText2:intl.get("短信认证"),
                path:'/personal',
                path2:'/bindphonenum'
            })
        }else if(!this.state.gooleStauts && !this.state.noteAuthStatus){
            this.setState({
                visible3:true,
                tipText:intl.get('选择认证方式'),
                btnText:intl.get("谷歌认证"),
                btnText2:intl.get("短信认证"),
                path:'/googlecheck',
                path2:'/bindphonenum',
            })
        }else if(!this.state.gooleStauts && this.state.noteAuthStatus && !this.state.withdrawOpenNote){
            this.setState({
                visible3:true,
                tipText:intl.get('选择认证方式'),
                btnText:intl.get("谷歌认证"),
                btnText2:intl.get("开启短信认证"),
                path:'/googlecheck',
                path2:'/bindphonenum',
            })
        }else if(this.state.gooleStauts && this.state.noteAuthStatus && !this.state.withdrawOpenNote && !this.state.withdrawOpenGA){
            this.setState({
                visible3:true,
                tipText:intl.get('选择认证方式'),
                btnText:intl.get("开启谷歌认证"),
                btnText2:intl.get("开启短信认证"),

                path:'/personal',
                path2:'/bindphonenum',
            })
        }else if(this.state.withdrawOpenGA){
            this.setState({
                visible:true
            })
        }else if(this.state.withdrawOpenNote){
            this.setState({
                visible1: true
            })
        }
    }

    //谷歌验证状态
    getGoogleStatus = async() =>{
        const res = await googleStatus();
        if(res.status === 1){
            this.setState({
                gooleStauts: res.data.gooleStauts,
                withdrawOpenGA: res.data.withdrawOpenGA,
                noteAuthStatus: res.data.noteAuthStatus,
                withdrawOpenNote: res.data.withdrawOpenNote
            })
        }
    }

    //我的密钥列表
    getSerect = async() => {
        const res = await mySerect();
        if(res.status === 1){
            const data = res.data.map((e,i)=>{
                e.editing = true;
                e.secretShowing = false;
                if(e.examineStatus === 0){
                    e.ico = verify;
                }else if(e.examineStatus === 1){
                    e.ico = success;    
                }else{
                    e.ico = fail;
                }
                return e;
            })
            this.setState({
                secretKeyList:data
            })
        }else{
            message.info(res.msg);
        }
    }

    //删除密钥
    delectALl = async() =>{
        const res = await delectAll();
        if(res.status === 1){
            message.success(res.msg);
            this.getSerect();
        }else{
            message.info(res.msg);
        }
    }

    //删除某个
    deleteOne = async(id) =>{
        const res = await delectOne({id});
        if(res.status === 1){
            const data = this.state.secretKeyList.filter(e=>{
                return e.id !== id
            })
            this.setState({
                secretKeyList:data
            })
        }else{
            message.info(res.msg);
        }
    }


    //验证谷歌验证码添加key
    handleOk = async() =>{
        if(!this.state.googleKey){
            message.info(intl.get('请输入谷歌验证码'));
            return
        }
        //提交操作
        const res = await createApi({gooleCode:this.state.googleKey,remarks:this.state.key});
        if(res.status === 1){
            message.success(res.msg);
            this.getSerect();
            this.setState({ visible: false,key:'',gooleCode:'' });
        }else{
            message.info(res.msg);
            this.setState({ visible: false,key:'',gooleCode:'' });
        }

    }

    //短信验证
    handleOk1 = async() =>{
        if(!this.state.phoneNum){
            message.info(intl.get('phone_msg_tips'));
            return
        }
        //提交操作
        const res = await createApi({noteCode:this.state.phoneNum,remarks:this.state.key});
        if(res.status === 1){
            message.success(res.msg);
            this.getSerect();
            this.setState({ visible2: false,key:'' });
        }else{
            message.info(res.msg);
        }

    }

    //倒计时
    countDown = (validateFields)=> {
    
        if(this.state.timerStart) return;
  
        closeGetPhonecode().then(res => {
            if(res.status === 90021){
                message.success(res.msg)
                this.timer = setInterval(() => {
                    this.setState({
                        timerStart:true,
                    })
                    this.setState((preState) => {
                        return {
                            timer:preState.timer-1,
                            timerText:preState.timer-1 +'s'
                        }
                    }, () => {
                        if(this.state.timer === 0) {
                            clearInterval(this.timer)
                            this.timer = null;
                            this.setState({
                                timer:60,
                                timerStart:false,
                                timerText:'60s'
                            })
                        }
                    })
        
                }, 1000)
            }else{
                message.info(res.msg);
                this.setState({
                    timerStart:false
                })
            }
        })

        
         
    }


    //删除弹窗
    showConfirm(item) {
        if(!this.isSave.call(this)){
            return
        }
        
        const APIKey = item.id === undefined?intl.get('所有')+'API Key':'API Key：'+item.apiKey;
        confirm({
            title: intl.get('提示'),
            content: <p>{intl.get('您确定要永久删除')}<br/>{APIKey}</p>,
            okText:intl.get("确定"),
            cancelText:intl.get("取消"),
            iconType:'n',
            onOk: ()=>{
                item.id?this.deleteOne(item.id):this.delectALl()
            },
            onCancel() {},
        });
    }

    render() {
        const keylist = this.state.secretKeyList.length?this.state.secretKeyList.map( (item,index) => {
            return (
                <div className="key" key={index}>
                    <div className="key-head">
                        <h5>{item.remarks}</h5>
                        <div className="handle">
                            {item.editing?
                            <a className="edit" onClick={this.edit.bind(this,index)}  href="javascript:;">{intl.get('编辑')}</a>:
                            <a className="save" onClick={this.save.bind(this,index)}  href="javascript:;">{intl.get('保存')}</a>
                            }
                            <a className="delete" onClick={this.showConfirm.bind(this,item)} href="javascript:;">{intl.get('删除')}</a>
                        </div>
                    </div>
                    <div className="key-con">
                        <div className="key-con-info clear">
                            <div className="lock"><img src={item.ico} alt="" /></div>
                            <div className="key-con-info-data">
                                <h6>API Key:</h6>
                                <p>{item.apiKey}</p>
                                <h6>Secret Key: <Tooltip placement="top" title={intl.get('key提示')}><Icon style={{color:'#49CCFF'}} type="exclamation-circle" /></Tooltip></h6>
                                <p><a href="javascript:;" onClick={this.secretShow.bind(this,index,item.secretShowing)}>{item.secretShowing?intl.get('隐藏'):intl.get('展示')}</a><span className={item.secretShowing?'':'hide'}>{item.secretKey}</span></p>
                                <h6>{intl.get('选项')}: </h6>
                                <CheckboxGroup disabled={item.editing} options={apiKeyOption} defaultValue={[item.recharge?'read':null,item.trade?'trade':null,item.withdraw?'withdraw':null]} onChange={checkedValues=>this.onChange(checkedValues,index)} />{/*<Tooltip placement="top" title={intl.get('建议')}><Icon style={{color:'#49CCFF'}} type="exclamation-circle" /></Tooltip>*/}
                            </div>
                        </div>
                        <div className="limit clear">
                            <h5>{intl.get('限制head')}</h5>
                            <div className="radio">
                                <RadioGroup onChange={this.changeLimit.bind(this,index)} disabled={item.editing} defaultValue={item.ipRole?'limit':'nolimit'}>
                                    <Radio value="limit">{intl.get('限制Ip')}</Radio>
                                    <Radio value="nolimit">{intl.get('不限制Ip')}</Radio>
                                </RadioGroup>
                                {item.ipRole?
                                <div className="radio-con">
                                    <p>{intl.get('您当前IP为')} {item.nowIp} </p>
                                    <p>{intl.get('可信IP：')}</p>
                                    <p className={this.state.ipErr?'has-error':''}><Input disabled={item.editing} placeholder="0.0.0.0" value={item.ipValue} onChange={e=>this.limitIp(e,index)} /></p>
                                    <p style={{color:this.state.ipErr?'#f5222d':'#000'}}>{this.state.ipText}</p>
                                    <p>{intl.get('如果输入多个IP，请使用逗号分隔。')}</p>
                                </div>:    
                                <p className="tip">{intl.get('建议您添加可信的IP地址访问API Key')}</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
        }):<div style={{height:'60px',lineHeight:'60px',textAlign:'center'}}>{intl.get("暂无数据")}</div>

        return (
            <div className="api">
                <div className="api-top clear">
                    <div className="api-top-left">
                        <h4>{intl.get('备注')}</h4>
                        <Input placeholder={intl.get('请输入API key备注名')} maxLength={20} value={this.state.key} onChange={e=>this.setState({ key:e.target.value })} />
                        <Button type='primary' onClick={this.showModal.bind(this)} style={{ backgroundColor:'#3dadd9'}}>{intl.get('创建新key')}</Button>
                        <Modal
                            visible={this.state.visible}
                            closable={false}
                            onOk={()=>this.handleOk()}
                            onCancel={()=>this.setState({ visible:false })}
                            okText={intl.get("确定")}
                            cancelText={intl.get("取消")}
                            wrapClassName="selectCheck"
                        >
                            <h5>{intl.get('谷歌验证')}</h5>
                            <Input  placeholder={intl.get("输入谷歌验证码")} maxLength="6"  value={this.state.googleKey} onChange={e=>this.changeVal('googleKey',e)} />
                        </Modal>
                        <Modal
                            visible={this.state.visible1}
                            closable={false}
                            onOk={()=>this.handleOk1()}
                            onCancel={()=>this.setState({ visible1:false })}
                            okText={intl.get("确定")}
                            cancelText={intl.get("取消")}
                            wrapClassName="selectCheck"
                        >
                            <h5>{intl.get('短信验证')}</h5>
                            <Input className="phoneNum" maxLength="6" placeholder={intl.get('请输入短信验证码')} value={this.state.phoneNum} onChange={e=>this.changeVal('phoneNum',e)} />
                            <Button 
                                className={cs("getCode", {'coutDown': this.state.timerStart})}
                                onClick={() =>this.countDown()}
                            >
                                {this.state.timerStart?this.state.timerText:this.state.text}
                            </Button>
                        </Modal>
                        <Modal
                            visible={this.state.visible2}
                            closable={false}
                            onOk={()=>this.setState({ visible1: true,visible2:false })}
                            onCancel={()=>this.setState({ visible: true,visible2:false })}
                            okText={intl.get('短信验证')}
                            cancelText={intl.get('谷歌验证')}
                            className="selectCheck select"
                        >
                            <h5>{intl.get('选择验证方式')}</h5>
                            <p style={{color:'#FF4B4B'}}>{intl.get("提现验证")}</p>
                        </Modal>
                        {/*<Modal
                            visible={this.state.visible3}
                            closable={false}
                            onOk={()=>this.props.history.push(this.state.path)}
                            onCancel={()=>this.props.history.push(this.state.path2)}
                            okText={this.state.btnText}
                            cancelText={this.state.btnText2}
                            wrapClassName="selectCheck"
                        >
                            <h5>{this.state.tipText}</h5>
                            <p style={{color:'#FF4B4B'}}>{intl.get("提现验证")}</p>
                        </Modal>*/}
                        <Modal
                            visible={this.state.visible3}
                            closable={false}
                            onOk={()=>this.props.history.push(this.state.path)}
                            onCancel={()=>this.setState({ visible3:false })}
                            okText={this.state.btnText}
                            cancelText={intl.get("取消")}
                            wrapClassName="selectCheck"
                        >
                            <h5>{intl.get('谷歌验证')}</h5>
                            <p style={{color:'#FF4B4B'}}>{intl.get("提现验证")}</p>
                        </Modal>
                    </div>
                    <div className="api-top-right">
                        <h4>{intl.get('提示')}</h4>
                        <p>• 	{intl.get('api提示1')}<a href={this.state.documentLink}>{intl.get('API DOC')}</a>{intl.get('api提示1-1')}</p>
                        <p>•    {intl.get('api提示2')}{intl.get('api提示2-1')}</p>
                        {/*<p>• 	{intl.get('api提示2')}{this.state.apiKeyNumber}{intl.get('api提示2-1')}</p>*/}
                        <p>•    <span>{intl.get('不要泄露')}</span>{intl.get('api提示3')}{intl.get('api提示3-1')}</p>
                        {/*<p>• 	<span>{intl.get('不要泄露')}</span>{intl.get('api提示3')}{this.state.apiIpNumber}{intl.get('api提示3-1')}</p>*/}
                    </div>
                </div>
                <div className="api-bottom">
                    <div className="api-bottom-head clear"><h4>{intl.get('我的密钥')}</h4><a href="javascript:;" disabled={this.state.secretKeyList.length?'':'true'} onClick={this.showConfirm.bind(this)}>{intl.get('删除全部API')}</a></div>
                    { keylist }
                </div>
                <div className="mask"></div>
            </div>
            
        )
    }


    //展示隐藏密钥
    secretShow(num,isShow){
        const arr = this.state.secretKeyList.map((item,index)=>{
            if(index === num){
                item.secretShowing = !isShow;
            }
            return item
        });
        this.setState({
            secretKeyList:arr
        })
    }

    //验证码输入验证
    changeVal(key,e){
        const value = e.target.value;
        const reg = /^[0-9]{0,6}$/;
        if(!reg.test(value)) return;
        this.setState({ [key]:value })

    }



    //添加limitIP
    limitIp(event,num){
        
        let reg = /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/;
        let ip,ipInput = event.target.value;
        if(ipInput.indexOf(',')>0){
            ip = ipInput.split(',');
        }else if(ipInput.indexOf('，')>0){
            ip = ipInput.split('，')
        }else{
            ip = [ipInput];
        }

        for(let i in ip){
            console.log(ip[i])
            if(!reg.test(ip[i])){
                this.setState({ ipText: intl.get('ip输入不合法'),ipErr: true });
            }else{
                this.setState({ ipText:'',ipErr:false });
            }
        }

        const arr = this.state.secretKeyList.map((item,index)=>{
            if(index === num){
                item.ipValue = ipInput;
            }
            return item
        });
        this.setState({
            secretKeyList:arr
        })
    }

    //save
    save = async(num) =>{
        const data = {};
        this.state.secretKeyList.forEach((item,index)=>{
            if(index === num){
                data.id = item.id;
                data.ipRole = item.ipRole;
                data.ipValue = item.ipValue;
                data.recharge = item.recharge;
                data.trade = item.trade;
                data.withdraw = item.withdraw;
            }
        });
        const res = await editSerect(data);
        if(res.status === 1){
            message.success(res.msg);
            this.getSerect();  
        }else{
            message.info(res.msg);
        }
    }

    //是否有未保存
    isSave(){
        const edit = this.state.secretKeyList.some( item => {
            return item.editing === false
        } )
        if(edit){
            message.info(intl.get('请先保存正在编辑的密钥'));
            return false
        }
        return true
    }

    //edit
    edit(num){
        if(!this.isSave.call(this)){
            return
        }
        const arr = this.state.secretKeyList.map((item,index)=>{
            if(index === num){
                item.editing = false;
            }
            return item
        });
        this.setState({
            secretKeyList:arr
        });    
    }


    //limit切换
    changeLimit(num,event){
        console.log(num,event)
        const arr = this.state.secretKeyList.map((item,index)=>{
            if(index === num){
                item.ipRole = event.target.value==='limit'?1:0;
            }
            return item
        });
        this.setState({
            secretKeyList:arr          
        })
    }

    onChange(checkedValues,num){
        const str = checkedValues.join('');
        const arr = this.state.secretKeyList.map((item,index)=>{
            if(index === num){
                item.recharge = str.indexOf('read')===-1?0:1;
                item.trade = str.indexOf('trade')===-1?0:1;
                item.withdraw = str.indexOf('withdraw')===-1?0:1;
            }
            return item
        });
        this.setState({
            secretKeyList:arr          
        })
    }

}


const mapStatetoProps = (state)=>{
    return {
        acccount: state.personal.account,
    }
}

const actionCreators = {}

export default withRouter(connect(
    mapStatetoProps,
    actionCreators
)(API));