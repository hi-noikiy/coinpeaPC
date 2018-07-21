/* 
    专业K线 交易页面
    Clock : 时钟组件
    KlineSelectCoin:选择币种
    Login:登录
    TradeviewPage:K线
    TradeInpPannel:交易面板
*/
import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import './KlineTrade.scss';
import { ACTION_IS_REMOVE_CLASS } from '../layouts/NavRedux';
import { setPrecision } from '../utils';
import $ from 'jquery';
import { is, fromJS } from 'immutable';

//组件部分
//import Clock from '../components/shared/Clock';
import KlineSelectCoin from '../components/KlineTrade/KlineSelectCoin';
import Login from '../components/shared/Login';
import TradeviewPage from '../tradingview/TradeviewPage';
import ContralTitle from '../components/shared/ContralTitle';
import DeepChart from '../components/trade/DeepChart';
import TradePriceList from '../components/trade/TradePriceList';
import NewTradeList from '../components/trade/NewTradeList';
import DelegateTabsPannel from '../components/trade/DelegateTabsPannel';
import TradeInpPannel from '../components/trade/TradeInpPannel';

class KlineTrade extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            list: ['K线', '深度图'],
            index: 0,
            pannelHdList:[
                {
                    name:'当前委托',
                    columns:[
                        {
                        title: '时间',
                        dataIndex: 'time',
                        key: 'time',
                        
                    }, 
                    {
                        title: '交易对',
                        dataIndex: 'trade',
                        key: 'trade',
                    }, {
                        title: '类型',
                        dataIndex: 'type',
                        key: 'type',
                        render: (text, record) => <span className={record.tradeType==='1'?'sale':'buy'}>{text}</span>
                    },
                    {
                        title: '价格(BTC)',
                        key: 'price',
                        dataIndex:'price', 
                    },
                    {
                        title: '已成交',
                        key: 'suc',
                        dataIndex:'suc', 
                    },
                    {
                        title: '未成交',
                        key: 'pendeng',
                        dataIndex:'pendeng', 
                    },
                    {
                        title: '状态',
                        key: 'state',
                        dataIndex:'state', 
                    },
                    {
                        title: '操作',
                        key: 'control',
                        dataIndex:'control', 
                        render:(text, record) =>(<span>{text}</span>)
                    },
                    ],
                  dataSource:[
                        {
                        key: '1',
                        time: '2018-02-24  11:33:34',
                        trade:'ETH/BTC',
                        type:'卖出',
                        tradeType:'1',
                        price:'0.1325',
                        suc:'20',
                        pendeng:'11',
                        state:'未成交',
                        control:'撤销',
                        }, 
                        {
                            key: '2',
                            time: '2018-02-24  11:33:34',
                            trade:'ETH/BTC',
                            type:'买入',
                            tradeType:'0',
                            price:'0.1325',
                            suc:'20',
                            pendeng:'11',
                            state:'已成交',
                            control:'撤销',
                       },
                       {
                        key: '3',
                        time: '2018-02-24  11:33:34',
                        trade:'ETH/BTC',
                        type:'买入',
                        tradeType:'0',
                        price:'0.1325',
                        suc:'20',
                        pendeng:'11',
                        state:'部分成交',
                        control:'撤销',
                        }, 
                        {
                            key: '4',
                            time: '2018-02-24  11:33:34',
                            trade:'ETH/BTC',
                            type:'买入',
                            tradeType:'0',
                            price:'0.1325',
                            suc:'20',
                            pendeng:'11',
                            state:'未成交',
                            control:'撤销',
                        },  
                        {
                            key: '5',
                            time: '2018-02-24  11:33:34',
                            trade:'ETH/BTC',
                            type:'卖出',
                            tradeType:'1',
                            price:'0.1325',
                            suc:'20',
                            pendeng:'11',
                            state:'未成交',
                            control:'撤销',
                        },  
                    ]
                    
                },
                {
                    name:'历史委托',
                    
                },
                {
                    name:'历史成交',
                    
                },
                {
                    name:'资产管理',
                    
                }
            ]
        }
    }

    componentDidMount() {
      
    }

    shouldComponentUpdate(nextProps, nextState) {

        const thisProps = this.props || {}, thisState = this.state || {};
       
      
        if( Object.keys(thisProps).length !== Object.keys(nextProps).length ||
             Object.keys(thisState).length !== Object.keys(nextState).length) {
              
            return true;
        }
        
        for (const key in nextProps) {
            if (!is(fromJS(thisProps[key]), fromJS(nextProps[key]))) {
                return true;
            }
          }
        
          for (const key in nextState) {
        
            if (thisState[key] !== nextState[key] || !is(fromJS(thisState[key]),fromJS(nextState[key]))) {
               
                return true;
            }
          }

          return false;
        
    }
    //移除class
    removeClass = () => {
        this.props.removeNavClass();
    }

    //切换 k线
    tabsClickHandel = (index) => {
     
        this.setState({
            index: index
        });
    
        let pos = 0;
        if(index === 0) {
            pos = 0;
        } else if(index === 1 ) {
            pos = '62px';
        } else {
            this.props.history.push("/trade/coin");
        }
       $('#kchartTriangle').css({
            transform:`translate3d(${pos}, 0px, 0px)`
       });
     
        
    }

    render() {
        return (
            <div className="KlineTrade ">
            {/* 头部 */}
                <nav className="ktrade-header-nav">
                    <div className="ktrade-header-nav-l">
                        <NavLink  to="/" exact onClick={this.removeClass} style={{marginRight:42}}>
                            <svg style={{width:150,height:38}}>
                                    <text
                                        textAnchor="middle"
                                        x="50%"
                                        y="90%" 
                                        className="hd-text hd-text_1"
                                    >
                                        CoinPea
                                    </text>
                                    <text
                                        textAnchor="middle"
                                        x="50%"
                                        y="90%" 
                                        className="hd-text hd-text_1"
                                    >
                                        CoinPea
                                    </text> 
                                    <text
                                        textAnchor="middle"
                                        x="50%"
                                        y="90%" 
                                        className="hd-text hd-text_2"
                                    >
                                        CoinPea
                                    </text> 
                                    <text
                                        textAnchor="middle"
                                        x="50%"
                                        y="90%" 
                                        className="hd-text hd-text_3"
                                    >
                                        CoinPea
                                    </text> 
                                    <text
                                        textAnchor="middle"
                                        x="50%"
                                        y="90%" 
                                        className="hd-text hd-text_4"
                                    >
                                        CoinPea
                                    </text>     
                                </svg>
                        </NavLink>
                       
                     </div>
                   <div className="ktrade-header-nav-r">
                        {/*  右侧币种信息列表  */}
                        <div className="coin-info-wrap">
                            <div className="coin-info-box">
                                <span>最新价</span>
                                <p>{setPrecision(0.0014443, 8)}</p>
                            </div>
                            <div className="coin-info-box">
                                <span>24h涨跌</span>
                                <p>-2.43%</p>
                            </div>
                            <div className="coin-info-box">
                                <span>24h最高价</span>
                                <p>{setPrecision(0.0014822, 8)}</p>
                            </div>
                            <div className="coin-info-box">
                                <span>24h最低价</span>
                                <p>{setPrecision(0.0014232, 8)}</p>
                            </div>
                            <div className="coin-info-box">
                                <span>24h成交量</span>
                                <p>{setPrecision(4148.14, 8)} BTC</p>
                            </div>
                        </div>
                        {/*  选择币  */}
                        <KlineSelectCoin />
                        {/* 登录 */}
                        <Login />
                   </div>
                </nav>
            {/* 内容 */}
                <div className="KlineTrade-content clearfix">
                {/* 左侧 */}
                    <section className="KlineTrade-content-l">
                    {/* K线及深度 */}
                        <ContralTitle
                            list={this.state.list}
                            index={this.state.index}
                            tabsClickHandel={this.tabsClickHandel}
                        >
                            <TradeviewPage />
                            <DeepChart height={612} top={40} bgcolor={'#223143'}/>
                        </ContralTitle>
                       <DelegateTabsPannel  pannelHdList={this.state.pannelHdList}/>
                    </section>
                    {/* 右侧 */}
                    <section className="KlineTrade-content-r">
                        {/* 右侧列表 */}
                        <div className="KlineTrade-content-r-t">
                            <TradePriceList style={{width:300}}/>
                            <NewTradeList height={566}/>
                        </div>
                        <div className="KlineTrade-content-r-b">
                            <TradeInpPannel />
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}




const mapStateToProps = ( state =>{
   
    return { 
        loginState: state.login.loginState
     }
    
 })
const mapDispatchToProps  = (dispatch ) => {
    return {
        removeNavClass:() => dispatch(ACTION_IS_REMOVE_CLASS())
    }
}; 

 export default connect(mapStateToProps, mapDispatchToProps)(KlineTrade);

//export default KlineTrade;
