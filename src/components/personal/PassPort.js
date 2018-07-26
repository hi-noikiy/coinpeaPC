/**
 *  护照表单
 */

import React, { Component } from 'react';
import { Modal,Form,Input,Button,message,Upload,Select    } from 'antd';
import { connect } from 'react-redux';
import { idcardCheck } from './AccountInfoRedux';
import { postAuthenInfo,nationalList } from '../../api/personal';
import upload from '../../assets/07_05.add.png';
import { withRouter } from 'react-router-dom';
import SFRZ1 from '../../assets/SFRZ1.jpg';
import SFRZ2 from '../../assets/SFRZ2.png';

import intl from 'react-intl-universal';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

class PassPort extends Component {

    constructor(props){
        super(props);
        this.state = {
            fileList: [],
            fileList2: [],
            fileList3: [],
            imageUrl:'',
            imageUrl2:'',
            imageUrl3:'',
            lock:false,
            country:[]
        }
    }


    componentDidMount(){
        this.getCountry();
    }

    getCountry(){
        nationalList().then(res=>{
            if(res.status === 1){
                this.setState({
                    country:res.data
                })
            }else{
                message.info(res.msg);
            }
        })
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
        
        const { getFieldProps, validateFields,setFieldsValue } = this.props.form;


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


        const checkPass1 = (rule, value, callback) => {
            if (value) {
                if( value.length < 5 || value.length > 17 ){
                    callback(intl.get('护照长度不对'));
                }else{
                    const myreg1 = /^[a-zA-Z]{5,17}$/;
                    const myreg2 = /^[a-zA-Z0-9]{5,17}$/;
                    if(myreg2.test(value) || myreg2.test(value)){
                        callback()
                    }else{
                        callback(intl.get('护照号码不正确'));
                    }
                }
            }
            callback();
        }

        const familyNameProps = getFieldProps('familyName', {
            rules: [
                {required: true,whitespace: true,message:  intl.get('请输入姓氏')},
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
                {required: true,whitespace: true,message: intl.get('请输入护照号码')},
                { validator: checkPass1 },
            ],
        });

        const countryProps = getFieldProps('nationalityId', {
            rules: [
              { required: true, message: intl.get('请选择您的国籍') },
            ],
        });

        const frontUrlProps = getFieldProps('frontUrl', {
            valuePropName: 'fileList',
            normalize: this.normFile,
            rules: [
                { required: true, message: intl.get('请上传本人护照封面照片') },
              ],
        });

        const versoUrlProps = getFieldProps('versoUrl', {
            valuePropName: 'fileList',
            normalize: this.normFile,
            rules: [
                { required: true, message: intl.get('请上传本人护照个人信息页照片') },
              ],
        });

        const handUrlProps = getFieldProps('handUrl', {
            valuePropName: 'fileList',
            normalize: this.normFile,
            rules: [
                { required: true, message: intl.get('请上传个人签字照') },
              ],
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
                console.log('信息填写有误');
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
        
        const countrys = this.state.country.length?this.state.country.map((e,i)=>{
            return <Option value={e.id}>{e.countryName}</Option>
        }):null


        return(
            <div className="pass-port">
                <FormItem
                {...formItemLayout}
                label={intl.get('姓氏')}
                >
                <Input {...familyNameProps} type="text" autoComplete="off"
                    onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop} placeholder={intl.get('请输入护照上的姓氏')} 
                />
                </FormItem>

                <FormItem
                {...formItemLayout}
                label={intl.get('名字')}
                >
                <Input  {...realNameProps} type="text" autoComplete="off"
                    onContextMenu={noop}  onPaste={noop} onCopy={noop} onCut={noop} placeholder={intl.get('请输入护照上的名字')}
                />
                </FormItem>

                <FormItem
                {...formItemLayout}
                label={intl.get('选择国家')}
                >
                <Select {...countryProps} placeholder={intl.get('搜索或直接选择')} >
                    {countrys}
                </Select>
                </FormItem>

                <FormItem
                {...formItemLayout}
                label={intl.get('请输入护照ID号码')}
                >
                <Input {...numberProps}  type="text" autoComplete="off" placeholder={intl.get('请填写正确的护照号码')}
                    onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                />
                </FormItem>

                <FormItem
                label={intl.get('本人护照封面照片')}
                {...formItemLayout}
                >
                <Upload 
                    {...frontUrlProps} 
                    action="/coinex-interface/api/sys/authenticationUpload"  
                    listType="picture-card" 
                    fileList={this.state.fileList}  
                    onChange={handleChange}
                    onPreview={this.handlePreview}
                    accept="image/jpeg"
                    beforeUpload={this.beforeUpload}
                >
                {this.state.fileList.length >= 1 ? null : uploadButton}  
                </Upload>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel} className="showPic">
                    <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                </Modal>
                </FormItem>

                <FormItem
                label={intl.get('本人护照个人信息页照片')}
                {...formItemLayout}
                >
                <Upload  
                    {...versoUrlProps} 
                    action="/coinex-interface/api/sys/authenticationUpload"  
                    listType="picture-card" 
                    fileList={this.state.fileList2}  
                    onChange={handleChange2}
                    onPreview={this.handlePreview}
                    accept="image/jpeg"
                    beforeUpload={this.beforeUpload}
                >
                {this.state.fileList2.length >= 1 ? null : uploadButton}  
                </Upload>
                </FormItem>

                <p className="lastUpTip"><span>{intl.get('护照签名照1')} </span>{intl.get('护照签名照2')}<i>Coinex8</i>{intl.get('签名照3')}<i>{intl.get('签名照4')}</i>{intl.get('签名照5')}</p>
                
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
                {this.state.fileList3.length >= 1 ? null : uploadButton}  
                </Upload>   
                <div style={{marginRight:'8px'}}>
                    <img src={SFRZ1} alt=""/>
                </div>
                <div>
                    <img src={SFRZ2} alt=""/>
                </div>
                {/*<a href="https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png" target="_blank" className="upload-example">
                    <img alt="example" src="https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png" />
                    <span>{intl.get('示例')}</span>
                </a>*/}
                </FormItem>

                <FormItem wrapperCol={{ span: 8, offset: 9 }}>
                    <Button type="primary" style={{ width:'400px',height:'40px' }} disabled={this.state.lock} onClick={handleSubmit}>{intl.get('提交')}</Button>
                </FormItem>
            </div>
        )
    }
}
PassPort = createForm()(PassPort)

const actionCreators = { idcardCheck }

export default withRouter(connect(
    null,
    actionCreators
)(PassPort))