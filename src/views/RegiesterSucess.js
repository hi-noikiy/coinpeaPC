import React from 'react';
import { CLEAR_LOGIN_ACTIONS } from './LoginRedux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

//样式
import './Register.scss';
import intl from 'react-intl-universal';
class RegisterForm extends React.Component {
  
  constructor(props) {
  
    super(props);
    this.props.dispatch(CLEAR_LOGIN_ACTIONS())
  }

  componentWillUnmount() {
	  this.timer = null;
  }

  server = () =>{
          this.props.history.push("/site?")
  }

  render() {
    return (
      <div className="regist_yt"> 
        <p className="registTip">{intl.get('注册')}</p> 
        <img src={require("../assets/08_06.success.svg")} alt="" style={{margin:'150px auto 20px',display:'block'}}/>  
        <p style={{fontSize:'24px',textAlign:'center'}}>{intl.get('验证成功！')}</p>
        <p style={{fontSize:'14px',textAlign:'center',margin:'20px 0 334px',color: '#808080'}}>{intl.get('注册成功,请')}
				<Link to="/login" style={{color:''}}> {intl.get('登录')} </Link>{intl.get('账户')}</p> 
      </div>
    );
  }
}

export default connect()(RegisterForm);