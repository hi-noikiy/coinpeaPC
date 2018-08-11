import React from 'react';
import { Modal, Form, Input, Icon, message, Button, Table, Tooltip   } from 'antd';
import moment from 'moment';
import cs from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import { getAllCoin , setActiveCoinId } from './GetallCoinRedux';
import { connect } from 'react-redux';
import { find } from 'lodash';
import { setPrecision, addTotal, precision_zero } from '../../utils'
import { withRouter } from 'react-router-dom'


import intl from 'react-intl-universal';

//css
import './Withdraw.scss';


//自定义组件
import CommonSelect from '../shared/CommonSelect';
import PriceInp from '../trade/priceInp';


//api
import { GetWithdraw, GetWithdrawAddr, GetAssetInfo, CancleWithdraw,createWithdrawAddr,delWithdrawAddr,WithdrawCoin, authentication, getPhonCode } from '../../api/funds';

//图片
import warn from "../../assets/06_04.notice.svg";
import google from "../../assets/06_04.google.svg";
import phone from "../../assets/06_04.phone.svg";



//变量
const FormItem = Form.Item;


class Withdraw extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visible:false,
            isShowAddAddress:false,
            showList: false,
            addressLabel:'',
            address:'',
            addr:intl.get('请输入钱包地址'),
            clock:false,
            quantity:'',
            phoneCode: '',
            times:60,
            reSend:false,
            getCode:intl.get('获取验证码'),
            coinName:'',
            coinIcon:'',
            GA:'',
            coinList:[],
            activeCoinid:1,
            freeze: 0,
            total: 0,
            usable:0,
            fees:0,
            withdrawPrecision:0,
            maxCount:0,
            minCount:0,
            list:[], //地址
            tipsList:[
                intl.get('提现温馨提示1'),
                intl.get('提现温馨提示2'),
                intl.get('提现温馨提示3'),
                intl.get('提现温馨提示4')
            ],
            dataSource:[],
            columns:[
                {
                    title:'ID',
                    dataIndex: 'id',
                    className: 'colum1'
                
                },
                {
                    title: intl.get('转出地址'),
                    dataIndex: 'address',
                    align:'center'
                },
                {
                    title: intl.get('转出数量'),
                    dataIndex: 'num',
                    render:( text, row, index) =>{
                        return <span>{text}</span>
                    }
                },
                {
                    title: intl.get('转出时间'),
                    dataIndex: 'time',
                    render:(text) => {
                        return <span style={{color:"#FF4B4B"}}>{moment(text).format('YYYY-MM-DD')}</span>
                    }
                },
                {
                    title:intl.get('状态'),
                    dataIndex: 'state',
                },
                {
                    title:intl.get('操作'),
                    dataIndex: 'handle',
                    className:'control',
                    render:(text,record) => {
                        return <span className={cs({"control-span": record.status === 1})} style={{color:"#FF4B4B", cursor:'pointer',}} onClick={e=>this.cancleWithdraw(record.id, record.status)} >{text}</span>
                    }
                },
            ],
            pagination:{
                total: 0,
                current:1,
                hideOnSinglePage:true,
                pageSize:15,
                showQuickJumper:true,
                next:1,
                pre:1,
                position:"bottom",
               
            },
            lockBtn:false,
            loading:false,
            rollFee:0,
            rollCount:0,
            hideGoogle:false,
            hidePhone:false,
            addrTip:intl.get('请输入提币地址')
        }
    }    

    componentDidMount() {
        //发送验证信息
        authentication()
        .then(res => {
            if(!res.data.gooleStauts && !res.data.noteAuthStatus)  {
                    this.setState({
                        visible: true
                    })
            }
            if(!res.data.gooleStauts) {
                this.setState({
                    hideGoogle:true,
                
                })
            } 
            
            if(!res.data.noteAuthStatus) {
                this.setState({
                    hidePhone:true
                })
            }

            if(!res.data.gooleStauts && !res.data.noteAuthStatus) {
               
                this.setState({
                    lockBtn:true
                })
            }
        });
        this.props.getAllCoin();
        //获取提币记录
        this.getWithdrawNote({numPerPage:this.state.pagination.pageSize, pageNum:this.state.pagination.next, withdrawRecord:{coinId: this.props.allCoins.activeCoinid}})
        /* if(this.props.coinName){
            this.props.allCoins.coinList.map(item=>{
                if(item.englishName === this.props.coinName){
                    this.props.setActiveCoinId(item.id);
                    console.log(this.props.allCoins);
                    
                }
            })
        } */
      
        this.getAssetInfo(this.props.allCoins.activeCoinid);

        /*this.getWithdrawNote(); */
        this.GetWithdrawAddr(this.props.allCoins.activeCoinid)//显示默认地址
        document.onclick= () => {
        
            if(this.state.showList) {
                this.setState({
                    showList:false,
                })
            }
            
        }
       
    }
    
    componentWillUnmount() {
        document.onclick = null;
    }
    //获取地址
    GetWithdrawAddr =async ( id )=>{
        const res =await GetWithdrawAddr(id);
       if(res.status === 1 && res.data) {
                this.setState({
                    list:res.data
                })
            }
    } 
    cancel = () => {
        this.setState({visible:false});
    }


    //显示地址列表
    isShowAddAddressHandle = (e) => {
       e.stopPropagation();
       e.nativeEvent.stopPropagation();
       e.nativeEvent.stopImmediatePropagation();

       
       if (!this.state.showList)  {
            this.GetWithdrawAddr(this.props.allCoins.activeCoinid);
       } 
     
        this.setState(preState => ({
            showList: !preState.showList,
            isShowAddAddress:false,
            address:""
        }))
    }

    //显示添加地址UI
    showAddAddress = (e) => {
        e.stopPropagation();
       e.nativeEvent.stopPropagation();
       e.nativeEvent.stopImmediatePropagation();

       if(this.state.isShowAddAddress) {
            return false;
       }

       this.setState({
           isShowAddAddress:true,
          
       });
     
    }
    
    //message关闭 回调
    deblocking = () => {
        this.setState({
            clock:false
        })
    }

    //添加地址
    addAddress = () => {
        if(this.state.clock) {
            return false;
        };
        this.setState({
            clock: true
        })
        if(this.state.addressLabel === '' && this.state.address === '') {
            message.warning(intl.get('请输入钱包标签及地址'), () => {
                this.deblocking();
            });
        } else if(this.state.addressLabel === '' && this.state.address !== '') {
            message.warning(intl.get('请输入钱包标签'), () => {
                this.deblocking();
            });
        } else if(this.state.addressLabel !== '' && this.state.address === '') {
            message.warning(intl.get('请输入钱包地址'), () => {
                this.deblocking();
            });
        } else {
            //遍历数组，查看是否含有相同的地址标签
            const isHasLabel = find(this.state.list, (o) => {
                return o.remark === this.state.addressLabel
            });
           
            if(isHasLabel){
                message.warning(intl.get('标签名重复，请重新填写'), () =>{
                   this.deblocking();
                });
            } else {
             
                const newAddress = {
                    remark:this.state.addressLabel,
                    address:this.state.address,
                    coinId:this.props.allCoins.activeCoinid,
                    coinName:this.props.allCoins.activeCoinName,
                    coinIcon:this.props.allCoins.activeicon
                }
                createWithdrawAddr(newAddress).then(res=>{
                    if(res.status === 1) {
                        message.success(intl.get('添加成功'), () => {
                            this.deblocking();
                        
                            this.setState((preState) => {
                             preState.list.unshift(res.data);
                               return {
                                    isShowAddAddress:true,
                                    addressLabel:'',
                                    address:'',
                                    list:preState.list
                               }
                            }) 
                        });
                    } else {
                        message.success(res.msg, () => {
                            this.deblocking();
                        });
                    }
                    
                })

               
                
            }
        
        }
    }

    //选择地址
    selectAdd = (index) => {
        this.setState({
            address: this.state.list[index].address,
            showList:false
        });
        // this.isShowAddAddressHandle();
    }

    //删除地址
    deletAdd = (e, id) => {

        e.stopPropagation();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        delWithdrawAddr(id).then(res=>{
            if(res.status === 1){
                message.success(intl.get('删除成功'));
                const data = this.state.list.filter(item=>{
                    return item.id !== id
                })        
                this.setState({
                    list:data
                })
            }else{
                message.error(res.msg);
            }
        });
     
        
    }
    //提币输入框
    addressChange = (key, value) => {
        console.log(value)
        if(key === "address" && value !== '') {
            const re = /^[A-Za-z0-9]{0,50}$/
            if(!re.test(value)) return;
        }

        if(key === "addressLabel" && value !== '') {
            const re = /^[\S]{1,5}$/;
            if(!re.test(value)) return;
        }
        
       

        if(key === 'quantity' && value !=='') {
            const re = /^[0-9]+([.]{1}[0-9]{0,8}){0,1}$/;
           
            if(!re.test(value)) return;
            
            this.setState({
                rollFee:value*this.state.fees,
                rollCount:value - value*this.state.fees,
            })
        }

        if(key === 'quantity' && !value) {
            this.setState({
                rollFee:0,
                rollCount:0,
            })
        }

        this.setState({
            [key]:value
        })
    } 

    //添加数量
    onChangeNum = (e, numDecimal) => {
     
        const { value } = e.target;
        const reg = new RegExp("^-?(0|[1-9][0-9]*)(\\.[0-9]{0," +numDecimal+"})?$");
        if ((!isNaN(value) && reg.test(value)) || value === '' ){
            this.setState({
                num:value
            })
        } 
    } 

    //表格分页事件
    getTabsData = (page) => {
        this.getWithdrawNote({numPerPage:this.state.pagination.pageSize, pageNum:page.current, withdrawRecord:{coinId: this.props.allCoins.activeCoinid}});
        this.setState({
            pagination:{
                current:page.current
            }
        })
    }
    //切换币种
    coinClick = (coinId, coinName, coinIcon) => {
        const fundsData = this.props.funds.srcData;
        const currentCoinData = fundsData.filter((item) => {   
            return item.coinBasicInfoDo.id === coinId
        });
        this.props.setActiveCoinId(coinId, coinName, currentCoinData[0].total, currentCoinData[0].frozen_fmt, currentCoinData[0].total_fmt, coinIcon);
        this.setState({
            coinName:coinName,
            coinIcon:coinIcon,
            address:''
        });

         //获取提币记录
         this.getWithdrawNote({numPerPage:20, pageNum:1, withdrawRecord:{coinId: coinId}})
        this.GetWithdrawAddr(coinId)//修改地址
        this.getAssetInfo(coinId);//获取币种信息
        
    }

    //获取短信验证码
    getPhoneCode = () => {
        if(this.state.reSend) return;
        
        this.setState({
            reSend:true
        })
        getPhonCode().then(res => {
            message.info(res.msg)
        })
        let siv = setInterval(() => {
            this.setState((preState) => ({
              times: preState.times - 1,
              getCode: `${intl.get('重新发送')}(${preState.times - 1}s)`,
            }), () => {
              if (this.state.times === 0) {
                     clearInterval(siv);
                     this.setState({
                        getCode:intl.get('重新发送'),
                        times:60,
                        reSend:false
                     })
              }
            });
          }, 1000)
    }

    //获取币种资产信息
    getAssetInfo(activeCoinid){
        GetAssetInfo().then(res=>{
                if(res.status === 1 && res.data) {
                    res.data.forEach(v => {       
                        if(v.coinBasicInfoDo.id === activeCoinid) {
                           
                            this.setState({
                                freeze:precision_zero(v.frozen_fmt, 8) ,
                                total: precision_zero(addTotal(v.frozen_fmt, v.total_fmt),8),
                                usable:precision_zero(v.total_fmt, 8),
                                fees:  precision_zero(v.coinBasicInfoDo.withdrawPoundage/100, 8),
                                withdrawPrecision:v.coinBasicInfoDo.withdrawPrecision,
                                maxCount:v.coinBasicInfoDo.maxQuantity,
                                minCount:v.coinBasicInfoDo.minQuantity
                            })
                            
                        }
                    });
                }
                this.setState({
                    allWdList:res.data
                })
            /* this.setState({
                freeze: data.asset.frozen,
                total: data.asset.total,
                usable:data.fee,
            }) */
        });
    }
    //提币
    withDrawCoin(){

        if(this.state.lockBtn) return;
        if(!this.state.GA && !this.state.hideGoogle) return message.warning(intl.get('请填写谷歌验证'));
        if(!this.state.phoneCode && !this.state.hidePhone) return message.warning(intl.get('请填写短信验证码'));
        if(!this.state.addr)return message.warning(intl.get('请填写地址'));
        if(!this.state.quantity) return message.warning(intl.get('请填写数量'));
        if(this.state.quantity < this.state.minCount || this.state.quantity > this.state.maxCount) return message.warning(`${intl.get('提现数量在')}${this.state.minCount}~${this.state.maxCount}${intl.get('之间')}`);
        
        const data = {
            gaCode: this.state.GA,
            phoneCode:this.state.phoneCode,
            withdrawRecord :{
                coinId: this.props.allCoins.activeCoinid,
                address: this.state.address,
                quantity: this.state.quantity,
                coinName: this.props.allCoins.activeCoinName

           }
        }
       
        WithdrawCoin(data).then(res => {
            
            this.setState({
                lockBtn:false
            })
            message.info(res.msg);
        });
    }

    // 撤消提币
    cancleWithdraw(id, status){
        if(status !== 1)  return;
        CancleWithdraw(id).then(data=>{
            message.info(data.msg, () =>{
                this.deblocking();
             });
             if(data.status === 1) {
                  //获取提币记录
                  this.getWithdrawNote({numPerPage:this.state.pagination.pageSize, pageNum:1, withdrawRecord:{coinId: this.props.allCoins.activeCoinid}});
             } else {
                    console.log(data);
             }
        })
    }

    //提币状态
    getWithdrawState = (state) => {
        switch(state) {
            case 1:
            return intl.get('等待提现');
            case 2:
            return intl.get('正在处理');
            case 3:
            return intl.get('提现成功');
            case 4:
            return intl.get('用户取消');
            default :
            return intl.get('提币中');
            
        }
    }
    //获取提币记录
    getWithdrawNote(params){
        this.setState({  loading : true })
        GetWithdraw(params).then(res=>{

        
         if(res.status === 1) {
             
                const WithdrawNote =res.data? res.data.map((item,index)=>{
                    return {
                        id: item.id,
                        address: item.address,
                        num: item.quantity_fmt,
                        time: item.createTime,
                        state: this.getWithdrawState(item.status),
                        handle:item.status===1?intl.get('撤消'):'',
                        key: index,
                        status: item.status
                    }
                }):[];
                
               
                this.setState({
                    dataSource: WithdrawNote,
                    loading:false,
                    pagination:{
                        total: res.page.totalCount,
                        hideOnSinglePage:true,
                        showQuickJumper:true,
                        next:res.page.nextPage,
                        pre:res.page.prePage,
                        pageSize:5,
                        position:"bottom",

                    }
                })
            } else {
                throw new Error('查询出错')
            }
        })
    }

    //跳转至验证页面
    redirect = (path) => {
        this.props.history.push(path)
    }

    render() {
        const { coinList, activeCoinid, activeCoinName, count, freeze, useable, icoinUrl } = this.props.allCoins;

        const withdrawList = coinList.filter(e=>e.withdrawStatus === 1);
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 3 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
          };
          
        
        //渲染地址列表
       
        const list = this.state.list.map( (item, index) => {
            return (
                <li key={index.toString(36)+Math.random()} 
                    onClick={(e) =>this.selectAdd(index)}
                >
                    <span style={{width:"20%"}} className="common-span" title={item.remark}>{item.remark}</span>
                    <span style={{width:"70%"}} className="common-span" title={item.address}>{item.address}</span>
                    <span 
                        style={{width:"10%", color:"#FF4B4B"}}
                        onClick={(e) => this.deletAdd(e, item.id)}
                    >
                    {intl.get('删除')}
                    </span>
                </li>
            )
        });

        // 提示列表
        const  tipsList = this.state.tipsList.map( (item, index) => {
            if(index === 0) {
                item += this.state.minCount;
            }
            if(index ===3) {
                item += this.state.fees*100+'%';
            }
            return (
                    <li key={(Math.random()*100+index.toString())}>
                        <span></span>
                        <span>{item}</span>
                    </li>
            ); 
        });

      
      
        return (
            <div className="withdraw-wrap">
            <div className="assets-wrap-top">
                <div className="coin-search-wrap">
                    <CommonSelect 
                            coinList={withdrawList}
                            coinName={activeCoinName}
                            coinIcon={icoinUrl}
                            coinClick={this.coinClick.bind(this)}
                            activeCoinIndex={activeCoinid}
                        />
                </div>
                <ul className="clear coinAssets">
                    <li>{intl.get('总额')}<br/><span>{precision_zero(count, 8)}</span></li>
                    <li>{intl.get('冻结')}<br/><span className="freeze">{precision_zero(freeze, 8)}</span></li>
                    <li>{intl.get('可用')}<br/><span>{precision_zero(useable, 8)}</span></li>
                </ul>
            </div>
            <Form 
                className="form-wrap"
                layout="horizontal"
            >
                <FormItem 
                    label={intl.get("钱包地址")}
                    {...formItemLayout}
                >
                   <div  
                        className={cs("wallet-wrap", {"wallet-wrap-show": this.state.showList})} 
                        onClick={(e) => { e.stopPropagation();
                                        e.nativeEvent.stopPropagation();
                                        e.nativeEvent.stopImmediatePropagation();}}
                        >
                        <div className="wallet-inp">
                            <Input 
                                className="placeHolader" 
                                placeholder={this.state.addr}
                                onChange={(e) => this.addressChange('address', e.target.value)}
                                value={this.state.address}
                            />
                           <span className="add-ico-wrap" onClick={(e) => this.isShowAddAddressHandle(e)}>
                                <Icon 
                                        type="caret-down" 
                                        style={{ fontSize: 12, color: '#8A8A8A' }}  
                                        className={cs("wallet-inp-icon", {"wallet-inp-icon-down":this.state.showList})}
                                        
                                    />
                           </span>
                        </div>
                        {
                            this.state.showList?
                            <div className={cs("wallet-list", {"wallet-list-show": this.state.isShowAddAddress})}>
                                {
                                    this.state.isShowAddAddress ? 
                                    <div className="add-address">
                                        <Input 
                                            placeholder={intl.get("填写备注")} 
                                            size="small" 
                                            value={this.state.addressLabel}
                                            onChange={(e) => this.addressChange('addressLabel', e.target.value)}
                                            style={{width:80, marginRight:12, borderRadius:0, height:26,fontSize:12}}
                                        />
                                        <Tooltip placement="topLeft"  trigger={['focus']} title={this.state.addrTip} >
                                            <Input 
                                                placeholder={intl.get("请输入钱包地址" )}
                                                size="small" 
                                                value={this.state.address}
                                                onChange={(e) => this.addressChange('address', e.target.value)}
                                                style={{width:220, borderRadius:0, height:26,fontSize:12}}
                                            />
                                        </Tooltip>
                                        <span 
                                            style={{color:"#3dadd9", fontSize:12, marginLeft:26}}
                                            onClick={this.addAddress}
                                        >
                                            {intl.get("确定")}
                                        </span>
                                    </div> :""  
                                }
                                <div className="add-address" onClick={(e) =>this.showAddAddress(e)}>
                                    <Icon type="plus-circle-o"  style={{ fontSize: 15, color: '#3DADD9' }} />
                                    <p>{intl.get("添加新的地址")}</p>
                                </div>
                              
                                <Scrollbars 
                                    style={{ width: "100%", height: 100, }}
                                    renderThumbVertical={({ style, ...props }) =>
                                    <div {...props} style={{ ...style, borderRadius:8,backgroundColor:'#E5E5E5', width: '5px', }}/>
                                    }
                                >
                                    <ul className="address-wrap">
                                        {list}
                                    </ul>
                                </Scrollbars>
                               
                            </div> : ""
                        }
                       
                   </div>
                </FormItem>
                {/* 转出数量输入框 */}
                <FormItem 
                    label={intl.get("转出数量")}
                    {...formItemLayout}
                >
                    <PriceInp
                        tooltip={intl.get("请输入数量")}
                        onChange={(e) => this.addressChange('quantity', e.target.value)}
                        value={this.state.quantity}
                        r_text={<div 
                                        style={{cursor:'pointer'}}
                                        onClick={(e) => this.addressChange('quantity', this.state.usable)}
                                >{intl.get("可用余额")}：<p>{this.state.usable}</p></div>}
                    />
                  
                </FormItem>
                {/* 费用 */}
                    <div className="fee">
                        <span>{intl.get("转出费用")}：{precision_zero(this.state.rollFee, this.state.withdrawPrecision)}</span>
                        <span>{intl.get("实际到账")}：{precision_zero(this.state.rollCount,  this.state.withdrawPrecision)}</span>
                    </div>
               {/* 手机验证码 */}
              {!this.state.hidePhone? <FormItem 
                    label={intl.get("手机验证码")}
                    {...formItemLayout}
                    className="phone" >
                        <Input placeholder={intl.get("请输入验证码")}  onChange={(e) => this.addressChange('phoneCode', e.target.value) } />
                        <Button className={this.state.reSend?'reSend':''} disabled={this.state.reSend} onClick={this.getPhoneCode}>{this.state.getCode}</Button> 
                </FormItem>:null}
                 {/* 谷歌验证码 */}
              {!this.state.hideGoogle?<FormItem 
                    label={intl.get("谷歌验证码")}
                    {...formItemLayout}
                    className="phone"
                >
                   <Input placeholder={intl.get("请输入谷歌验证码")}  onChange={(e) => this.addressChange('GA', e.target.value) } />
                </FormItem>:null}
                {/* 转出按钮 */}
                <FormItem
                    wrapperCol={{span: 8, offset: 3}}
                >
                    <Button 
                        style={{width:"100%", height:40, backgroundColor:"#3dadd9", color:"#fff"}}
                        onClick={e=>this.withDrawCoin()}
                        disabled={this.state.lockBtn}
                    >
                    {intl.get("确认转出")}
                    </Button>
                </FormItem>
            </Form>
            {/* 温馨提示 */}
            <div className="withdraw-tips-wrap">
                <h3>{intl.get("温馨提示")}</h3>
                <ul>
                   {tipsList}
                </ul>
            </div>
            {/* 提币记录 */}
            <div className="widthdraw-note">
                <h3>{intl.get("提币记录")}</h3>
                <Table
                    dataSource={this.state.dataSource} 
                    columns={this.state.columns} 
                    loading={this.state.loading}
                    onChange={this.getTabsData}
                    pagination={this.state.pagination}
                    locale={{emptyText: intl.get("暂无提币记录") }}
                />
            </div>
            {/* 谷歌验证提醒 */}
                <Modal
                    title=""
                    visible={this.state.visible}
                    onCancel={this.cancel}
                    footer={null}
                    wrapClassName="vertical-center-modal"
                >
                   <div className="modal-content-wrap">
                        <img src={warn} className="warning" alt="warning"  style={{width:60, height:52}} />
                        {/*<p className="top-p">{intl.get("提现验证")}</p>*/}
                        <p className="bottom-p">{intl.get("二次验证")}</p>
                        <div className="button-wrap">
                            <div className="my-custom_one-button" onClick={()=>this.props.history.push('/personal')}>
                                <img src={google} alt="google"/>
                                {intl.get("谷歌验证")}
                            </div>
                            <div className="my-custom_one-button" onClick={()=>this.props.history.push('/personal')}>
                                <img src={phone} alt="phone"/>
                                {intl.get("短信验证")}
                            </div>
                        </div>
                        {/* <p onClick={this.cancel} className="modal-tips">{intl.get("风险")}</p> */}
                   </div>
                </Modal>
            </div>
        )
    }
}

const mapStatetoProps = (state)=>{
    return {
        allCoins: state.assets.GetallCoin,
        funds:state.assets.Funds
    }
}

const actionCreators = { getAllCoin,setActiveCoinId };

export default withRouter(connect(
    mapStatetoProps,
    actionCreators
)(Withdraw))
