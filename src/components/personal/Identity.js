/**
 * 身份认证表单
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Form,Input,Button,message,Upload,Modal} from 'antd';
import { idcardCheck } from './AccountInfoRedux';
import upload from '../../assets/07_05.add.png';
import { postAuthenInfo } from '../../api/personal';
import { withRouter } from 'react-router-dom';

import intl from 'react-intl-universal';

const createForm = Form.create;
const FormItem = Form.Item;


class Identify extends Component {

    constructor(props){
        super(props);
        this.state = {
            fileList: [],
            fileList2: [],
            fileList3: [],
            imageUrl:'',
            imageUrl2:'',
            imageUrl3:''
        }
    }

    
    beforeUpload(file) {
        if(!window.navigator.onLine) return message.error(intl.get('网络出错'));
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
          return message.error(intl.get('仅支持JPG图片格式'));
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          return message.error(intl.get('文件大小不能超高10M'));
        }
    }

    //预览
    handlePreview = (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
    }

    handleCancel = () => this.setState({ previewVisible: false })
    


    render(){
        const { getFieldProps, setFieldsValue,validateFields } = this.props.form;
        const handleChange = (info) => {
            if(!window.navigator.onLine) return
            if(info.file.type.indexOf('image')===-1) return
            let fileList = info.fileList;   
            this.setState({ fileList });
            if (info.file.status === 'done') {
                this.setState({
                    imageUrl:info.file.response.data.pathUrl
                })  
                setFieldsValue({['frontUrl']:this.state.imageUrl});
            }
         }

        const handleChange2 = (info) => {
            if(!window.navigator.onLine) return
            if(info.file.type.indexOf('image')===-1) return
            let fileList2 = info.fileList;   
            this.setState({ fileList2 });
            if (info.file.status === 'done') {
                
                this.setState({
                    imageUrl2:info.file.response.data.pathUrl
                })  
                setFieldsValue({['versoUrl']:this.state.imageUrl2});
            }
        }

        const handleChange3 = (info) => {
            if(!window.navigator.onLine) return
            if(info.file.type.indexOf('image')===-1) return
            let fileList3 = info.fileList;   
            this.setState({ fileList3 });  
            if (info.file.status === 'done') {
                
                this.setState({
                    imageUrl3:info.file.response.data.pathUrl
                }) 
                setFieldsValue({['handUrl']:this.state.imageUrl3}); 
            }
        }

        const normFile = (e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
        }

        const  noop = () =>{
            return false;
        }

        const checkPass3 = (rule, value, callback) => {
            if(value){
                const myreg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
                if(!myreg.test(value)){
                    callback(intl.get('姓氏输入不合法'))
                }
            }
            callback();
        }

        const checkPass2 = (rule, value, callback) => {
            if(value){
                const myreg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
                if(!myreg.test(value)){
                    callback(intl.get('名字输入不合法'))
                }
            }
            callback();
        }


        const checkPass0 = (rule, value, callback) => {
            
            if (value && value.length !== 18 && value.length !== 15 ) {
              callback(intl.get('身份证长度不对'));
            }else if(value){
                const myreg=/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
                if(!myreg.test(value)){
                    callback(intl.get('身份证号不正确'))
                }else{
                    callback();
                }
            }
            callback();
        }
        
        const familyNameProps = getFieldProps('familyName', {
            rules: [
                {required: true,whitespace: true,message: intl.get('请输入姓氏')},
                { validator: checkPass3 },
            ],
        });

        const realNameProps = getFieldProps('realName', {
            rules: [
                {required: true,whitespace: true,message: intl.get('请输入名字')},
                { validator: checkPass2 },
            ],
        });

        const numberProps = getFieldProps('number', {
            rules: [
                { required: true, whitespace: true, message: intl.get('请输入身份证号码') },
                { validator: checkPass0 },
            ],
        });

        const frontUrlProps = getFieldProps('frontUrl', {
            valuePropName: 'fileList',
            normalize: this.normFile,
            rules: [
                { required: true, whitespace: true, message: intl.get('请选择正面照') },
            ]
        });

        const versoUrlProps = getFieldProps('versoUrl', {
            valuePropName: 'fileList',
            normalize: this.normFile,
            rules: [
                { required: true, whitespace: true, message: intl.get('请选择背面照') },
            ]
        });

        const handUrlProps = getFieldProps('handUrl', {
            valuePropName: 'fileList',
            normalize: this.normFile,
            rules: [
                { required: true, whitespace: true, message: intl.get('请选择签名照') },
            ]
        });

        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 8 },
        };
        //提交信息
        const handleSubmit = (e) => {
            e.preventDefault();
            validateFields((errors, values) => {
              if (!!errors) {
             
                return;
              }    
              this.setState({
                lock:true
                })
              postAuthenInfo({...values}).then(data=>{
                    if(data.status === 1){
                        message.success(intl.get('提交成功审核中'));
                        this.props.idcardCheck(); 
                        this.props.history.goBack();
                    }else{
                        message.info(data.msg);
                    }
                    this.setState({
                        lock:false
                    })
              })
            }); 
           
        }
        const uploadButton=(
            <div>
                <img src={upload} style={{margin:'40px 0 17px'}} alt=''/>
                <p style={{fontSize:'12px',lineHeight:'22px'}}>*<span> {intl.get('身份认证上传图片1')}<br/>{intl.get('身份认证上传图片2')}</span></p>
            </div>
        )
        const uploadButton2=(
            <div>
                <img src={upload} style={{margin:'40px 0 17px'}} alt=''/>
                <p style={{fontSize:'12px',lineHeight:'22px'}}>*<span> {intl.get('身份认证上传图片3')}<br/>{intl.get('身份认证上传图片4')}</span></p>
            </div>
        )
        const imageUrl=this.state.imageUrl;
        const imageUrl2=this.state.imageUrl2;
        const imageUrl3=this.state.imageUrl3;


        return(
            <div className="identify">
                <FormItem
                    {...formItemLayout}
                    label={intl.get('姓氏')}
                >
                <Input {...familyNameProps} type="text" autoComplete="off"
                    onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} placeholder={intl.get('请输入身份证上的姓氏')}
                />
                </FormItem>

                <FormItem
                {...formItemLayout}
                label={intl.get('名字')}
                >
                <Input  {...realNameProps} type="text" autoComplete="off"
                    onContextMenu={noop}  onPaste={noop} onCopy={noop} onCut={noop} placeholder={intl.get('请输入身份证上的名字')}
                />
                </FormItem>

                <FormItem
                {...formItemLayout}
                label={intl.get('有效身份证')}
                >
                <Input {...numberProps} type="text" autoComplete="off" placeholder={intl.get('请输入身份证号')}
                    onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                />
                </FormItem>

                <FormItem
                label={intl.get('本人身份证正面照片')}
                {...formItemLayout}
                >
                <Upload 
                    {...frontUrlProps} 
                    action="/coinex-interface/api/sys/authenticationUpload"  
                    listType="picture-card" 
                    fileList={this.state.fileList}  
                    beforeUpload={this.beforeUpload}
                    onChange={handleChange}
                    onPreview={this.handlePreview}
                    accept="image/jpeg"
                >
                 {/*imageUrl ? <img src={imageUrl} alt="avatar" width="100%" height="100%"/> : uploadButton*/}
                 { this.state.fileList.length >= 1 ? null : uploadButton}  
                </Upload>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel} className="showPic">
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                </FormItem>

                <FormItem
                label={intl.get('本人身份证背面照片')}
                {...formItemLayout}
                >
                <Upload 
                    {...versoUrlProps} 
                    action="/coinex-interface/api/sys/authenticationUpload" 
                    listType="picture-card"   
                    fileList={this.state.fileList2}  
                    onChange={handleChange2}
                    onPreview={this.handlePreview}
                    beforeUpload={this.beforeUpload} 
                    accept="image/jpeg"
                >
                {this.state.fileList2.length >= 1 ? null : uploadButton} 
                 
                </Upload>
                </FormItem>
                <p className="lastUpTip"><span>{intl.get('签名照1')} </span>{intl.get('签名照2')} <i>CoinPea</i>{intl.get('签名照3')}<i>{intl.get('签名照4')}</i>{intl.get('签名照5')}</p>
                
                <FormItem
                label="."
                prefixCls="lastUp"
                {...formItemLayout}
                >
                <Upload 
                    {...handUrlProps} 
                    action="/coinex-interface/api/sys/authenticationUpload" 
                    listType="picture-card"   
                    fileList={this.state.fileList3}     
                    onChange={handleChange3}
                    onPreview={this.handlePreview}
                    accept="image/jpeg"
                    beforeUpload={this.beforeUpload}
                >
                {this.state.fileList3.length >= 1 ? null : uploadButton2} 
                </Upload>   
               {/*  <a href="https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png" target="_blank" className="upload-example">
                    <img alt="example" src="https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png" />
                    <span>{intl.get('示例')}</span>
                </a> */}
                </FormItem>

                <FormItem wrapperCol={{ span: 8, offset: 9 }}>
                    <Button type="primary" style={{ width:'400px',height:'40px' }} disabled={this.state.lock} onClick={handleSubmit}>{intl.get('提交')}</Button>
                </FormItem>
            </div>
        )
    }
}

Identify = createForm()(Identify)

const actionCreators = { idcardCheck }

export default withRouter(connect(
    null,
    actionCreators
)(Identify))