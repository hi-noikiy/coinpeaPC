/* 
    导航登录及国际化选择 组件
*/

import React from 'react';
import { Icon, Button, Select,  Avatar, Popover} from 'antd';
import { NavLink } from 'react-router-dom';

import './Login.scss';

const Option = Select.Option;

 /* 用户信息Pop层 */
 const title = (
        <div className="pop-usr-top">
            <Avatar icon="user" />
            <p>3***5@qq.com</p>
            <p>ID：273816</p>
        </div>
    );
const content = (
                <div className="pop-usr-body">
                    <NavLink to="/personal" className="pop-usr-body-top">
                        <span>账户信息</span>
                        <Icon type="right" />
                    </NavLink>
                    <NavLink to="/assets" className="pop-usr-body-bottom">
                        <span>资产信息</span>
                        <div className="pop-usr-body-assets">
                            <div>
                                <p>16.72946532 BTC</p>
                                <p>( ¥ 928,472.32 )</p>
                            </div>
                            <Icon type="right" />
                        </div>
                    </NavLink>
                    <div className="login-out" onClick={this.loginOut}>退出</div>
                </div>
    );

class Login extends React.PureComponent{

    constructor(props) {
        super(props);

        this.state = {
            loginState:true
        };
    }
    
    render() {
        return (
            <div className="nav-right">
                {
                    this.state.loginState?<div className="nav-user-info" >
                                            <Button type="primary" >登陆</Button>
                                            <Button ghost>注册</Button>
                                        </div>
                                        :<div className="nav-user-login">
                                            <div className="user-info-wrap">
                                                <Popover content={content} title={title}>
                                                    <Avatar icon="user" size="small"  style={{marginRight:6}}/>
                                                    <span style={{verticalAlign:'middle'}}>3***5@qq.com</span>
                                                </Popover>
                                            </div>
                                        </div>
                }
                <Select
                    
                    defaultValue="zh"  
                    className="lang" 
                    onChange={this.langChange} 
                    dropdownClassName="lang-drop">
                    <Option value="zh">
                        <i className="lang-type zh"></i>
                        简体中文
                    </Option>
                    <Option value="en">
                        <i className="lang-type en"></i>
                        <span>英文</span>
                    </Option>
            </Select>
        </div>
        )
    }
}

export default Login;