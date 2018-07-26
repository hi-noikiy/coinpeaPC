/* 
    修改密码页入口
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon,Form,Input,Button,message } from 'antd';
import { idcardCheck,idcardUnCheck,msgCheck,msgUnCheck,googleCheck,googleUnCheck } from '../../../components/personal/AccountInfoRedux';
import cs from 'classnames';

import './PersonalTwo.scss';

import intl from 'react-intl-universal';

import SubpageHead from '../../../components/shared/SubpageHead';
import {getVerification,   ClosePhone as close, unBondNote} from '../../../api/personal';
const createForm = Form.create;
const FormItem = Form.Item;
 


class UpdatePhon extends Component {
    constructor(props){
        super(props)
        this.state = {
            backLink: '/personal',
            backText: intl.get('返回个人中心'),
            columText: intl.get('修改手机号码'),
            text:intl.get('获取验证码'),
            lock:false,
            confirmDirty: false,
            timer:60,
            timerText:'60s',
            timerStart:false,
            phoneNumber:''
        }
    }
    componentDidMount() {
        this.mounted = true;
        
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

   

    countDown = (validateFields)=> {
        validateFields(['newPwd'],{ force:true},(errors, values) => {
            if(!!errors) {
                return;
            }
            else {
                if(this.state.timerStart || !this.state.phoneNumber) return;
                    this.setState({
                        timerStart:true,
                    })

                    getVerification({phone: this.state.phoneNumber}).then(res => {
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
        })
        
    }

    render() {      
        const { getFieldDecorator, getFieldValue,validateFields } = this.props.form;
        const  noop = () =>{
            return false;
        }
       
        const checkPass2 = (rule, value, callback) =>{
          
              callback();
            
        }
        const checkPass_phone = (rule, value, callback) => {
            
            if (value && value.length !== 11) {
              callback(intl.get('手机号长度不对'));
              
            }else if(value && value.length === 11){
                const myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
                if(!myreg.test(Number(value))){
                    callback(intl.get('手机号不正确'))
                }else{
                    this.setState({
                        phoneNumber:value
                    })
                    callback();
                }
            }
            callback();
        }
        const checkPass_phone_none = (rule, value, callback) => {
            validateFields(['phone'], { force: true });
           
            if(value){
                if(!getFieldValue('phone')) {
                    callback(intl.get('请先输入手机号码'));
                }
            }
            callback();
        }
        //提交数据
        const handleSubmit = (e) => {
            this.setState({lock:true})
            e.preventDefault();

            validateFields((errors, values) => {
              if (!!errors) {
                this.setState({lock:false})
              
                return;
              }
                let data={
                    gaCode:values.confirm,
                    userMember:{
                        password:values.oldPwd,
                        phone:this.state.phoneNumber
                    }  
                }   
                unBondNote(data).then(data =>{
                    this.setState({lock:false})
                    if(data.status === 1){
                        message.success(data.msg);
                       setTimeout(()=>{this.props.history.push(this.state.backLink)},2000);
                    }else{
                        message.error(data.msg);
                    }
                })
            });
        }
        
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 8 },
        };
        
        return (
            <div id="personalTwo">
                <SubpageHead
                        backLink={this.state.backLink}
                        backText={this.state.backText}
                        columText={this.state.columText}
                />
                <div className="personalTwo_con">
                   {/*  <p><Icon type="warning"  style={{ fontSize:16,color:'#FF4B4B' }} />{intl.get('关闭短信验证后24小时内禁止提币')}</p> */}
                    <Form>
                        <FormItem
                        {...formItemLayout}
                        label={intl.get('登录密码')}
                        >
                        {
                            getFieldDecorator('oldPwd', {
                                rules: [
                                    {required: true,whitespace: true,message: intl.get('请输入登录密码')},
                                  //  { validator: checkPass0 },
                                ],
                            })( 
                            <Input  
                                type="password" 
                                autoComplete="off" 
                                onContextMenu={noop} 
                                style={{ width:'400px' }} 
                                onPaste={noop} 
                                onCopy={noop} 
                                onCut={noop} 
                                placeholder={intl.get('请输入密码')} />
                            )   
                        }

                        </FormItem>

                        <FormItem
                        {...formItemLayout}
                        label={intl.get('新手机号码')}
                        >
                        {
                            getFieldDecorator('newPwd', {
                                rules: [
                                    { required: true, whitespace: true, message: intl.get('请输入手机号码') },
                                    { validator: checkPass_phone },
                                ],
                            })(
                                <Input  
                                    type="number" 
                                    autoComplete="off"
                                    onContextMenu={noop}
                                    
                                    style={{ width:'400px' }} onPaste={noop} onCopy={noop} onCut={noop} 
                                    placeholder={intl.get('请输入手机号码')}
                            />
                            )
                        }
                        </FormItem>

                        <FormItem
                        {...formItemLayout}
                            label={intl.get('短信验证码')}
                        >
                        {
                            getFieldDecorator('confirm', {
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: intl.get('phone_msg_tips'),
                                }, {
                                    validator: checkPass2,
                                }],
                            })(
                                <div className="get-phone-Code">
                                    <Input 
                                        style={{ width:'285px' }} 
                                        onBlur={this.handleConfirmBlur}  
                                        type="text"
                                        autoComplete="off" 
                                        placeholder={intl.get('phone_msg_tips')}
                                        onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                                    />
                                     <Button
                                        type="danger"
                                        ghost
                                         className={cs("getCode", {'coutDown': this.state.timerStart})}
                                         onClick={() =>this.countDown(validateFields)}
                                      >
                                        {this.state.timerStart?this.state.timerText:this.state.text}
                                    </Button>
                                </div>
                            )
                        }

                        </FormItem>

                        <FormItem wrapperCol={{ span: 8, offset: 9 }}>
                            <Button 
                                type="primary" 
                                style={{ width:'400px' }} 
                                onClick={handleSubmit} 
                                disabled={this.state.lock} 
                                className="btn">{intl.get('确定')}</Button>
                        </FormItem> 
                    </Form>   
                </div>
            </div>
        )
    }
    
}

UpdatePhon = createForm()(UpdatePhon);

export default UpdatePhon