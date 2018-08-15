/* 
    模拟交易大赛首页
*/

import React, { Component } from 'react';
import {Table} from 'antd';
import intl from 'react-intl-universal';
import './Deal.scss'

import { tradList } from '../../api/activity'

// img
import banner from '../../assets/jieshao_bg.png'
import rank from '../../assets/jieshao_ico_huangguan.png'

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
}, {
  title: '账号',
  dataIndex: 'account',
}, {
  title: '涨幅%',
  dataIndex: 'gain',
}, {
  title: '资产总额（ USDT ）',
  dataIndex: 'assets',
}];
export class Deal extends Component {
    constructor(props){
        super(props);
        this.state = {
            richRankList: [],
            poolRankList: [],
            myRichRank: '',
            myPoolRank: '',
        }
    }

    componentDidMount() {
      const Timer = setInterval(() =>{
        let TimerDiff = (new Date(2018,8,0,0,0,0)) - (new Date());
        if (TimerDiff < 0) {
          clearInterval(Timer)
        }else {
          this.leftTimer(2018,8,17,0,0,0)
        }
      },1000); 
      // tradList({
      //   rankType:1,
      //   pageNum:1,
      //   numPerPage:100
      // }).then(res =>{
      //   console.log(res);
      //   this.setState({
      //     myRichRank: res.myRank,
      //     richRankList: res.data
      //   })
      // })
      // tradList({
      //   rankType:2,
      //   pageNum:1,
      //   numPerPage:100
      // }).then(res =>{
      //   console.log(res);
      //   this.setState({
      //     myPoolRank: res.myrank,
      //     poolRankList: res.data,
      //   })
      // })
    }
    

    leftTimer = (year,month,day,hour,minute,second) =>{ 
      var leftTime = (new Date(year,month-1,day,hour,minute,second)) - (new Date()); //计算剩余的毫秒数 
      var days = parseInt(leftTime / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数 
      var hours = parseInt(leftTime / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时 
      var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟 
      var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数 
      days = this.checkTime(days); 
      hours = this.checkTime(hours); 
      minutes = this.checkTime(minutes); 
      seconds = this.checkTime(seconds); 
      this.setState({
        days,
        hours,
        minutes,
        seconds
      })
    } 
    checkTime = (i) =>{ //将0-9的数字前面加上0，例1变为01 
      if(i<10) 
      { 
        i = "0" + i; 
      } 
      return i; 
    } 
    
 
    render() {
        const richRankList=this.state.richRankList.map((item,index)=>{
          return {
            key: index,
            rank: rank,
            account:userName,
            gain:increasely,
            assets:amount,
          }
        })
        const poolRankList=this.state.richRankList.map((item,index)=>{
          return {
            key: index,
            rank: rank,
            account:userName,
            gain:increasely,
            assets:amount,
          }
        })
        return (
            <div className="deal">
                <div className='act_banner'>
                    <img src={banner} alt=""/>
                    <div id='timer'>
                      {this.state.days}:{this.state.hours}:{this.state.minutes}:{this.state.seconds}
                    </div>
                </div>
                <div className='act_caption'>
                    <h1 className='caption_title'>//&nbsp;&nbsp;活动说明&nbsp;&nbsp;//</h1>
                    <ul className='caption_content'>
                        <li className='items'>
                            <span>1</span>活动时间：8月17日14:00开启全球公测模拟交易大赛，持续到8月20日14:00 结束，为时72小时。
                        </li>
                        <li className='items'>
                            <span>1</span>启动资金：凡模拟大赛参赛用户将获得100,000USDT、100BTC和1,000ETH启动模拟资产，注册完成即发放到个人资产，最终活动奖励将按照用户资产总额USDT估值排名进行分配。
                        </li>
                        <li className='items'>
                            <span>1</span>模拟交易大赛奖励：总奖金池100万EX8和100ETH，由前50名和后50名共同瓜分。
                        </li>
                        <li className='items'>
                            <span>1</span>排名榜单将于每日整点更新一次，最终奖励结果按活动结束当天14:00排名为准。
                        </li>
                    </ul>
                    <div className='caption_btn'><a href="">查看活动详情 &gt;</a></div>
                </div>
                <div className='act_Leaderboard_title'>
                    <img src={rank} alt=""/>
                </div>
                <div className='act_Leaderboard_content'>
                    <div className='content_items'>
                        <h1>
                            富豪榜
                            <span>{this.state.myRichRank > 100? '未上榜':'我的排名：${this.state.myRichRank}名'}</span>
                        </h1>
                        <Table pagination={false} columns={columns} dataSource={richRankList} locale={{ 'emptyText': intl.get('暂无数据') }} />
                    </div>
                    <div className='content_items'>
                        <h1>
                            贫民榜
                            <span>{this.state.myPoolRank > 100? '未上榜':'我的排名：${this.state.myPoolRank}名'}</span>
                        </h1>
                        <Table 
                        pagination={false} 
                        columns={columns} 
                        dataSource={poolRankList} 
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