/* 
    修改密码页入口
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon,Form,Input,Button,message } from 'antd';
import { idcardCheck,idcardUnCheck,msgCheck,msgUnCheck,googleCheck,googleUnCheck } from '../../../components/personal/AccountInfoRedux';
import './PersonalTwo.scss';
import { CLEAR_LOGIN_ACTIONS } from '../../LoginRedux';
import intl from 'react-intl-universal';

import SubpageHead from '../../../components/shared/SubpageHead';
import { ChangePwd } from '../../../api/personal';
const createForm = Form.create;
const FormItem = Form.Item;
 


class ChangePassword extends Component {
    constructor(props){
        super(props)
        this.state = {
            backLink: '/personal',
            backText: intl.get('返回个人中心'),
            columText: intl.get('修改登录密码'),
            lock:false,
            confirmDirty: false
        }
    }
    componentDidMount() {
        this.mounted = true;
        console.log(this.props)
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    render() {      
        const { getFieldDecorator, getFieldValue,validateFields } = this.props.form;
        const  noop = () =>{
            return false;
        }
        const checkPass0 = (rule, value, callback) => {
           /*  if (value && value.length<6) {
              callback(intl.get('密码长度不够'));
            }  */
            callback();
        }

        const checkPass1 = (rule, value, callback) => {
                if(value && value === getFieldValue('oldPwd')) {
                    callback(intl.get('原密码与新密码一致'))

                }
                else if(!(/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{6,20}$/.test(value)) && value){
                    
                    callback(intl.get('PW_MSG_TY1'));
                }else if(value && this.state.confirmDirty){
                    
                    validateFields(['confirm'], { force: true }); 
                }
                callback(); 

        }
        
        const checkPass2 = (rule, value, callback) =>{
          
            if (value && value !== getFieldValue('newPwd')) {
                callback(intl.get('不一致'));
            } else {
              callback();
            }
        }
        
        //提交数据
        const handleSubmit = (e) => {
            this.setState({lock:true})
            e.preventDefault();
            validateFields((errors, values) => {
              if (!!errors) {
                this.setState({lock:false})
                console.log('信息填写有误');
                return;
              }
                let data={
                    newpassword:values.newPwd,
                    qrpassword:values.confirm,
                    userMember:{
                        password:values.oldPwd
                    }  
                } 

              ChangePwd(data).then(data =>{
                this.setState({lock:false})
                  if(data.status === 1){
                    message.success(intl.get('修改成功'));
                  //  setTimeout(()=>{this.props.history.push(this.state.backLink)},3000);
                   
                   setTimeout( () => {
                        
                       this.props.dispatch(CLEAR_LOGIN_ACTIONS());
                      
                   }, 2000)
                   
                  } else{
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
                    <p><Icon type="warning"  style={{ fontSize:16,color:'#FF4B4B' }} />{intl.get('修改密码提示')}</p>
                    <Form>
                        <FormItem
                        {...formItemLayout}
                        label={intl.get('原登录密码')}
                        >
                        {
                            getFieldDecorator('oldPwd', {
                                rules: [
                                    {required: true,whitespace: true,message: intl.get('请输入原密码')},
                                    { validator: checkPass0 },
                                ],
                            })( 
                            <Input  type="password" autoComplete="off" onContextMenu={noop} style={{ width:'400px' }} onPaste={noop} onCopy={noop} onCut={noop} placeholder={intl.get('请输入原密码')} />
                            )   
                        }

                        </FormItem>

                        <FormItem
                        {...formItemLayout}
                        label={intl.get('新登录密码')}
                        >
                        {
                            getFieldDecorator('newPwd', {
                                rules: [
                                    { required: true, whitespace: true, message: intl.get('PW_MSG_TY4') },
                                    { validator: checkPass1 },
                                ],
                            })(
                                <Input  type="password" autoComplete="off"
                                onContextMenu={noop} style={{ width:'400px' }} onPaste={noop} onCopy={noop} onCut={noop} placeholder={intl.get('PW_MSG_TY4')}
                            />
                            )
                        }
                        </FormItem>

                        <FormItem
                        {...formItemLayout}
                        label={intl.get('确认新登录密码')}
                        >
                        {
                            getFieldDecorator('confirm', {
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: intl.get('PW_MSG_TY5'),
                                }, {
                                    validator: checkPass2,
                                }],
                            })(
                                <Input style={{ width:'400px' }} onBlur={this.handleConfirmBlur}  type="password" autoComplete="off" placeholder={intl.get('PW_MSG_TY5')}
                                onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                            />
                            )
                        }

                        </FormItem>

                        <FormItem wrapperCol={{ span: 8, offset: 9 }}>
                            <Button type="primary" style={{ width:'400px' }} onClick={handleSubmit} disabled={this.state.lock} className="btn">{intl.get('确认修改')}</Button>
                        </FormItem> 
                    </Form>   
                </div>
            </div>
        )
    }
    
}

ChangePassword = createForm()(ChangePassword);

export default connect()(ChangePassword)