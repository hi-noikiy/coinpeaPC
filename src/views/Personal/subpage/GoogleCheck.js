/* 
    谷歌认证页入口
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon,Input,Button ,message } from 'antd';
import { idcardCheck,idcardUnCheck,msgCheck,msgUnCheck,googleCheck,googleUnCheck } from '../../../components/personal/AccountInfoRedux';
import './PersonalTwo.scss';
import './GoogleCheck.scss';
import SubpageHead from '../../../components/shared/SubpageHead';
import play from '../../../assets/07_07.google_play.png';
import apple from '../../../assets/07_07.app_store.png';
import { GoogleChk , GooleAuth } from '../../../api/personal'

import intl from 'react-intl-universal';

const QRCode = require('qrcode.react');


class GoogleCheck extends Component {
    constructor(props){
        super(props);
        this.state = {
            key:'',
            identify:'',
            backLink: '/personal',
            backText: intl.get('返回个人中心'),
            columText: intl.get('谷歌认证'),
            lock:false,
            url:''
        }
    }
    componentDidMount() {
        this.mounted = true;
        this.GooleAuth()
    }

    componentWillUnmount(){
        this.mounted = false;
    }
    
    //点击复制密钥
    copyKey() {
        const input = this.refs.input.input;
        input.select(); 
        document.execCommand("copy");
        message.success(intl.get('复制成功'),1)
    }
    GooleAuth = async()=>{
        const res=await GooleAuth();
        if(res.status===1){
            this.setState({
                key:res.data.secret,
                url:res.data.url
            })
        }
    }


    //修改谷歌验证码
    setIdentify(event){
        this.setState({
            identify: event.target.value
        })
    }
    //绑定提交
    handleSubmit = async ()=>{
        this.setState({lock:true})
        var num = this.state.identify; 
        if(num!==""){
            const res = await GoogleChk({'code':num});
            this.setState({lock:false})
            if( res.status === 1){
                message.success(res.msg,1)
                setTimeout(()=>{
                    this.props.history.push('/personal')
                },1000)
            }else{       
                message.error(res.msg,1)
            }
        }else{
            message.error(intl.get('请填写谷歌验证码'))
            this.setState({lock:false})
        }  
        
    }

    link(url){
        window.window.open(url);    
    }


    render() {      
        return (
            <div id="personalTwo">
                <SubpageHead
                backLink={this.state.backLink}
                backText={this.state.backText}
                columText={this.state.columText}
                />
                <div className="google-check">
                    <p className="google-check-tip">{intl.get('谷歌认证提示')}</p>
                    <div className="googleCheck-steps">
                        <div className="googleCheck-step">
                            <h3><span>1</span>{intl.get('下载谷歌验证器APP')}</h3>
                            <p>{intl.get('ios下载')}</p>
                            <p>{intl.get('and下载')}</p>
                            <Button type="ghost" onClick={()=>this.link('https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8')}><img alt="" src={apple}/><span>App Store</span></Button>
                            <Button type="ghost" onClick={()=>this.link('https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2')}><img alt="" src={play} /><span>Google Play</span></Button>
                        </div>
                        <div className="googleCheck-step">
                            <h3><span>2</span>{intl.get('添加密钥')}</h3>
                            <p>{intl.get('添加密钥2')}</p>
                            <p style={{color:'#FF4B4B'}}>{intl.get('添加密钥3')}</p>
                            <div className="qrcode">
                                <QRCode value={this.state.url} renderAs="svg" size={136} />
                                <p>{intl.get('密钥')}<br/><span className="key">{this.state.key}</span><Input ref="input" value={this.state.key} onChange={e=>null}  /><span className="copy"  onClick={this.copyKey.bind(this)}>{intl.get('复制')}</span></p>
                            </div>
                        </div>
                        <div className="googleCheck-step">
                            <h3><span>3</span>{intl.get('输入谷歌验证码')}</h3>
                            <Input value={this.state.identify}  onChange={this.setIdentify.bind(this)} placeholder={intl.get('请输入Google验证码')} />
                        </div>
                        <Button className=" google-btn" type="primary" disabled={this.state.lock} onClick={this.handleSubmit.bind(this)}>{intl.get('绑定')}</Button>
                    </div>
                </div>
            </div>
        )
    }   


    
    
}


export default GoogleCheck; 