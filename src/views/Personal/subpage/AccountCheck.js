/* 
    身份认证页入口
*/
import React, { Component } from 'react';
import { Form,Radio, } from 'antd';
import SubpageHead from '../../../components/shared/SubpageHead'
import Identity from '../../../components/personal/Identity';
import PassPort from '../../../components/personal/PassPort';
import { withRouter } from 'react-router-dom';
import { authentication } from '../../../api/funds';

import intl from 'react-intl-universal';

import success from '../../../assets/success.svg';
import verify from '../../../assets/verify.svg';
import failed from '../../../assets/failed.svg';

import './PersonalTwo.scss';
import { message } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class AccountCheck extends Component {
    constructor(props){
        super(props);
        this.state = {
            form:'china',
            backLink: '/personal',
            backText: intl.get('返回个人中心'),
            columText: intl.get('身份认证'),
            showForm: true,
            checkStatus:0,
            showLayOut:false
        }
        
    }
    componentDidMount() {
        this.getVerifyStatus();
    }

    componentWillReceiveProps(nextProps) {
        
      if(this.props.location.pathname !== nextProps.location.pathname) this.getVerifyStatus();
       
    }


    //身份认证状态
    getVerifyStatus = async() => {
        const res = await authentication();
        if(res.status === 1){
            let showForm = true;
            if(res.data.identifiStatus === 0){
               showForm = true;
            }else if(res.data.identifiStatus === 1){
                showForm = false; 
            }else if(res.data.identifiStatus === 2){
                showForm = false; 
            }else if(res.data.identifiStatus === 3){
                showForm = false;
            }
            this.setState({
                showForm,
                checkStatus: res.data.identifiStatus,
                showLayOut:true
            })
        }
    }


    render() {      

        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol:{ span: 8 },
        }


        let imgUrl,text;

        if(this.state.checkStatus === 1){
            imgUrl = success;
            text = intl.get('已认证');

        }else if(this.state.checkStatus === 2){
            imgUrl = failed;
            text = intl.get('认证失败');

        }else if(this.state.checkStatus === 3){
            imgUrl = verify;
            text = intl.get('认证中');
        }

        return (
            <div id="personalTwo" style={{ margin: '0', border: 'none', width: 'auto' }}>
               {/*  <SubpageHead
                    backLink={this.state.backLink}
                    backText={this.state.backText}
                    columText={this.state.columText}
                /> */}
                {
                    this.state.showForm && this.state.showLayOut?
                    <div className="personalTwo_con" style={{padding:'30px 0 60px'}}>
                        <p>*<span>{intl.get('身份认证提示')}</span></p>
                        <div>
                            <Form>
                                <FormItem
                                     {...formItemLayout}
                                    label={intl.get('选择类型')}
                                >
                                    <RadioGroup onChange={this.changeFrom.bind(this)}  defaultValue='china'>
                                        <Radio value="china">{intl.get('中国大陆')}</Radio>
                                        <Radio value="other">{intl.get('其他国家和地区')}</Radio>
                                    </RadioGroup>
                                </FormItem>

                                { this.state.form === 'china' ? <Identity key="a"/> : <PassPort  key="b"/> }

                            </Form>   
                        </div>
                    </div>:
                    <div className="submit">
                        <img src={imgUrl} alt="" />
                        <p>{text} <a href="javascript:;" onClick={ ()=> this.setState({ showForm: true }) } style={{ display: this.state.checkStatus === 2?'inline-block':'none' }}>{intl.get('重新认证')}</a></p>
                    </div>
                }
            </div>
        )
    }   

    changeFrom(event){
        const value = event.target.value;
        if(value === 'china'){
            this.setState({
                form:'china'
            })
        }else{
            this.setState({
               form:'other'
            })
        }
    }
}

AccountCheck = createForm()(AccountCheck);

export default withRouter(AccountCheck); 