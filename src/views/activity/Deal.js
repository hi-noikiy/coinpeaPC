/* 
    模拟交易大赛首页
*/

import React, { Component } from 'react';
import {Table} from 'antd';
import intl from 'react-intl-universal';
import './Deal.scss'

// img
import banner from '../../assets/jieshao_bg.png'

const dataSource = [{
  key: '1',
  rank: '1',
  account: 10067,
  gain: '4.3',
  assets: '100w'
}, {
  key: '2',
  rank: '2',
  account: 18739,
  gain: '4.5',
  assets: '100w'
}];

const columns = [{
  title: '排名',
  dataIndex: 'rank',
  key: 'rank',
}, {
  title: '账号',
  dataIndex: 'account',
  key: 'account',
}, {
  title: '涨幅%',
  dataIndex: 'gain',
  key: 'gain',
}, {
  title: '资产总额（ USDT ）',
  dataIndex: 'assets',
  key: 'assets',
}];
export class Deal extends Component {
    constructor(props){
        super(props);
        this.state = {
            inviteInfo:{
                url:''
            },
            Modal2Visible: false,
            data1: [],
            data2: [],
            data3:[],
            copyPic:require('./../../assets/07_08.copy_button01.svg'),
            loginShow:false,
            bannerUrl:'',
            pagination:{
                total: 0,
                current:1,
                hideOnSinglePage:true,
                pageSize:10,
                showQuickJumper:true,
                next:1,
                pre:1,
                position:"bottom",
                onChange:this.getTabsData
            },
            pagination2:{
                total: 0,
                current:1,
                hideOnSinglePage:true,
                pageSize:10,
                showQuickJumper:true,
                next:1,
                pre:1,
                position:"bottom",
                onChange:this.getTabsData2
            },
            rules:''
        }
    }

    componentDidMount() {

    }

    
    
 
    render() {
        
        return (
            <div className="deal">
                <div className='act_banner'>
                    <img src={banner} alt=""/>
                </div>
                <div className='act_caption'>
                    <h1 className='caption_title'>//活动说明//</h1>
                    <ul className='caption_content'>
                        <li className='items'>
                            <span>1</span>活动期间: 8月12日14:00开启全球公测模拟交易大赛，持续到8月15日14:00结束，为时72小时。
                        </li>
                        <li className='items'>
                            <span>1</span>活动期间: 8月12日14:00开启全球公测模拟交易大赛，持续到8月15日14:00结束，为时72小时。
                        </li>
                        <li className='items'>
                            <span>1</span>活动期间: 8月12日14:00开启全球公测模拟交易大赛，持续到8月15日14:00结束，为时72小时。
                        </li>
                        <li className='items'>
                            <span>1</span>活动期间: 8月12日14:00开启全球公测模拟交易大赛，持续到8月15日14:00结束，为时72小时。
                        </li>
                    </ul>
                    <div className='caption_btn'><a href="">查看活动详情 &gt;</a></div>
                </div>
                <div className='act_Leaderboard_title'></div>
                <div className='act_Leaderboard_content'>
                    <div className='content_items'>
                        <h1>
                            贫民棒
                            <span>我的排名：100名</span>
                        </h1>
                        <Table pagination={false} columns={columns} dataSource={dataSource} locale={{ 'emptyText': intl.get('暂无数据') }} />
                    </div>
                    <div className='content_items'>
                        <h1>
                            贫民棒
                            <span>我的排名：100名</span>
                        </h1>
                        <Table 
                        pagination={false} 
                        columns={columns} 
                        dataSource={dataSource} 
                        locale={{ 'emptyText': intl.get('暂无数据') }} 
                        onRow={(record) => {
                            return {
                              onClick: () => {},       // 点击行
                              onMouseEnter: (e) => {
                                console.log(e)
                              },  // 鼠标移入行
                            };
                        }}
                        />
                    </div>
                </div>

            </div>
        )
    }
}


export default Deal;