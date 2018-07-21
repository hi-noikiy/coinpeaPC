import React from 'react';
import { Form, Input, Checkbox, Button, message ,Modal} from 'antd';
import { Link } from 'react-router-dom';
import './Register.scss';
import {forgetpw} from '../api/regist'

import intl from 'react-intl-universal';

const FormItem = Form.Item;
class RegisterForm extends React.Component {
  state = {
    img:'/coinex-interface/api/usermember/createVerify',
    bool:false,
    visible:false
  };

  handleSubmit = (e) => {/*提交按钮*/ 
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({bool:true})
        const params={
          verifyCode:values.captcha,
          email:values.email,
        }
        forgetpw(params).then(res => {
         this.setState({bool:false})
         if(res.status === 90021){
          this.setState({'visible':true})
         }else{
          message.info(res.msg)
         }    
       });
      }
    });
  }

  componentDidMount() {
	this.changeCode();
  }
  
  changeCode =()=> {
    this.setState({img:'/coinex-interface/api/usermember/createVerify?'+Math.random()});
  }
  render() {
    
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    
    return (
      <div className="regist_yt"> 
        <p className="registTip">{intl.get('找回密码')}</p>   
        <Form onSubmit={this.handleSubmit} className="registForm" >
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('email', {
              rules: [{
                required: true,type: 'email', message: intl.get('邮箱账号'),
              }],
            })(
              <Input placeholder={intl.get('请输入注册时使用的邮箱账号')} className="inputItem" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            className="code_yt"
          >
            {getFieldDecorator('captcha', {
              rules: [{
                required: true,message: intl.get('验证码_1'),
              }],
            })(
              <Input placeholder={intl.get('验证码_1')} className="inputItem"/>
              
            )}
            <img src={this.state.img} className="codePic" onClick={this.changeCode} alt=""/>
          </FormItem>
          
          <FormItem>
            <Button type="primary" htmlType="submit" className="regist_btn" disabled={this.state.bool}>{intl.get('下一步')}</Button>
          </FormItem>
          <FormItem>
            <p className="goLogin ant-col-sm-16" style={{textAlign:'right'}}>{intl.get('已有账号')}？<Link to="/login">{intl.get('登录')}</Link></p>
          </FormItem>

        </Form>
        <Modal
        title={intl.get('发送成功')}
        visible={this.state.visible}
        footer={null}
        width='500px'
        closable={false}
        className="regist-model"
        wrapClassName="vertical-center-modal"
        onCancel={() => this.setState({visible:!this.state.visible})}
      >
        <p className="model_txt">
        {intl.get('发送邮件')}
        </p>
        <div className="model_btn">
          <p onClick={() => this.props.history.push("/login")}>{intl.get('确定')}</p>
        </div>
      </Modal>
        
      </div>
    );
  }
}
const WrappedRegisterForm = Form.create()(RegisterForm);
export default WrappedRegisterForm