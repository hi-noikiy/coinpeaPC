import React from 'react';
import { Form, Input, Button , Modal , message, Tabs  } from 'antd';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FETCH_LOGIN_ACTIONS , UN_VISIABLE_ACTION, EMIT_SAVE_LOGIN } from './LoginRedux'
import { _LocalStorage } from '../utils';
import intl from 'react-intl-universal';
import cs from 'classnames';
import qs from 'querystring';

//api
import { sendEmail, aginValid, aginPhone } from '../api/regist'
import { validate} from '../api/home';

//scss
import './Register.scss';
import './AginValid.scss';

//变量
const TabPane = Tabs.TabPane;

class AginValid extends React.PureComponent {

  constructor(props) {
        super(props);
        const search = qs.parse(this.props.history.location.search.slice(1));
        if(Object.keys(search).length < 1) {
           if(this.props.login.loginState)  this.props.history.replace('/');
           else  this.props.history.replace('/login');
        }
      
        this.state = {
            bool:false,
            title:this.createTitle(search.type),
            confirmDirty: false,
            visible:false,
            google:'',
            phone:'',
            err:'',
            errText:intl.get('请输入6位的谷歌验证码'),
            timerStart:false,
            timerText:'',
            phoneNumber:'',
            timer:60,
            text:intl.get('获取验证码'),
            token:search.token,
            validType:'1',
            activeKey:'1'
        }
  }

  componentDidMount() {  
        const ls = new _LocalStorage();
        validate().then(res => {
            ls.set('rate', res.data);
        });
        
      
  }

  
  sendEmail = async()=>{//再次发送邮xiang
    
    let email=this.state.email;
    const res = await sendEmail({"userName":email});
    message.success(res.msg,1)
  }
  visiable = () => {
    this.props.visible()

  }
  
  //生成标题
  createTitle = (type) => {
      switch (type) {
          case "1":
          return  intl.get('谷歌二次验证');

          case "2":
          return intl.get('短信二次验证');

          default:
          return intl.get('二次验证_1')
      }
  }

  countDown = (validateFields)=> {
    
      if(this.state.timerStart) return;
        this.setState({
            timerStart:true,
        })

        aginPhone({userId: this.props.login.id}).then(res => {
            message.info(res.msg)
        })
            this.timer = setInterval(() => {
                
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
       
    }


    //inp change handle
    onChange = (e,type) => {
    
        if(type === 'google') {
            if(e.target.value && e.target.value.length !== 6) {
                this.setState({
                    err:true,
                    errText:intl.get('请输入长度为6位的谷歌验证码')
                })
            }  else if(e.target.value === '') {
              
                this.setState({
                    err:true,
                    errText:intl.get('请输入谷歌验证码')
                })
            } else {
                this.setState({
                    err:false,
                    errText:'',
                })
            }
        } 

        else {
           
            if(e.target.value === '') {
                this.setState({
                    phoneErr:true,
                    phoneErrText:intl.get('请输入短信验证码')
                })
            } else {
                this.setState({
                    phoneErr:false,
                    phoneErrText:''
                })
            }
        }

        this.setState({
            [type]:e.target.value 
        })
    }

    //提交表但
    submitForm = () =>{
       
        //谷歌验证
        if(this.state.validType === "1") {
            if(!this.state.google) {
              return  this.setState({
                    err:true,
                    errText:intl.get('请输入谷歌验证码')
                })
            }

            if(this.state.err && this.state.google) {
                return  this.setState({
                    err:true,
                    errText:intl.get('请输入长度为6位的谷歌验证码')
                })
            }
            aginValid({
                gaCode:this.state.google,
                token:this.state.token,
                id:this.props.login.id,
                validateType:this.state.validType
            }).then(res => {
                message.info(res.msg);
                this.props.emitSaveLogin(res)
            })

        } else if(this.state.validType === "2") {
            if(!this.state.phone) {
                return  this.setState({
                      phoneErr:true,
                      phoneErrText:intl.get('请输入短信验证码')
                  })
              }
  
              if(this.state.phoneErr && this.state.phone) {
                  return  this.setState({
                        phoneErr:true,
                        errText:intl.get('请输入短信验证码')
                  })
              }

            aginValid({
                gaCode:this.state.phone,
                token:this.state.token,
                id:this.props.login.id,
                validateType:this.state.validType
            }).then(res => {
                message.info(res.msg);
                this.props.emitSaveLogin(res)
            })
        } else {
            if(this.state.activeKey === '1') {
                if(!this.state.google) {
                    return  this.setState({
                          err:true,
                          errText:intl.get('请输入谷歌验证码')
                      })
                  }
      
                  if(this.state.err && this.state.google) {
                      return  this.setState({
                          err:true,
                          errText:intl.get('请输入长度为6位的谷歌验证码')
                      })
                  }

                aginValid({
                    gaCode:this.state.google,
                    token:this.state.token,
                    id:this.props.login.id,
                    validateType:'1'
                }).then(res => {
                    message.info(res.msg);
                    this.props.emitSaveLogin(res)
                })
            } else {

                if(!this.state.phone) {
                    return  this.setState({
                          phoneErr:true,
                          phoneErrText:intl.get('请输入短信验证码')
                      })
                  }
      
                  if(this.state.phoneErr && this.state.phone) {
                      return  this.setState({
                            phoneErr:true,
                            errText:intl.get('请输入短信验证码')
                      })
                  }

                aginValid({
                    gaCode:this.state.phone,
                    token:this.state.token,
                    id:this.props.login.id,
                    validateType:'2'
                }).then(res => {
                    message.info(res.msg);
                    this.props.emitSaveLogin(res)
                })
            }
        }
    }

    //tabchange
    tabscallback = (key) => {
        this.setState({
            activeKey:key,
            err:false,
            phoneErr:false,
            google:"",
            phone:''
        })
    }

   
    render() {

    const { getFieldDecorator } = this.props.form;
    
    const ALL = ( <Tabs defaultActiveKey="1"  onChange={this.tabscallback}>
                        <TabPane tab={intl.get('谷歌验证')} key="1" >
                            <Input  
                                className={cs("valid-inp google-inp", {'errInp':this.state.err})}
                                type="text"
                                prefix={<div className="icon-num"></div>}
                                value={this.state.google}
                                placeholder={intl.get('请输入谷歌验证器中的6位验证码')}
                                onChange={(e) => this.onChange(e,'google')}
                            />
                            <p className={cs("valid-p", {'err': this.state.err})}>{this.state.errText}</p>

                            <Button type="primary" className="my-btn" onClick={this.submitForm}>{intl.get('确定')}</Button>
                        </TabPane>
                        <TabPane tab={intl.get('短信验证')} key="2">

                            <div className="get-phone-Code">
                                <Input  
                                    className={cs("valid-inp google-inp", {'errInp':this.state.phoneErr})}
                                    type="text"
                                    prefix={<div className="icon-num"></div>}
                                    value={this.state.phone}
                                    placeholder={intl.get('请输入短信验证码')}
                                    onChange={(e) => this.onChange(e,'phone')}

                                />
                            
                                <Button 
                                    className={cs("getCode", {'coutDown': this.state.timerStart})}
                                    onClick={() =>this.countDown()}
                                >
                                    {this.state.timerStart?this.state.timerText:this.state.text}
                                </Button>
                            </div>
                            <p className={cs("valid-p", {'err': this.state.phoneErr})}>{this.state.phoneErrText}</p>
                            
                            
                            <Button type="primary" className="my-btn" onClick={this.submitForm}>{intl.get('确定')}</Button>
                        </TabPane>
                    </Tabs>
                );

    const googleLayout = (
        <div>
                 <Input  
                                className={cs("valid-inp google-inp", {'errInp':this.state.err})}
                                type="text"
                                prefix={<div className="icon-num"></div>}
                                value={this.state.google}
                                placeholder={intl.get('请输入谷歌验证器中的6位验证码')}
                                onChange={(e) => this.onChange(e,'google')}
                            />
                            <p className={cs("valid-p", {'err': this.state.err})}>{this.state.errText}</p>

                            <Button type="primary" className="my-btn" onClick={this.submitForm}>{intl.get('确定')}</Button>

        </div>
    );

    const  phoneLayout = (
        <div>
             <div className="get-phone-Code">
                                <Input  
                                    className={cs("valid-inp google-inp", {'errInp':this.state.phoneErr})}
                                    type="text"
                                    prefix={<div className="icon-num"></div>}
                                    value={this.state.phone}
                                    placeholder={intl.get('请输入短信验证码')}
                                    onChange={(e) => this.onChange(e,'phone')}

                                />
                            
                                <Button 
                                    className={cs("getCode", {'coutDown': this.state.timerStart})}
                                    onClick={() =>this.countDown()}
                                >
                                    {this.state.timerStart?this.state.timerText:this.state.text}
                                </Button>
                            </div>
                            <p className={cs("valid-p", {'err': this.state.phoneErr})}>{this.state.phoneErrText}</p>
                            
                            
                            <Button type="primary" className="my-btn" onClick={this.submitForm}>{intl.get('确定')}</Button>
        </div>
    )
    return (
   
      <div className="regist_yt aginvalid" > 
          <p className="registTip">{this.state.title}</p>
          <div className="registForm all">
              {this.state.validType === '3' ?ALL:''}
              {this.state.validType === '1' ?googleLayout:''}
              {this.state.validType === '2' ?phoneLayout:''}
          </div>
			    
            <Modal
                    title={intl.get("邮箱验证")}
                    visible={this.props.login.visible}
                    footer={null}
                    width='500px'
                    closable={false}
                    className="regist-model"
                    wrapClassName="vertical-center-modal"
                    onCancel={this.visiable}
                >
                <p className="model_txt">
                        {intl.get('EMAIL_MSG')}
                </p>
                <div className="model_btn">
                    <p onClick={this.sendEmail}> {intl.get("重发激活邮件")}</p>
                </div>
            </Modal>
      </div>
    );
  }
}
const mapStateToPorps=(state)=>{
 
    return {
        login:state.login,
    }
}
const mapDispatchToProps = dispatch => ({
    findData: bindActionCreators(FETCH_LOGIN_ACTIONS, dispatch),
    visible: bindActionCreators(UN_VISIABLE_ACTION, dispatch),
    emitSaveLogin:bindActionCreators(EMIT_SAVE_LOGIN,dispatch),
});
export default Form.create()(connect(mapStateToPorps,mapDispatchToProps)(AginValid))