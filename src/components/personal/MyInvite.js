/* 
    我的邀请内容页
*/

import React, { Component } from 'react';
import { Input,Button,Table,Modal ,message } from 'antd';
import moment from 'moment'
import friends from '../../assets/07_08.friends.png'
import commission from '../../assets/07_08.commission.png'
import inviteCode from '../../assets/11_01.chinese_card.png'
import './MyInvite.scss' 

// api
import { myInvite  } from '../../api/personal'

const QRCode = require('qrcode.react');

const columns1 = [{
    title: '邮箱',
    dataIndex: 'email',
}, {
    title: '时间',
    dataIndex: 'time',
}];
const columns2 = [{
    title: '佣金',
    dataIndex: 'money',
},{
    title: '邮箱',
    dataIndex: 'email',
}, {
    title: '时间',
    dataIndex: 'time',
}];

export class MyInvite extends Component {
    constructor(props){
        super(props);
        this.state = {
            id:'',
            link:'',
            friends:'',
            commission:'',
            Modal2Visible: false,
            data1: [],
            data2: [],
            copyPic:require('./../../assets/07_08.copy_button01.svg')
        }
    }

    componentDidMount() {
        var script = document.createElement('script');
        script.src = "http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=408841";
        document.body.appendChild(script);
        this.myInvite()
    }
    myInvite = async ()=>{
        const res= await myInvite();
        if(res.status === 1){
            if(res.data.inviteList){
                this.setState({
                    data1:res.data.inviteList,  
                })
            }
            if(res.data.detailList){
                this.setState({
                    data2:res.data.detailList
                })
            }
            this.setState({
                id:res.data.referrerId,
                link: `${res.data.url}?ref=${res.data.referrerId}`,
                friends:res.data.count,
                commission:res.data.BTCCount,  
            })
        }
    }
    //放大显示二维码
    showModel(){
        this.setState({
            Modal2Visible: true
        })
    }

    //隐藏全局二维码
    hideModel(){
        this.setState({
            Modal2Visible: false
        })
    }

    //合并图片
    getImg = ()=>{
        //生成二维码
        const  code = document.getElementById('code');
        var bgImg = new Image();
        bgImg.src = '/static/media/11_01.chinese_card.63d12725.png';     
        var canvas = document.getElementById('myCanvas');
        canvas.width = 415;
        canvas.height = 750;
        var ctx = canvas.getContext('2d');
        bgImg.crossOrigin = '*';
        var srcImg;
        ctx.rect(0,0,bgImg.width,bgImg.height);
        bgImg.onload = () =>{
            ctx.drawImage(bgImg,0,0,415,750);
            ctx.drawImage(code,143,256,code.width,code.height);
            srcImg = canvas.toDataURL("image/png");
            this.setState({
                codepic:srcImg,
                Modal2Visible: true
            })
        }

    }
 
    render() {
        const inviteList=this.state.data1.map((item,index)=>{
            return {
                key: index,
                email: item.email,
                time: moment(item.applyTime).format('YYYY-MM-DD hh:mm:ss'),
            }
        })
        const detailList=this.state.data2.map((item,index)=>{
            return {
                money: item.quantity,
                key: index,
                email: item.userName,
                time: moment(item.createTime).format('YYYY-MM-DD hh:mm:ss'),
            }
        })
        return (
            <div className="myinvite">
                <div className="myinvite-top clear">
                    <div className="myinvite-top-qrcode">
                        <QRCode  value={this.state.link}  id="code"  renderAs="canvas" size={this.state.size} width='120' height="120"/>
                        <a href="javascript:void(0);" onClick={this.getImg} className="scaleBtn">点击放大</a>
                        <canvas id="myCanvas" style={{display:'none'}}></canvas>
                        <Modal
                        wrapClassName="vertical-center-modal"
                        closable={false}
                        visible={this.state.Modal2Visible}
                        onCancel={this.hideModel.bind(this)}
                        >
                        <a href={this.state.codepic} download="invitecode.png"><img src={this.state.codepic} style={{width:'415'}} alt=""/></a>
                        </Modal>
                    </div>
                    <div className="myinvite-top-info">
                        <p><span>我的邀请ID：</span>{this.state.id}</p>
                        <p className="link"><span>邀请链接：</span><Input ref='link' value={this.state.link} onChange={this.changeLink} /><img src={this.state.copyPic} alt=''  onClick={this.copyLink.bind(this)} className="copyBtn"/></p>
                        <div id="share" style={{display:'none'}}>
                            <span>分享：</span>
                            <p  className="bdsharebuttonbox" data-tag="share_1">
                            <a className="bds_fbook" data-cmd="fbook" href="javascript:;"></a>
                            <a className="bds_twi" data-cmd="twi" href="javascript:;"></a>
                            <a className="bds_linkedin" data-cmd="linkedin" href="javascript:;"></a>
                            <a className="bds_tsina" data-cmd="tsina" href="javascript:;"></a>
                            <a className="bds_qzone" data-cmd="qzone" href="javascript:;"></a>
                            </p>     
                        </div>
                    </div>
                    <ul className="myinvite-top-data clear">
                        <li>
                            <h4><img src={friends} /><span>我的邀请</span></h4>
                            <span>{this.state.friends}</span>
                        </li>
                        <li>
                            <h4><img src={commission} /><span>我的资产</span></h4>
                            <span>{this.state.commission}</span>
                        </li>
                    </ul>
                </div>
                <div className="myinvite-middle clear">
                    <div className="myinvite-middle-one">   
                        <h4>邀请的朋友</h4>
                        <Table columns={columns1} pagination={false}  dataSource={inviteList} size="small" locale={{emptyText: '您暂无邀请好友记录' }}/>
                        
                    </div>
                    <div className="myinvite-middle-two">
                        <h4>最近返佣记录</h4>
                        <Table columns={columns2} pagination={false} dataSource={detailList} size="small" locale={{emptyText: '您暂无返佣记录' }} />
                    </div>
                </div>
                <div className="rule">
                    <h4>活动细则</h4>
                    <ul>
                        <li>•<span>活动期间可获得50%佣金返利，后续将根据实际情况对佣金比例进行调整。</span></li>
                        <li>•<span>一旦您推荐的人成功完成交易，佣金就会立刻返到您的账户。</span></li>
                        <li>•<span>我们保留随时对返佣活动规则进行调整的权利，但是对您推荐的好友数量没有限制。</span></li>
                        <li>•<span>被推荐人必须使用您的推荐链接、二维码或者推荐ID注册才可以。</span></li>
                    </ul>
                </div>
            </div>
        )
    }

     //点击复制密钥
    copyLink() {
        const link = this.refs.link.input;
        link.select(); 
        document.execCommand("copy");
        this.setState({copyPic:require('./../../assets/07_08.copy_button02.svg')})
        message.success('复制成功')
        
    }
}

export default MyInvite