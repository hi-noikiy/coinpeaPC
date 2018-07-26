/* 
    委托管理页面
    ManagemamntHd：头部组件
   SelectCoin:选择交易区及币
   Entrust：列表
*/

import React from 'react';
import './TrustManagemant.scss';
import TabHead from '../components/shared/TabHead';
import SelectCoin from '../components/shared/SelectCoin';
import Entrust from '../components/trustManagemant/EntrustList';
import Entrusttwo from '../components/trustManagemant/Entrusttwo';
import intl from 'react-intl-universal';

import { connect } from 'react-redux';

import { sortBy, forEach,} from 'lodash';

import { DatePicker, Button, message,  Spin, Icon, Pagination } from 'antd';

import { delegateNote,delegateList,cancelDelegate,succeededRecord } from '../api/delegate';

import moment from 'moment';

const antIcon = <Icon type="loading" style={{ fontSize: 28 }} spin />;


class TrustManagement extends React.Component {

    state = {
        disabledBtn:false,
        activeIndex: 0, //0委托 1成交
        titleR:[intl.get('委托记录'), intl.get('成交记录')],
        tabsTitle: intl.get('委托记录'),
        type: null, //0买 1卖
        isShowExState:false, //控制交易状态选择弹框
        tradeState: null,   //1未成交 2部分成交 3完全成交 4撤销
        coinList:[
            {
                "regionCoinRelations": [
                    {
                        "icoinUrl": 1,
                        "id": 215235193994434,
                        "sortName": "LTC",
                        "name": "LTC/ETH",
                        "coinId": 215234249924438
                    }
                ],
                "name": "ETH交易区",
                "coinName": "ETH",
                "coinId": 215234249924438,
                "id": 215234257627403
            }
        ],
        startValue: null,
        endValue: null,
        endOpen:false,
        hdListDelegate:[
                {name: intl.get('时间')},
                {name:intl.get('买')+'/'+intl.get('卖'), sort:1,flag:'trade'},
                {name: intl.get('价格')},
                {name: intl.get('委托数量')},
                {name:intl.get('成交数量')},
                {name:intl.get('状态'), sort:0, flag:'state'},
                {name:intl.get('操作')}
        ],
        bodyListDelegate1:[],
        hdListDelegate2:[
            {name:intl.get('时间')},
            {name:intl.get('买')+'/'+intl.get('卖'), sort:1,flag:'trade'},
            {name:intl.get('成交价格')},
            {name:intl.get('成交量')},
            {name:intl.get('成交金额')},
            {name:intl.get('手续费')}],
        bodyListDelegate2:[],
        total:0,  //总条数
        totalPage: 0, //总页数
        numPerPage:10, //每页条数
        pageNum:1,//当前页数
        loading:false,
        selectName:'ETH',
        activeCoinIndex: 215235193994434,
      
    }

    componentDidMount() { 
      
        const date = window.location.search.slice(1).split('&');
        let list = {};
        date.forEach((e,k)=>{
            const v = e.split('=');
            list[v[0]] = v[1]
        })
        this.setState({
            searchData : list
        })
       this.getCoinlist()  //获取委托列表

      
       
    }

    //撤销委托
    cancelDele = (id)=>{
        cancelDelegate({dealEntrust:id}).then(res=>{
            if(res.status === 1){
                message.info(intl.get('撤单申请成功'));
                this.getRecord();
            }else{
                message.info(res.msg)
            }
        })
    }

    //获取委托记录
    getDelegateNote(){
        const coinRelationId = this.state.activeCoinIndex;
        const startTime = this.state.startValue;
        const endTime = this.state.endValue;
        const memId = this.props.login.usrInfo.id;
        const status = this.state.tradeState;
        const numPerPage = this.state.numPerPage;
        const pageNum = this.state.pageNum;
        const type = this.state.type;
        delegateNote({pageNum,numPerPage,startTime,endTime,dealEntrust:{type,status,memId,coinRelationId}}).then(res=>{
            if(res.status === 1){
                this.setState({
                    bodyListDelegate1:res.data.entrust?res.data.entrust:[],
                    total:res.data.page.totalCount,
                    totalPage:res.data.page.totalPage,
                })   
                if(!res.data.entrust){
                  //  message.info('还没有数据！');
                }
            }else{
                message.info(res.msg)
            }

        })
    }

    //获取成交记录
    getSuccessRecord(){
        const coinRelationId = this.state.activeCoinIndex;
        const startTime = this.state.startValue;
        const endTime = this.state.endValue;
        const memId = this.props.login.usrInfo.id;
        const numPerPage = this.state.numPerPage;
        const pageNum = this.state.pageNum;
        const type = this.state.type;
        succeededRecord({type,pageNum,startTime,endTime,numPerPage,memId,dealSucceededRecord:{coinRelationId}}).then(res=>{
            if(res.status === 1){
                this.setState({
                    bodyListDelegate2:res.data.record?res.data.record:[],
                    total:res.data.page.totalCount,
                    totalPage:res.data.page.totalPage,
                })   
                if(!res.data.entrust){
                  //  message.info('还没有数据！');
                }
            }else{
                message.info(res.msg)
            }

        })
    }
    

    //搜索错误提示
    error = () => {
        message.error(intl.get('请选择开始和结束时间'),2,() =>{
            this.setState({
                disabledBtn:false
            })
        });
    }

    //获取币种列表
    getCoinlist(){
        delegateList().then(res=>{
            if(res.status === 1){
             
                this.setState({
                    coinList: res.data,
                    activeCoinIndex:res.data[0].regionCoinRelations[0].id,
                    selectName: res.data[0].coinName,
                })
                if(this.state.searchData.id){
                    let selectData;
                    res.data.map(e => {
                        const data1 = e.regionCoinRelations.filter(e=>e.id === Number(this.state.searchData.id));
                        if(data1.length){
                          selectData = data1[0]
                        }
                        return '';
                    });
                    if(selectData){
                        this.setState({
                            activeIndex: Number(this.state.searchData.type),
                            activeCoinIndex: Number(this.state.searchData.id)
                        })
                    }else{
                        message.info(intl.get('没有当前币种！'))
                    }
                    
                }
                this.getRecord();
            }else{
                message.info(res.msg);
            }
        })
    }





    //切换记录列表
    controlTabs = (index) => {      
        this.setState({
                activeIndex:index,
                tabsTitle:this.state.titleR[index],
                startValue:null,
                endValue:null,
                pageNum:1,
            })
            this.getRecord();
      
    }   
    //查询
    serachHandle = () => {
        if(!this.state.startValue || !this.state.endValue) {
            this.setState({
                disabledBtn:true
            })
            this.error();
        } else {
            this.setState({
                pageNum:1
            })
            this.getRecord();
        }
    }

    //页码改变
    pageOnChange = (page) => {
        this.setState({
            pageNum:page,
        })
        this.getRecord();
    }

    onChange = (field, value) => {
        this.setState({
          [field]: value,
        });
      
    }

    onStartChange = (value) => {
        this.onChange('startValue', value);
      }
    
    onEndChange = (value) => {
        this.onChange('endValue', value);
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }
    
    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }

    //选择币种
    coinClick = (e, id) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        this.setState({
            activeCoinIndex:id,
            startValue:null,
            endValue:null,
            pageNum:1,
            type:null
        })
        this.getRecord();
       
    }


    getRecord(){
        this.setState({
            loading:true
        })
        setTimeout(() => {
            if(this.state.activeIndex === 0){
                this.getDelegateNote();
            }else{
                this.getSuccessRecord()
            }
            this.setState({
                loading:false
            })
        }, 60);
    }

    //显示状态弹框
    showEXState = () => {
        
        this.setState((preState) => {
            return {
                isShowExState:!preState.isShowExState
            }
        })
    }

    //更改不同状态数据
    changeData=(flag)=>{
        if(flag === 4){
            this.setState({
                tradeState:4
            })
        }else if(flag === 1){
            this.setState({
                tradeState:1
            })
        }else if(flag === 2){
            this.setState({
                tradeState:2
            })
        }else if(flag === 3){
            this.setState({
                tradeState:3
            })
        }else if(flag === null){
            this.setState({
                tradeState:null
            })
        }
        // if(this.state.tradeState===1){
        //     this.setState({
        //         tradeState:2
        //     })
        // }else if(this.state.tradeState===2){
        //     this.setState({
        //         tradeState:3
        //     })
        // }else if(this.state.tradeState===3){
        //     this.setState({
        //         tradeState:4
        //     })
        // }else{
        //     this.setState({
        //         tradeState:1
        //     })
        // }
        this.setState({
            pageNum:1
        })
        this.getRecord();
    }

    //更改不同交易数据
    changeTradeData=(flag)=>{
      
        if(this.state.type===0){
            this.setState({
                type:1
            })
        }else{
            this.setState({
                type:0
            })
        }
        this.setState({
            pageNum:1
        })
        this.getRecord();

    }


    //结束日期区间    
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
          return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }



    render() {


        const { hdListDelegate, bodyListDelegate1, hdListDelegate2, bodyListDelegate2 } = this.state;
       
        return(
            <div className="trust">
                <div className="trust-content">
                    {/* 头部 */}
                     <TabHead 
                        breadText={this.state.titleR} 
                        columText={intl.get('委托管理')}
                        activeIndex={this.state.activeIndex}
                        changeTab={this.controlTabs.bind(this)}
                    />

                     {/* 搜索 */}
                     <div className="coin-search-wrap">
                        <SelectCoin 
                            coinList={this.state.coinList}
                            coinClick={this.coinClick}
                            activeCoinIndex={this.state.activeCoinIndex}
                            selectName={this.state.selectName}
                            activeIndex={this.state.activeIndex}
                        />
                        {/* 选择日期 */}
                         <div className="select-date">
                                <DatePicker
                                    className="my-datepiker"
                                    dropdownClassName="my-datepeker-dropdown"
                                    showToday={false}
                                    size="large"
                                    format="YYYY-MM-DD"
                                    value={this.state.startValue}
                                    placeholder={intl.get("请选择开始时间")}
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                    style={{verticalAlign:'bottom'}}
                                />
                                <span style={{marginRight:15, marginLeft:15}}>{intl.get("至")}</span>
                                <DatePicker
                                    className="my-datepiker"
                                    size="large"
                                    disabledDate={this.disabledEndDate}
                                    dropdownClassName="my-datepeker-dropdown"
                                    showToday={false}
                                    format="YYYY-MM-DD"
                                    value={this.state.endValue}
                                    placeholder={intl.get("请选择结束时间")}
                                    onChange={this.onEndChange}
                                    open={this.state.endOpen}
                                    onOpenChange={this.handleEndOpenChange}
                                    style={{verticalAlign:'bottom'}}
                                />
                                <Button size="large" type="primary"  style={{marginLeft:15,width:'80px',fontSize:'14px',borderRadius:0}} onClick={this.serachHandle} disabled={this.state.disabledBtn}>{intl.get("查询")}</Button>
                        </div>
                     </div>
                     <Spin 
                            indicator={antIcon}
                            spinning={this.state.loading}
                            delay={300}
                            
                     >
                        {
                            this.state.activeIndex === 0 ?
                            <Entrust
                                isShow={this.state.isShowExState}
                                showEXState={this.showEXState}
                                hdList={hdListDelegate}
                                bodyList={bodyListDelegate1}
                                changeTradeData={this.changeTradeData}
                                changeData={this.changeData}
                                cancelDele={this.cancelDele}
                               
                            />
                            :
                            <Entrusttwo 
                                hdList={hdListDelegate2}
                                bodyList={bodyListDelegate2}
                                changeTradeData={this.changeTradeData}
                            />

                        } 
                     </Spin>
                     <div style={{display:this.state.totalPage>1?'flex':"none",}} className="pageBox">
                                    <Pagination 
                                        showQuickJumper
                                        hideOnSinglePage
                                        current={this.state.pageNum} 
                                        total={this.state.total} 
                                        onChange={this.pageOnChange}
                                        pageSize={this.state.numPerPage}
                                    />
                    </div>
                </div>
            </div>
        )
    }
}



const mapStateToPorps=(state)=>{
 
    return {login:state.login}
}

export default connect(mapStateToPorps,null)(TrustManagement)