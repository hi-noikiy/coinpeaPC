/* 
    分配收入详情
*/

import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import { Icon } from 'antd';

//scss
import './Details.scss'
import './Rebate.scss'

//api接口
import { rebate } from '../api/home';
import { message } from 'antd';



class Rebate extends React.PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            data: [{
                date: moment(1533199561).format('YYYY-MM-DD'),
                sea: 0.00512,
                allFee: 31025156.55,
                product: 222.2555,
                rebate: 222225446.22
            }],
            totaldistributed: 0, //总收入
            undistributed: 0, //分配折合
            pageNum:1,
            numPerPage:10,
            pltfrmCoinName:'BTC',
            awardPercentRelease:5100,
            awardPercentMining:8000

        }

    }

    componentDidMount(){
        this.getRebate();
    }


    //获取返还数据
    getRebate(pageNum=this.state.pageNum,){
        message.destroy();
        if(!pageNum) return message.info(intl.get('当前页是首页'));
        const { numPerPage } = this.state;
        rebate({pageNum,numPerPage}).then(res=>{
            if(res.status === 1){
                if(!res.data.dealPoundageDayReturns.length) return message.info(intl.get('暂无更多数据'));
                this.setState({
                    data:res.data.dealPoundageDayReturns,
                    pageNum,
                    pltfrmCoinName:res.data.pltfrmCoinName,
                    awardPercentRelease:res.data.awardPercentRelease,
                    awardPercentMining:res.data.awardPercentMining
                })
            }
        })
    }

    //翻页
    changeNum(type){
        const pageNum = type?(this.state.pageNum-1):(this.state.pageNum+1);
        this.getRebate(pageNum);
    }

    

    render() {

        const list = this.state.data.map((item, index) => {
            return ( 
                <li key = { `${index}+rebate` } >
                    <div> { item.statDate } </div> 
                    <div> { item.pltfrmCoinAveragePrice } </div> 
                    <div> { item.totalFee } </div> 
                    <div> { item.pltfrmCoinMiningTotal } </div> 
                    <div> { item.pltfrmCoinRebateTotal } </div> 
                </li>
            )
        });

        return ( 
            <div className = "details rebates" >
                <div className = "banner" >
                    <h2 > { intl.get('交易手续费返还') } </h2> 
                </div> 
                <section className = "banner-des" >
                    <h3 > { intl.get('返还规则') } </h3> 
                    <p> { intl.get('返还规则1') }{this.state.pltfrmCoinName}{ intl.get('返还规则1-0') }{this.state.awardPercentRelease/100+'%'}{ intl.get('返还规则1-1') }{this.state.pltfrmCoinName} { intl.get('返还规则1-2') }{this.state.awardPercentRelease/100+'%'}{ intl.get('返还规则1-3') }{this.state.pltfrmCoinName}{ intl.get('返还规则1-4') } </p> 
                    <p> { intl.get('返还规则2') }{this.state.awardPercentMining/100+'%'}{ intl.get('返还规则2-1') }{this.state.pltfrmCoinName}{ intl.get('返还规则2-2') }{this.state.pltfrmCoinName}{ intl.get('返还规则2-3') }{this.state.pltfrmCoinName}{ intl.get('返还规则2-4') } </p> 
                </section>

                <article className = "income-wrap" >
                    <h3> { intl.get('返还记录') } </h3> 
                    <ul className = "income-con" >
                        <li className = "income-list-head" >
                            <div > { intl.get('日期') } </div> 
                            <div> { intl.get('当日') }{this.state.pltfrmCoinName}{ intl.get('均价 (BTC)') } </div> 
                            <div> { intl.get('当日总手续费 (BTC)') } </div> 
                            <div > { intl.get('当日挖矿产出') } ({this.state.pltfrmCoinName})</div> 
                            <div > { intl.get('返佣产出') } ({this.state.pltfrmCoinName})</div> 
                        </li> 
                        { list } 
                    </ul> 
                    <div className = "pagechange" >
                        <span onClick={()=>this.changeNum(1)}> < Icon type = "left" /> { intl.get('上一页') } </span> 
                        <span onClick={()=>this.changeNum(0)}> { intl.get('下一页') } < Icon type = "right" /> </span> 
                    </div> 
                </article>

            </div>
        )
    }
}

export default Rebate;