import React from 'react';
import { Form, Input, Button , Modal , message } from 'antd';
import './Register.scss';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FETCH_LOGIN_ACTIONS , UN_VISIABLE_ACTION } from './LoginRedux'
import { _LocalStorage } from '../utils';
import intl from 'react-intl-universal';

//api
import { sendEmail } from '../api/regist'
import { validate} from '../api/home';


//变量
const FormItem = Form.Item;

class Login extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      bool:false,
      confirmDirty: false,
      visible:false,
      email:''
    }
  }
  componentDidMount() {  
    const ls = new _LocalStorage();
    validate().then(res => {
      
        ls.set('rate', res.data);
    })
  }

  handleSubmit = (e) => {
    /*提交按钮*/ 
      e.preventDefault();
      this.props.form.validateFields((err, values) => { 
        if(!!err) return false;
		  if(this.props.login.bool) return false; 
        
         //  values.from = this.props.location.state ? this.props.location.state.from:{pathname:'/'};
          this.props.findData(values, this.props.history)
            this.setState({
              email:values.username
            })
    })
  }

  sendEmail = async()=>{//再次发送邮xiang
    
    let email=this.state.email;
    const res = await sendEmail({"userName":email});
    message.success(res.msg,1)
  }

  visiable = () => {
    this.props.visible()

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
   
      <div className="regist_yt" style={{ display:'flex', flexDirection: 'column', alignItems: 'center'}}> 
          <p className="registTip">{intl.get('登录')}</p>   
			    <Form onSubmit={this.handleSubmit} className="registForm" >
					<FormItem
					{...formItemLayout}
					>
						{ getFieldDecorator('username', {
							rules: [{
							required: true,message: intl.get('请输入账号！'),
							}],
							})(
								<Input placeholder={intl.get("请输入账号！")}  className="inputItem" autoComplete='false'/>
						)}
        			</FormItem>
					<FormItem
						{...formItemLayout}
						>
						{getFieldDecorator('password', {
						rules: [{
							required: true,message: intl.get('请输入登录密码')
						}],
						})(
						<Input type="password" placeholder={intl.get("请输入登录密码")} className="inputItem"  autoComplete='false'/>
						
						)}
					</FormItem>
					<FormItem>
					<Button type="primary" htmlType="submit" className="regist_btn" disabled={this.props.login.bool}>{intl.get("登录")}</Button>
					</FormItem>
        			<FormItem>
						<p className="goRegist ant-col-sm-16">{intl.get("还没有账号")}？
						<Link to="/register">{intl.get("立即注册")}</Link>
						<Link to="/forgetPass" className="forget">{intl.get("忘记密码")}？</Link>
						</p>
        			</FormItem>
      			</Form>
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
 
    return {login:state.login}
}
const mapDispatchToProps = dispatch => ({
    findData: bindActionCreators(FETCH_LOGIN_ACTIONS, dispatch),
    visible: bindActionCreators(UN_VISIABLE_ACTION, dispatch)
});
export default Form.create()(connect(mapStateToPorps,mapDispatchToProps)(Login))