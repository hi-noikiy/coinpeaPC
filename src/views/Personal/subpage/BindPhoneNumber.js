/* 
    手机号绑定页入口
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon,Form,Input,Button,message,Select } from 'antd';
import { BondNote,unBondNote,getVerification,identification,getCountry } from '../../../api/personal'; 
import { idcardCheck, idcardUnCheck,msgCheck,msgUnCheck,googleCheck,googleUnCheck } from '../../../components/personal/AccountInfoRedux';
import './PersonalTwo.scss';

import intl from 'react-intl-universal';

import SubpageHead from '../../../components/shared/SubpageHead';
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;


class ChangePassword extends Component {
    constructor(props){
        super(props)
        this.state = {
            backLink: '/personal',
            backText: intl.get('返回个人中心'),
            columText: intl.get('绑定手机'),
            send:false,
            text:intl.get('获取验证码'),
            lock:false,
            timer:60,
            timerStart:false,
            country:[],
            nowCountry:null,
            defaultValue:"中国"
        }
    }
    componentDidMount() {
        getCountry().then(res=>{
            this.setState({
                country:res.data,
                nowCountry:res.data[0].areaCode,
                defaultValue:res.data[0].countryName,
            })
        })
    }

    select(v){
        let value = this.state.country.filter(e=>Number(e.areaCode) === Number(v))[0].areaCode;
        this.setState({ nowCountry: Number(v),defaultValue:value })
    }

    render() {      

        const selectBefore =  (<Select defaultValue={this.state.defaultValue} value={'+'+Number(this.state.nowCountry)} style={{ width: 90 }} onChange={ v=>this.select(v)} >
                                    {
                                        this.state.country.length?this.state.country.map((e,i) => {
                                            return <Option key={e.areaCode} value={e.areaCode}>{'+'+e.areaCode} {'['+e.ename+']'}</Option>
                                        }):null
                                    }
                                </Select>)

        

        const { getFieldProps, getFieldValue,validateFields } = this.props.form;
        const  noop = () =>{
            return false;
        }
        const checkPass0 = (rule, value, callback) => {

            
            if (value && value.length !== 11) {
              callback(intl.get('手机号长度不对'));
              
            }else if(value && value.length === 11){
                const myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
                if(!myreg.test(Number(value))){
                    callback(intl.get('手机号不正确'))
                }else{
                    callback();
                }
            }
            callback();
        }
        const checkPass1 = (rule, value, callback) => {
            validateFields(['phone'], { force: true });
            if(value){
                if(!getFieldValue('phone')) {
                    callback(intl.get('请先输入手机号码'));
                }
            }
            callback();
        }
        
        const checkPass2 = (rule, value, callback) =>{
            // validateFields(['phone'], { force: true });
            // validateFields(['phoneCode'], { force: true });
            callback(); 
        }
        const checkPass3 = (rule, value, callback) =>{
            validateFields(['phone'], { force: true },(errors, values)=>{
                if (!!errors) {
                    
                    return;
                }
                
                getVerification({...values,areaCode:this.state.nowCountry}).then(data=>{
                    if(data.status === 90021){
                        message.success(intl.get('验证码已发送'));
                        this.setState({
                            send:true
                        })
                        let num = 60;
                        this.setState({
                            text: `${num}s`,
                        })
                        const interl = setInterval(()=>{
                            num--;
                            if(num<=0){
                                clearInterval(interl);
                                this.setState({
                                    text: intl.get('获取验证码'),
                                    send:false
                                })
                                return
                            }
                            this.setState({
                                text: `${num}s`,
                            })
        
                        },1000)
                    }else{
                        message.info(data.msg)
                    }
                })
                
            });
            
        }

        //提交数据
        const  handleSubmit = (e) => {
          
            this.setState({lock:true})
            e.preventDefault();
           
            validateFields((errors, values) => {
              if (!!errors) {
                this.setState({lock:false})
                return;
              }
              let userMember={
                  //  password:values.loginPwd,
                    phone:values.phone,
              } 
              
              BondNote({"userMember":userMember,'gaCode':values.phoneCode,areaCode:this.state.nowCountry}).then(data =>{
                if(data.status === 1){
                    message.success(intl.get('手机号绑定成功'));
                    this.props.msgCheck();
                    setTimeout(()=>{this.props.history.push(this.state.backLink)},2000);

                }else{
                    message.error(data.msg);
                }
                this.setState({lock:false})
              })
            /*   identification({phone:userMember.phone,code:values.phoneCode}).then(data =>{
                this.setState({lock:false})
                  if(data.status === 1){
                  
                  }else{
                    message.error(data.msg);
                  }
              })    */
            }); 
        }
       
        
        const phoneProps = getFieldProps('phone', {
            rules: [
                {required: true,whitespace: true,message: intl.get('请输入手机号码')},
                { validator: checkPass0 },
            ],
        });
        const phoneCodeProps = getFieldProps('phoneCode', {
            rules: [
                { required: true, whitespace: true, message: intl.get('请输入验证码') },
                { validator: checkPass1 },
            ],
        });
     /*    const loginPwdProps = getFieldProps('loginPwd', {
            rules: [{
                required: true,
                min: 6,
                message: intl.get('密码长度不够'),
            }, {
                validator: checkPass2,
            }],
        }); */
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
                    <p></p>
                    <Form>
                        <FormItem
                        {...formItemLayout}
                             label={intl.get('手机号码')}
                        >
                        <Input 
                            addonBefore={selectBefore}
                            {...phoneProps} 
                            type="number" 
                            autoComplete="off"
                            onContextMenu={noop} style={{ width:'400px' }} 
                            onPaste={noop} 
                            onCopy={noop} 
                            onCut={noop} 
                            placeholder={intl.get('请输入手机号码')} 
                        />
                        </FormItem>

                        <FormItem
                        {...formItemLayout}
                        label={intl.get('手机验证码')}
                        >
                            <Input  
                                {...phoneCodeProps} 
                                type="number" 
                                autoComplete="off"
                                onContextMenu={noop} style={{ width:'284px' }} onPaste={noop} onCopy={noop} onCut={noop} placeholder={intl.get('请输入验证码')}
                            />
                            <Button className="getCode" disabled={this.state.send} onClick={checkPass3}>{this.state.text}</Button>
                        </FormItem>

                       {/*  <FormItem
                        {...formItemLayout}
                        label={intl.get('登录密码')}
                        >
                        <Input {...loginPwdProps} style={{ width:'400px' }}  type="password" autoComplete="off" placeholder={intl.get('请输入登录密码')}
                            onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                        />
                        </FormItem> */}

                        <FormItem wrapperCol={{ span: 8, offset: 9 }}>
                            <Button type="primary" 
                                style={{ width:'400px',height:'40px',color:'#fff' }} 
                                onClick={handleSubmit} 
                                disabled={this.state.lock}
                            >
                                    {intl.get('绑定')}
                            </Button>
                        </FormItem> 
                    </Form>   
                </div>
            </div>
        )
    }
   
    
}

ChangePassword = createForm()(ChangePassword);

const mapStateToProps = state => {}

const actionCreators = { msgCheck }

export default connect(
    mapStateToProps,
    actionCreators
)(ChangePassword)