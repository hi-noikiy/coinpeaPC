
import React from 'react';
import { Form, Input, Checkbox, Button, message , Modal ,Icon} from 'antd';
import { Link } from 'react-router-dom';

//样式
import './Personal/subpage/PersonalTwo.scss';


import intl from 'react-intl-universal';

//api
import { reforgetpw } from '../api/regist'

//变量
const FormItem = Form.Item;

class RegisterForm extends React.Component {
    state = {
      confirmDirty: false,
      lock:false,
    };

   componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount(){
        this.mounted = false;
    }
  handleSubmit = (e) => {/*提交按钮*/ 
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const uid=this.getQueryString('uid');
      const uuid=this.getQueryString("uuid")
      if (!err) {
        const params={
                id:uid,
                pw:values.password,
                repw:values.confirm,
                uuid:uuid,
        }
       this.setState({lock:true});
        reforgetpw(params).then(res => {
            this.setState({lock:false});
            if(res.status === 1){//修改成功
                message.success(res.msg, 1);
              
                setTimeout(() => {
                    this.props.history.push("/login");
                }, 2000);
                
            }  else{
                message.info(res.msg);
            }    
            });
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
   
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
     
        if (value && value !== form.getFieldValue('password')) {
            callback(intl.get('不一致'));
        } else {
            callback();
        }
  }

  validateToNextPassword=(rule,value,callback) => {
    const form = this.props.form;
    
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,20}$/.test(value)&&value && value.length>=6&&value.length<=20)//包含数字和字母
    {
      callback(intl.get('PW_MSG_TY1'));
    }else if(value && this.state.confirmDirty){
      form.validateFields(['confirm'], { force: true }); 
    }
    callback();
     
  }
    getQueryString(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
        var r = this.props.location.search.substr(1).match(reg);
        var q = this.props.location.search.substr(1).match(reg_rewrite);
        if(r != null){
            return unescape(r[2]);
        }else if(q != null){
            return unescape(q[2]);
        }else{
            return null;
        }
    }
  render() {
	const { getFieldDecorator } = this.props.form;	
    const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 8 },
        };
    return (
            <div id="personalTwo">
                <div className="personalTwo_con">
                    <p><Icon type="warning"  style={{ fontSize:16,color:'#FF4B4B' }} />{intl.get('修改密码提示')}</p>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                        {...formItemLayout}
                        label={intl.get('新登录密码')}
                        >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: intl.get('PW_MSG_TY4'),min: 6, max: 20
                            },{
                                validator:this.validateToNextPassword 
                            }],
                            })(
                            <Input type="password" placeholder={intl.get('PW_MSG_TY4')} className="inputItem"/>
                            
                            )}
                        </FormItem>

                        <FormItem
                        {...formItemLayout}
                        label={intl.get('确认新登录密码')}
                        >
                      
                        {getFieldDecorator('confirm', {
                            rules: [
                                {
                                    required: true, message: intl.get('PW_MSG_TY5'),
                                }, {
                                    validator: this.compareToFirstPassword,
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} placeholder={intl.get('PW_MSG_TY5')} className="inputItem" />
                            )}
                        </FormItem>

                        <FormItem wrapperCol={{ span: 8, offset: 9 }}>
                            <Button type="primary" style={{ width:'400px' }} onClick={this.handleSubmit} disabled={this.state.lock}>{intl.get('确认修改')}</Button>
                        </FormItem> 
                    </Form>   
                </div>
            </div>
        )
  }
}
const WrappedRegisterForm = Form.create()(RegisterForm);
export default WrappedRegisterForm