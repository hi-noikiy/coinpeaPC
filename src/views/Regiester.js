import React from 'react';
import { Form, Input, Checkbox, Button, message, Modal } from 'antd';
import { Link } from 'react-router-dom';

import { _LocalStorage } from './../utils/index';

import intl from 'react-intl-universal';
import qs from 'querystring';

//样式
import './Register.scss';

//api
import { registUrl, sendEmail, checkEmail } from '../api/regist'
import { getServeID, getSite } from '../api/home'

const ls = new _LocalStorage();

//变量
const FormItem = Form.Item;

class RegisterForm extends React.Component {
	state = {
		confirmDirty: false,
		img: '/coinex-interface/api/usermember/createVerify',
		bool: false,
		visible: false,
		email: '',
		referrerNum: null,
		emailDirty: false,
	};

	componentWillUnmount() {
		this.timer = null;
		/* window.location.search === '' ?  null : this.setState({
		referrerNum:qs.parse(window.location.search)['?ref']
		}) */
	}

	componentDidMount() {
		const referrer = window.location.search.slice(1).split('&');
		let list = {};
		referrer.forEach((e, k) => {
			const v = e.split('=');
			list[v[0]] = v[1]
		})
		console.log(list)
		if (list.ref) {
			ls.set('inviteCode',list.ref);
			this.setState({
				referrerNum: list.ref
			})
			
		}else{
			this.setState({
				referrerNum: ls.get('inviteCode')?ls.get('inviteCode'):null
			})
		}
	}

	handleSubmit = (e) => {/*提交按钮*/
		e.preventDefault();
		if (this.state.emailDirty) {
			this.props.form.setFields({
				email: {
					value: this.props.form.getFieldValue('email'),
					errors: [new Error(intl.get("EMAIL_HAS_REIGISTER"))],
				},
			});
			return false
		}
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {

				const params = {
					userMember: {
						username: values.email,
						password: values.password,
					},
					referrerId: values.referrerId,
					verifyCode: values.captcha,
				}

				this.setState({ bool: true, email: values.email });

				registUrl(params).then(res => {

					this.setState({ bool: false });

					if (res.status === 110006) {  //注册成功
						this.setState({ visible: true })
					}
					else {
						message.info(res.msg);
						this.setState({
							img: '/coinex-interface/api/usermember/createVerify?' + Math.random(),
						})
					}

				});
			}
		});
	}
	sendEmail = async () => {//再次发送邮xia
		let email = this.state.email;
		const res = await sendEmail({ "userName": email });
		message.success(res.msg, 1)
	}
	changeCode = () => {
		this.setState({ img: '/coinex-interface/api/usermember/createVerify?' + Math.random() });
	}

	handleConfirmBlur = (e) => {
		const value = e.target.value;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	}

	checkEmail = async (e) => {
		const value = e.target.value
		const res = await checkEmail({ userMember: { username: value } })
		if (res.status === 90014) {
			this.props.form.setFields({
				email: {
					value: value,
					errors: [new Error(res.msg)],
				},
			});
			this.setState({ emailDirty: true })
		} else {
			this.setState({ emailDirty: false })
		}
	}

	compareToFirstPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			callback(intl.get("PW_NO_SAME"));
		} else {
			callback();
		}
	}

	validateToNextPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (!/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{6,20}$/.test(value) && value && value.length >= 6 && value.length <= 20)//包含数字和字母
		{
			callback(intl.get("PW_MSG_TY1"));
		} else if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		callback();

	}
	
	emailValidator = (rule, value, callback) => {
		console.log(value)
		const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
		if(!reg.test(value)) {
			callback(intl.get("EMAIL_ERR_MSG"));
		}

		callback();
	}

	checkTk = (e) => {
		this.setState({
			bool: !e.target.checked,
		})
	}

	server = () => {

		getServeID().then(res => {

			getSite().then(data => {

				if (data.status === 1) {
					if (res.data && res.data.length) {
						data.data.forEach((v, i) => {

							if (v.id === res.data[0].articleType) {
								const url = window.location.pathname.replace('register', `site?index=${i}`);
								window.open(url, '_blank')
							}
						})

					}
				}

				else {
					message.fail(data.msg)
				}

			})


		})


		//
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
				<p className="registTip">{intl.get("注册")}</p>
				<Form onSubmit={this.handleSubmit} className="registForm" >
					<FormItem
						{...formItemLayout}
					>
						{getFieldDecorator('email', {
							rules: [{
								type: 'email', message: intl.get('EMAIL_ERR_MSG'),
							}, {
								required: true, message: intl.get("EMAIL_ERR_NULL"),
							}
								 ,{
								   validator:this.emailValidator 
								 }
							],
						})(
							<Input placeholder={intl.get("EMAIL_ERR_NULL")} className="inputItem" onBlur={this.checkEmail} />
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
						className="code_yt"
					>
						{getFieldDecorator('captcha', {
							rules: [{
								required: true, message: intl.get("验证码_1"),
							}],
						})(
							<Input placeholder={intl.get("验证码_1")} className="inputItem" />

						)}
						<img src={this.state.img} className="codePic" onClick={this.changeCode} alt="" />
					</FormItem>
					<FormItem
						{...formItemLayout}
					>
						{getFieldDecorator('password', {
							rules: [{
								required: true, message: intl.get("PW_MSG_TY1"), min: 6, max: 20
							}, {
								validator: this.validateToNextPassword
							}],
						})(
							<Input type="password" placeholder={intl.get("LABEL_1")} className="inputItem" />

						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
					>
						{getFieldDecorator('confirm', {
							rules: [{
								required: true, message: intl.get("PW_MSG_TY1")
							}, {
								validator: this.compareToFirstPassword,
							}],
						})(
							<Input type="password" onBlur={this.handleConfirmBlur} placeholder={intl.get('LABEL_2')} className="inputItem" />
						)}
					</FormItem>
					<FormItem
						{...formItemLayout}
					>
						{getFieldDecorator('referrerId', {
							rules: [{ required: false }],
							initialValue: this.state.referrerNum
						})(
							<Input placeholder={intl.get("请输入邀请人ID（选填）")} className="inputItem" type="number" />
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('agreement', {
							valuePropName: 'checked',
							initialValue: true,
						})(
							<Checkbox
								className="checkTxt"
								onChange={this.checkTk}
							>
							</Checkbox>
						)}
						<span>{intl.get("我已阅读")} <s onClick={this.server} style={{textDecoration:'none',color:'#3DADD9',cursor:'pointer'}}>{intl.get("用户协议")}</s> {intl.get("并同意")}</span>
					</FormItem>
					<FormItem>
						<Button type="primary" htmlType="submit" className="regist_btn" disabled={this.state.bool} >{intl.get("注册")}</Button>
					</FormItem>
					<FormItem className="last_tip">
						<p className="goLogin ant-col-sm-16">{intl.get("已有账号")}？<Link to="/login">{intl.get("立即登录")}</Link></p>
					</FormItem>
				</Form>
				<Modal
					title={intl.get("邮箱验证")}
					visible={this.state.visible}
					footer={null}
					width='500px'
					closable={false}
					className="regist-model"
					wrapClassName="vertical-center-modal"
					onCancel={() => this.setState({ visible: !this.state.visible })}
				>
					<p className="model_txt">
						{intl.get("EMAIL_MSG2")} <i style={{color:'red'}}>{intl.get("垃圾箱")}</i> 
					</p>
					<div className="model_btn">
						<p><Link to="/login">{intl.get("登录")}</Link></p>
						<p onClick={this.sendEmail}>{intl.get("重发激活邮件")}</p>
					</div>
				</Modal>

			</div>
		);
	}
}
const WrappedRegisterForm = Form.create()(RegisterForm);
export default WrappedRegisterForm