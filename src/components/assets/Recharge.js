/**
 * 资产管理充值页面
 */
import React, { Component } from 'react';
import { Icon,Input,Button, Pagination , message} from 'antd';
import { getAllCoin, setActiveCoinId } from './GetallCoinRedux';
import { connect } from 'react-redux';
import moment from 'moment';
import { precision_zero } from '../../utils';
import intl from 'react-intl-universal';

//自定义组件
import CommonSelect from '../shared/CommonSelect';

//css
import './Recharge.scss';

//api
import { GetRecharge,  GetRechargeAddr } from '../../api/funds';

//变量
const QRCode = require('qrcode.react');



class Recharge extends Component{

    constructor(props){
        super(props);
        this.state = {
            coinList:[
                {
                    name:'BTC交易区', 
                    data:[
                            {
                                coinId:12,
                                coin:'OF/BTC',
                                icoinUrl:'http://'
                            }, 
                            {
                                coinId:123,
                                coin:'OF/BTC',
                                icoinUrl:'http://'
                            }, 
                            {
                                coinId:124,
                                coin:'OF/BTC',
                                icoinUrl:'http://'
                            }, 
                        ]
                },
                {
                    name:'ETH交易区', 
                    data:[
                            {
                                coinId:125,
                                coin:'OF/ETH',
                                icoinUrl:'http://'
                            }, 
                            {
                                coinId:126,
                                coin:'OF/ETH',
                                icoinUrl:'http://'
                            }, 
                            {
                                coinId:127,
                                coin:'OF/ETH',
                                icoinUrl:'http://'
                            }, 
                        ]
                },
                {
                    name:'USDT交易区', 
                    data:[
                            {
                                coinId:128,
                                coin:'OF/USDT',
                                icoinUrl:'http://'
                            }, 
                            {
                                coinId:1,
                                coin:'OF/USDT',
                                icoinUrl:'http://'
                            }
                        ]
                },
            ],
            note:[],
            freeze: 0,
            total: 0,
            usable:0,
            address: '',
            coinName:'BTC',
            coinIcon:'',
            numPerPage:12,
            currentPage:1,
        }
       
    }


    componentDidMount() {
        this.props.getAllCoin();   
        this.getRechargeList(1);
     
        this.getRechargeAddr(this.props.allCoins.activeCoinid);
     
        this.setState({
            coinIcon: this.props.allCoins.icoinUrl
        })
    }
        //分页
    pageOnChange = (page, pageSize) => {
         this.setState({
            currentPage:page,
        })
        this.getRechargeList(page);
    }

    //获取充值记录
    getRechargeList(page, id){
        const coinId = id?id:this.props.allCoins.activeCoinid;
        GetRecharge({numPerPage: this.state.numPerPage, pageNum:page , rechargeRecord:{coinId:coinId}}).then(data=>{
            if(data.data && data.data.length) {
                const Rechargelist = data.data.map((item,index)=>{
                    return {
                        key: index,
                        ID: item.id,
                        walletAddr: item.address,
                        num: item.quantity,
                        time: moment(item.createTime).format('YYYY-MM-DD hh:mm:ss'),
                        state: item.status===0?intl.get('审核中'):intl.get('已充值'),
                        dealTime: moment(item.processingTime).format('YYYY-MM-DD'),
                        tradeId: item.tradeNumber,
                        showDetails: false  
                    }    
                })
                this.setState({
                    note:Rechargelist,
                    total:data.page.totalCount,
                })
            } 
            
            
        });
    }


    //获取充值地址
    getRechargeAddr(activeCoinid){
        GetRechargeAddr(activeCoinid).then(data=>{
            if(data.data) {
                this.setState({
                    address:data.data.address
                })
            }else{
                message.destroy();
                message.info(data.msg);
                this.setState({
                    address: ''
                })
            }
            
        });
    }

    //选取币
    coinClick = (coinId, coinName, coinIcon) => {
       
        const fundsData = this.props.funds.srcData;
        const currentCoinData = fundsData.filter((item) => {
               
            return item.coinBasicInfoDo.id === coinId
        });
       
        this.props.setActiveCoinId(coinId, coinName, currentCoinData[0].total, currentCoinData[0].frozen_fmt, currentCoinData[0].total_fmt, coinIcon);
      
        this.setState({
            coinName:coinName,
            coinIcon:coinIcon
        });
     
        this.getRechargeAddr(coinId);
        this.getRechargeList(coinId,1);
    }
     
    render(){
        
        const { coinList, activeCoinid, activeCoinName, count, freeze, useable,  } = this.props.allCoins;

        const rechargeList = coinList.filter(e=>e.rechargeStatus === 1);
       
        const recordDate = this.state.note.length?this.state.note.map( (item,index)=>{
            return (
                        <tbody key={index+"zxvv"}>
                            <tr key={index+100+Math.random()+'a'}>
                                <td>{item.ID}</td>
                                <td>{item.walletAddr}</td>
                                <td>{item.num}</td>
                                <td>{item.time}</td>
                                <td>{item.state}</td>
                                <td>
                                    <a
                                        key={index+10+Math.random()+'cccddd'}
                                        href="javascript: void(0);" 
                                        onClick={this.showDetails.bind(this,index)} 
                                        className={item.showDetails?'show':''}>
                                        {intl.get('详情')} <Icon type="caret-up" />
                                    </a>
                                </td>
                            </tr>
                            <tr  key={index+Math.random()+'ccc'}
                                className="recode-detail" 
                                style={{ display: item.showDetails?'':'none'}}
                            >
                                <td colSpan="2">{intl.get('钱包处理时间')}：{item.dealTime}</td>
                                <td colSpan="4">{intl.get('区块链交易ID')}：{item.tradeId}</td>
                            </tr>
                        </tbody>
                  
            )
        }):<tbody><tr><td colSpan="7"  style={{textAlign:'center',color:'#808080',paddingTop: '60px'}} >{intl.get('暂无充值记录')}</td></tr></tbody>

        return (
            <div className="recharge-wrap">
                <div className="assets-wrap-top">
                    <div className="coin-search-wrap">
                        <CommonSelect 
                            coinList={rechargeList}
                            coinName={activeCoinName}
                            coinIcon={this.state.coinIcon}
                            coinClick={this.coinClick.bind(this)}
                            activeCoinIndex={activeCoinid}
                        />
                    </div>
                    <ul className="clear coinAssets">
                        <li className="lineBox">{intl.get('总额')}<br/><span>{precision_zero(count, 8)}</span></li>
                        <li className="lineBox">{intl.get('冻结')}<br/><span className="freeze">{precision_zero(freeze, 8)}</span></li>
                        <li>{intl.get('可用')}<br/><span>{precision_zero(useable, 8)}</span></li>
                    </ul>
                </div>
                <div className="address clear">
                    <div className="address-copy">
                        <p>{intl.get('这是钱包地址，请将您的')}<span>{activeCoinName}</span>{intl.get('转入到此地址')}</p>
                        <p className="link"><Input ref='address' value={this.state.address} onChange={this.adsChange} /><Button  onClick={this.copyLink.bind(this)}><i className="copy_icon"></i>{intl.get('复制地址')}</Button></p>
                    </div>
                    <div className="qrcode"><QRCode  value={this.state.address} renderAs="svg" size={120} /></div>
                </div>
                <div className="tips">
                    <h4>{intl.get('温馨提示')}</h4>
                    <ul>
                        <li><span></span><span>{intl.get('温馨提示1')}</span></li>
                        <li><span></span><span>{intl.get('温馨提示2')}</span></li>
                        <li><span></span><span>{intl.get('温馨提示3')}</span></li>
                       {/*  <li>•<span>最小充值数量为：0.015 {activeCoinName} 。</span></li> */}
                    </ul>
                </div>
                <h3>{intl.get('充值记录')}</h3>
                <table className="record">
                    <thead className="record-head">
                        <tr>
                            <th>ID</th>
                            <th>{intl.get('钱包地址')}</th>
                            <th>{intl.get('转入数量')}</th>
                            <th>{intl.get('发送时间')}</th>
                            <th>{intl.get('状态')}</th>
                            <th>{intl.get('操作')}</th>
                        </tr>
                    </thead>
                   
                        {recordDate}
                   
                    
                </table>
                <div style={{marginTop:30,display:'flex',justifyContent:'center',paddingBottom:30}}> 

                    <Pagination 
                            showQuickJumper={true}
                            current={this.state.currentPage} 
                            total={this.state.total} 
                            onChange={this.pageOnChange}
                            pageSize={this.state.numPerPage}
                            hideOnSinglePage={true}
                    />
                </div>
            </div>
        )

    }

    //点击复制密钥
    copyLink() {
        const link = this.refs.address.input;
        link.select(); 
        document.execCommand("copy");
        message.success(intl.get('复制成功'))
    }


   //显示充值详情
   showDetails(key){
        const nowDetail = this.state.note.map( (item,index)=>{
            if(index === key){
                item.showDetails = !item.showDetails;
                return item;
            }
            item.showDetails = false;
            return item;
        });
        
        this.setState({
            note: nowDetail
        })
        
    }
}


const mapStatetoProps = (state)=>{
    return {
        allCoins: state.assets.GetallCoin,
        funds:state.assets.Funds
    }
}

const actionCreators = { getAllCoin, setActiveCoinId };

export default connect(
    mapStatetoProps,
    actionCreators
)(Recharge);