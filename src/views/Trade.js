/* 
    交易页面
    TradeTabs: 交易页交易区 组件
    TradePricesList: 交易区 右侧买卖 盘列表
    NewTradeList: 最新成交记录
    TradeInpPannel: 交易面板 
    DelegateTabsPannel:委托记录
    TradingView: k线图
    ContralTitle: TABS组件 用于K线 深度图切换
    DeepChart: 深度图
*/

//css
import './Trade.scss';
//import './Trade_light.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { is, fromJS, List, Map } from 'immutable';
import { Avatar } from 'antd';
import cs from 'classnames';
import $ from 'jquery';
import qs from 'querystring';
import Websocket from 'react-websocket';
import  moment from 'moment';
import { message } from 'antd';
import intl from 'react-intl-universal';


//utils
import { addTotal, times,  _LocalStorage, setSymbol, setPrecision, createdSymbol, numToString } from '../utils';

//自定义组件
import TradeTabsList from '../components/trade/TradeTabsList';
import TradePriceList from '../components/trade/TradePriceList';
import NewTradeList from '../components/trade/NewTradeList';
import TradeInpPannel from '../components/trade/TradeInpPannel';
import DelegateTabsPannel from '../components/trade/DelegateTabsPannel';
import TradeviewPage from '../tradingview/TradeviewPage';
import ContralTitle from '../components/shared/ContralTitle';
import DeepChart from '../components/trade/DeepChart';


/* action */
import { SAVE_COIN_LOCAL_ACTION, GET_COIN_DATA, EMIT_UPDATA_COINAREA, DIS_CHANGE_COIN , SAVE_EXCHANGE_RATA_EX} from '../components/trade/TradeTabsListRedux';
import { ACTION_ALL_DELE_DATA, ACTION_HIS_DELE_DATA, UPDATE_DELEGATE_CUR,  UPDATE_DELEGATE_HIS} from '../components/trade/DelegateTavsPannelRedux';
import { SET_COIN_PRICE, SET_COIN_BALANCE } from '../components/trade/TradePriceListRedux';
import { CLEAR_LOGIN_ACTIONS } from './LoginRedux';

//api
import { validate } from '../api/home';
import {cacelEntrust} from '../api/trade';

class Trade extends Component {
    state = {
       data: Map({
            hdInfo: {np: 0,hp:'--',cp:'--',tp:'--',ud:'--',vo:'--',vot:'--', lp:'--', pricePre:8, quanPre:8 },
            buy:List(),
            sale: List(),
            record:List(),
            deleHistory:List(),
        }), 
        buys:[],
        sales:[],
        cacelEntrustLock:false,
        sun: true,
        list:[intl.get('K线图'), intl.get('深度图'), intl.get('币种介绍')], //'深度图', '币种类介绍', '查看专业K线'
        index:0,
        pannelHdList:[
                {
                name:intl.get('当前委托'),
                columns:[
                    {
                        title: intl.get('时间'),
                        dataIndex: 'ti',
                        key: 'ti',
                        render: (text, record) => <span >{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
                    }, 
                {
                    title: intl.get('交易对'),
                    dataIndex: 'na',
                    key: 'na',
                }, {
                    title: intl.get('类型'),
                    dataIndex: 'ty',
                    key: 'ty',
                    render: (text, record) => <span className={record.ty===1?'sale':'buy'}>{record.ty===1?intl.get('卖出'): intl.get('买入')}</span>
                },
                {
                    title: intl.get('价格'),
                    key: 'pr',
                    dataIndex:'pr', 
                },
                {
                    title: intl.get('已成交'),
                    key: 'yq',
                    dataIndex:'yq', 
                },
                {
                    title: intl.get('未成交'),
                    key: 'nq',
                    dataIndex:'nq', 
                },
                {
                    title: intl.get('状态'),
                    key: 'st',
                    dataIndex:'st', 
                    render: (text, record) => <span >{this.formatStateText(record.st)}</span>
                },
                {
                    title: intl.get('操作'),
                    key: 'control',
                    dataIndex:'control', 
                    render:(text, record) =>(<span className="control" onClick={(e) => this.cacelEntrust(e, record)}>{intl.get('撤销')}</span>)
                },
                ],
              dataSource:[]
                
            },
            {
                name:intl.get('历史委托'),
               
                columns:[
                        {
                                
                            title: intl.get('时间'),
                            dataIndex: 'ti',
                            key: 'sss',
                            render: (text, record) => <span key='aa7' >{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
                        }, 
                        {
                            title: intl.get('交易对'),
                            dataIndex: 'na',
                            key: 'aaa',
                        }, {
                            title: intl.get('类型'),
                            dataIndex: 'ty',
                            key: 'ccc',
                            render: (text, record) => <span key='aa2' className={record.ty===1?'sale':'buy'}>{record.ty===1?intl.get('卖出'): intl.get('买入')}</span>
                        },
                        {
                            title: intl.get('价格'),
                            key: 'ddd',
                            dataIndex:'pr', 
                        },
                        {
                            title: intl.get('已成交'),
                            key: 'fff',
                            dataIndex:'yq', 
                        },
                        {
                            title: intl.get('未成交'),
                            key: 'eeee',
                            dataIndex:'nq', 
                        },
                        {
                            title: intl.get('数量'),
                            key: 'zzz',
                            dataIndex:'qu', 
                        },
                        {
                            title: intl.get('状态'),
                            key: 'qqqq',
                            dataIndex:'st', 
                            render: (text, record) => <span key='aa1' >{this.formatStateText(record.st)}</span>
                        },
                      
                    ],
                    dataSource:[]
                }
        ],
        delegateCurrent: 0,
        delegateCurType: 'all',
        wsUrl:'',
        pricePre:0, // 买价格精度
        quanPre:0, //卖价格精度
        validateLock:false,
        scollBg:"#3C4A59",
        wsLock:false, // 控制K线图socket
        deepChartLock: false //控制是否渲染深度图
    }   
   

    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {}, thisState = this.state || {};
        if( Object.keys(thisProps).length !== Object.keys(nextProps).length ||
             Object.keys(thisState).length !== Object.keys(nextState).length) {
              
            return true;
        }
        
        for (const key in nextProps) {
            if (!is(thisProps[key], nextProps[key])) {
               
                return true;
            }
          }
        
          for (const key in nextState) {
            if (thisState[key] !== nextState[key] || !is(fromJS(thisState[key]), fromJS(nextState[key]))) {
               
                return true;
            }
          }

          return false;
    }
    //format委托状态文字
    formatStateText = (state) => {
        switch(state) {
            case 1:
            return intl.get('未成交');
            case 2:
            return intl.get('部分成交');
            case 3:
            return intl.get('完全成交');
            default :
            return intl.get('撤销');
        }
    }
    //切换 k线
    tabsClickHandel = (index) => {
     
        this.setState({
            index: index
        });
    
        let pos = 0;
        if(index === 0) {
            pos = 0;
            window.widget.onChartReady(() => {
                window.hasWsMessage = false;
                window.widget.remove();
                window._createWidget();

            })
        } else if(index === 1 ) {
            pos = '62px';
        } else if(index === 2){

            this.props.history.push(`/coin?symbol=${this.props.coinAreaData.coin}`);
        } else {
            const search = qs.parse(this.props.location.search)['?na'];
            const url = search ? "/klineTrade?na="+search : '/klineTrade';

            this.props.history.push(url);
        }

       $('#kchartTriangle').css({
            transform:`translate3d(${pos}, 0px, 0px)`
       });   
    }

    //撤销委托
    cacelEntrust = async (e, record) => {
       
      if(this.state.cacelEntrustLock)  return;
     
      this.setState({
        cacelEntrustLock:true
      })
      message.destroy()
       const res = await cacelEntrust(record.id);
       
       this.setState({
        cacelEntrustLock:false
      })

       message.info(res.msg);
      /*  let a = {};
       this.props.delegateData.all.forEach(item => {
           if(item.id === record.id) {
           
              a = Object.assign(a, item);
              a.st = 3;
           }
       }); */  
    }
    
    //websocket 获取数据
    handleData = (data) => {
            if(data === 'pong') return;
            const result  = JSON.parse(data);

           
            
            if(result.hasOwnProperty('type')) {
                    const entrust =  result.entrust ?  result.entrust :[];

                    entrust.forEach( (item, index) => {
                        item.key = index;
                        item.control ="撤销"
                    });

                      //底部委托数据
                        this.props.saveDelegateDates(result.entrust || []);
                        this.props.saveDelegateHis(result.history || []);
                  
                  
                    const deleHistoryDatas = [].concat(this.state.pannelHdList);
                        deleHistoryDatas[0].dataSource = this.props.delegateData.all || [];
                        deleHistoryDatas[1].dataSource = this.props.delegateData.allHis || [];

                        this.setState({
                            pannelHdList:deleHistoryDatas,
                            pricePre:result.pricePre, // 买价格精度
                            quanPre:result.quanPre //卖价格精度

                        })
                        
                     
                        window._pricePre = Number(result.pricePre)
                        window._quanPre = Number(result.quanPre)
                      
               
                //买盘数据
                var buy, sale;
                if( result.pool) {
                     buy = result.pool.buy? this.setData(JSON.parse(JSON.stringify(result.pool.buy)), 'id'):[];
                     sale = result.pool.sell? this.setData(JSON.parse(JSON.stringify(result.pool.sell)), 'id'):[];
                }
               
                this.setState({
                    data: this.state.data.update('hdInfo' , v => result.real || [])
                        .set('buy',this.mergeData(result.pool ?result.pool.buy : [], 'pr', 'qu'))
                        .set('sale',this.mergeData(result.pool ?result.pool.sell : [], 'pr', 'qu','small'))
                        .set('record', result.record || []),
                    buys:buy,
                    sales:sale,
                });
                
               
                //获取余额
                this.props.setBalance('areaBalance', result.regAmount);
                this.props.setBalance('coinBalance', result.coinAmount);
                this.props.setBalance('coinRate', result.coinRate);
                this.props.setBalance('regRate', result.regRate);
                //获取推荐价格
                
                const buyP = this.mergeData(result.pool?result.pool.buy : [], 'pr', 'qu').toArray();
               
                const saleP = this.mergeData(result.pool?result.pool.sell:[], 'pr', 'qu','small').toArray();
                this.getPrice('salePrice', saleP.length ? saleP[0].pr: 0);
                this.getPrice('buyPrice', buyP.length? buyP[0].pr : 0);
                
            } else {
             
               
                if(result.entrust) {
                    //获取余额
                    this.props.setBalance('areaBalance', result.regAmount);
                    this.props.setBalance('coinBalance', result.coinAmount);
                }
            
              this.updateState((Object.keys(result)), result,
                                this.real,
                                this.record,
                                this.pool, 
                                this.delegateCur, 
                                this.delegateHis);
              
            }


            /* this.setState({
                    deepChartLock: true,
                }) */
 
    }
     //买卖盘实时数据更新
    pool = (result) => {
       
        if(result && result.buy) {
          
            if((Map.isMap(this.state.buys) &&  this.state.buys.size) ) {
              
                result.buy.forEach(item => {
                    if(Number(item.re) !== 3 && Number(item.re) !== 4) {
                        if(this.state.buys.get(String(item.id))) {
                            this.setState({
                                buys:this.state.buys.update(String(item.id), v => item),
                                data: this.state.data.update('buy',  (v) =>   this.mergeData(this.state.buys.set(String(item.id), item), 'pr', 'qu'))
                            })
                        } else {
                            this.setState({
                                buys:this.state.buys.set(String(item.id), item),
                                data: this.state.data.update('buy',  (v) =>   this.mergeData(this.state.buys.set(String(item.id), item), 'pr', 'qu'))
                            })
                        }
                       
                    } else {
                        if(this.state.buys.get(String(item.id))) {
                            this.setState({
                                buys:this.state.buys.delete(String(item.id)),
                                data: this.state.data.update('buy',  (v) =>   this.mergeData(this.state.buys.delete(String(item.id)), 'pr', 'qu'))
                            })
                        } /* else {
                            if(Number(item.re) !== 3 && Number(item.re) !== 4) {
                                this.setState({
                                    buys:this.state.buys.set(String(item.id), item),
                                    data: this.state.data.update('buy',  (v) =>   this.mergeData(this.state.buys.set(String(item.id), item), 'pr', 'qu'))
                                })
                            }
                           
                        } */
                    }
                })
                 
               
            } else if (Object.prototype.toString.call(this.state.buys) === '[object Array]' || this.state.buys === undefined) {

                    let a = Map();
                    result.buy.forEach( item => {
                        if(Number(item.re) !== 3 && Number(item.re) !== 4) {
                            a = a.set(String(item.id),   item)
                            this.setState({
                                data: this.state.data.update('buy',  (v) =>   this.mergeData(a.set(String(item.id), item), 'pr', 'qu'))
                            })
                        }  
                    })

                    this.setState({
                        buys:a,
                        
                    });

                   
                }   else {
                    result.buy.forEach( item => {
                
                        if(this.state.buys.get(String(item.id))) {
                            //部分成交则更新数据, 暂时重新计算 以后有时间优化 
                            if(Number(item.re) !== 3 && Number(item.re) !== 4) {
                                this.setState({
                                    buys: this.state.buys.update(String(item.id), item),
                                    data: this.state.data.update('buy',  (v) =>   this.mergeData(this.state.buys.update(String(item.id), v => item), 'pr', 'qu'))
                                })
                            } else {

                                this.setState({
                                    buys: this.state.buys.delete(String(item.id)),
                                    data: this.state.data.update('buy', v => this.mergeData(this.state.buys.delete(String(item.id)), 'pr', 'qu'))
                                })
                            }
                        } else  {
                            if(Number(item.re) !== 3 && Number(item.re) !== 4) {
                                this.setState({
                                    buys: this.state.buys.update(String(item.id), v => item),
                                    data: this.state.data.update('buy', v => this.mergeData(this.state.buys.update(String(item.id), v => item), 'pr', 'qu'))
                                })
                            } 
                            
                        } 
                    })
                }
            }

          
            
        
       
   
        if(result && result.sell) {
        
            if(Map.isMap(this.state.sales) && this.state.sales.size) {
            
                result.sell.forEach(item => {
                    if(Number(item.re) !== 3 && Number(item.re) !== 4) {
                        if(this.state.sales.get(String(item.id))) {
                            this.setState({
                                sales:this.state.sales.update(String(item.id), v => item),
                                data: this.state.data.update('sale',  (v) =>   this.mergeData(this.state.sales.update(String(item.id), v =>item), 'pr', 'qu', 'small'))
                            })
                        } else {
                            this.setState({
                                sales:this.state.sales.set(String(item.id), item),
                                data: this.state.data.update('sale',  (v) =>   this.mergeData(this.state.sales.set(String(item.id), item), 'pr', 'qu', 'small'))
                            })
                        }
                           
                    } else {
                       
                        if(this.state.sales.get(String(item.id))) {
                         
                            this.setState({
                                sales:this.state.sales.delete(String(item.id)),
                                data: this.state.data.update('sale',  (v) =>   this.mergeData(this.state.sales.delete(String(item.id)), 'pr', 'qu','small'))
                            })

                        } /* else {

                           if(Number(item.re) !== 3 && Number(item.re) !== 4) {
                                this.setState({
                                    sales:this.state.sales.set(String(item.id), item),
                                    data: this.state.data.update('sale',  (v) =>   this.mergeData(this.state.sales.set(String(item.id), item), 'pr', 'qu', 'small'))
                                })
                           }   
                        } */
                    }
                  
                })
                 
               
            }   else if ( Object.prototype.toString.call(this.state.sales) === '[object Array]' || this.state.sales === undefined) {

                    let a = Map();
                    result.sell.forEach( item => {
                        if(Number(item.re) !== 3 && Number(item.re) !== 4) {
                            a = a.set(String(item.id),   item)
                            this.setState({
                                data: this.state.data.update('sale',  (v) =>   this.mergeData(a.set(String(item.id), item), 'pr', 'qu', 'small'))
                            })
                        }  
                    })
                    this.setState({
                        sales:a
                    });

           
         } else {

                result.sell.forEach( item => {
                    if(this.state.sales.get(String(item.id))) {
                        //部分成交则更新数据, 暂时重新计算 以后有时间优化 
                        if(Number(item.re) !== 3 && Number(item.re) !== 4) {
                        
                            this.setState({
                                sales: this.state.sales.update(String(item.id), item),
                                data: this.state.data.update('sale', v => this.mergeData(this.state.sales.update(String(item.id), v =>item), 'pr', 'qu', 'small'))
                            })
                            
                        } else {
                            
                            this.setState({
                                sales: this.state.sales.delete(String(item.id)),
                                data:this.state.data.update('sale', v => this.mergeData(this.state.sales.delete(String(item.id), item), 'pr', 'qu', 'small'))
                            })
                        }
                    } else  {
                        if(Number(item.re) !== 3 && Number(item.re) !== 4) {
                            this.setState({
                                sales: this.state.sales.update(String(item.id), v => item),
                                data: this.state.data.update('sale', v => this.mergeData(this.state.sales.update(String(item.id), v => item), 'pr', 'qu', 'small'))
                            })
                        }
                        
                    }
                }) 
            }

        }
    }
    //更新头部实时数据
    real = (result) => {
        
        this.setState({
            data: this.state.data.update('hdInfo', v =>result)
        })
    }
    //更新历史最新成交记录实时数据
    record = (result) => {
       
        this.setState({
            data:this.state.data.update('record', v => {
             
                if(v.length <= 50) {
                    v.unshift(result);   
                } else {
                    v.unshift(result); 
                    v.pop();
                }
                return v.concat([]);
            })
        })
    }

    //实时更新底部历史委托及当前委托
    delegateCur = (result) => {
      
        result.key=(Math.random()*100).toString(36)+'aa';  
        result.control = intl.get('撤销');  
     
        this.props.updateDeleCur(result, this.state.delegateCurType);
      
     
        if(this.state.delegateCurType === 'allHis') return;
    
        const deleHistoryDatas = [].concat(this.state.pannelHdList);
       

        if(this.state.delegateCurType === 'buy'){
            deleHistoryDatas[0].dataSource = [].concat(this.props.delegateData.buy);
            
        }

        if(this.state.delegateCurType === 'sale'){
            deleHistoryDatas[0].dataSource = [].concat(this.props.delegateData.sale);
          
        }

        if(this.state.delegateCurType === 'all') {
            deleHistoryDatas[0].dataSource = [].concat(this.props.delegateData.all);
         
        }

        this.setState({
            pannelHdList:deleHistoryDatas
        })

    }

    delegateHis = (result) => {
      
        this.props.updateDeleHis(result, this.state.delegateCurType);
        
        const deleHistoryDatas = [].concat(this.state.pannelHdList);
       
        if(this.state.delegateCurType === 'all') return;

        if(this.state.delegateCurType === 'buyHis'){
            deleHistoryDatas[1].dataSource = this.props.delegateData.buyHis;
            
        }

        if(this.state.delegateCurType === 'saleHis'){
            deleHistoryDatas[1].dataSource = this.props.delegateData.saleHis;
          
        }
        if(this.state.delegateCurType === 'allHis') {
          
            deleHistoryDatas[1].dataSource = this.props.delegateData.allHis;
        };
        
        this.setState({
            pannelHdList:deleHistoryDatas
        })
    }

    //更新实时数据
    updateState = (type, data,  ...rest) => {
       type.forEach( v => {
            rest.forEach( fn => {
            
                if(fn.type === v) {
                    this.fn =  fn.bind(this);
                    this.fn((data[v]));
                  
                }
            })
       })
       
       
    }

    sendMessage = (msg) => {
       if(this.refWebSocket.state.ws.readyState === 1 && msg) {
            this.refWebSocket.state.ws.send(msg)
       }
       
    }
   

    //计算汇率
    calculateEX = (pr) => {
      
        const ls = new _LocalStorage();
        var exRate = 1;
        const hdData = this.props.coinAreaData;
        
       // if(!Map.isMap(hdData.exRate))  
        hdData.exRate = Map(hdData.exRate);
        if(hdData.exRate.size === 0) return '$0';
        if(ls.get('lang')) {
            exRate = ls.get('lang')?hdData.exRate.get(ls.get('lang')):hdData.exRate.get('BTC');
           
        } else {
            
            //默认语言
            exRate =  hdData.exRate.get('zh_CN');
          
        }
        
        let val = times(times(hdData.exRate.get(hdData.coinArea), pr), ls.get('lang') === 'en_US'?1:exRate);

        if(val > 0 && val < 1) {
            val = numToString(val.toPrecision(2));
          
         } else {
         
             val = String(setPrecision(val, 2))
         }
 
        if(val.indexOf('.') > -1  && val.split('.')[1]) {
            
                const a = val.split('.');

                return (createdSymbol(ls.get('lang')) + a[0]+'.'+a[1])
        } else {
            return (createdSymbol(ls.get('lang')) + val)
        }
        
      // return  (this.createdSymbol(ls.get('lang').lang) + times(times(hdData.exRate.get(hdData.coinArea), pr), exRate?exRate:1))
        
    }

    handleOpen = () => {
        
        this.refWebSocket.state.ws.send(this.props.coinAreaData.id);
        this.tiemrs2= setInterval(() => {
            if(this.refWebSocket && this.refWebSocket.state.ws.readyState === 1)    {
                this.refWebSocket.state.ws.send && this.refWebSocket.state.ws.send('ping');
            }
           
           }, 5000)
      /*   if(this.props.coinAreaData.id) {
            this.refWebSocket.state.ws.send(this.props.coinAreaData.id)
        }      */
            //this.refWebSocket.sendMessage(215235193994434); 
    }
    
    //websocket 获取交易区数据
    areaHandleData = (data) => {
        if(data === 'pong') return;
        const res = JSON.parse(data);
        if(!res[1]) return;
        if(Object.prototype.toString.call(res) !==  "[object Array]") {
            this.props.updateCoin(res.id, res);
         
        } else {
           
                this.props.saveCoinData(JSON.parse(data), this.props.loginState);
             
                //保存交易对到store
                const search = qs.parse(window.location.search);
              
                if(search['?na']) {
                    const result = JSON.parse(data);
                    const na = search['?na'].replace('_', '/');
                
                    const ls = new _LocalStorage();
                    const url = ls.get('iconUrl')?ls.get('iconUrl'):'';
                    let obj = {};

                    result.forEach( item => {
                        if(item.data) {
                            item.data.forEach(val => {
                                if(val.na === na) {
                                    obj = val;
                                   
                                }
                               
                            })
                        } 
                    })
                   
                    this.props.changeCoin(obj);
                   
                  
                }   else {
                    
                    this.props.changeCoin(res[1].data[0]);
                   
                }
            
                this.setState({
                    wsLock:true
                })
                /* if( this.refWebSocket.state.ws.readyState === 1) {
                  
                    this.refWebSocket.state.ws.send(this.props.coinAreaData.id);
                    this.tiemrs2= setInterval(() => {
                        if(this.refWebSocket && this.refWebSocket.state.ws.readyState === 1)    {
                            this.refWebSocket.state.ws.send && this.refWebSocket.state.ws.send('ping');
                        }
                       
                       }, 5000)
                } */
               
        }
      
    }

    areaHandleOpen =() => {
        if(this.state.validateLock) return;
        validate().then(res => {
            if(res.data.loginstatus === 1) {
                this.setState({
                    validateLock:true
                })
            } else {
               // message.info(res.msg);
               this.setState({
                validateLock:false
            })
                this.props.clearLogin();
            }
            
            this.props.saveExRate(res.data);
            if(this.refWebSocketCoin && this.refWebSocketCoin.state.ws.readyState === 1) {
                this.refWebSocketCoin.state.ws.send(res.data.houseId); 
               // this.sendPing('timer2', this.refWebSocketCoin.state.ws);
                this.tiemrs= setInterval(() => {
                    if(this.refWebSocketCoin && this.refWebSocketCoin.state.ws.readyState === 1)    {
                        this.refWebSocketCoin.state.ws.send('ping');
                    }
                
                }, 5000)
            }
           
            
            
        })
       
      
    }

    //设置集合 
    setData = (arr, key) => {
        const hash = {};
        arr.forEach( item => {
            hash[item[key]] = item;
        })

        return Map(hash);
    }

    sendPing = (timer,webSocket) => {
        
        this[timer] = setTimeout( () => {
            if(webSocket && webSocket.readyState === 1) {
                webSocket.send('ping');
                this.sendPing();
            } else  {
                clearTimeout(this[timer]);
                this[timer] = null;
            }
        }, 5000)
      }
      
    //求和
    sumHandle = (arr, key,  number) => {
       if(!arr) return;
        const hash = {};
      
        arr.forEach( item => {
           if(item) {
         
                if(hash.hasOwnProperty(item[key])) {
                    Object.keys(hash).forEach( v => {
                        if(v === item[key]) {
                            hash[item[key]][number] =  addTotal( hash[item[key]][number], item[number]);
                            hash[item[key]].money =   times(hash[item[key]][number], hash[item[key]][key]);
                        }
                    })
                    
                } else {
                        hash[item[key]] = JSON.parse(JSON.stringify(item));
                        hash[item[key]].money =  times(hash[item[key]][number], hash[item[key]][key]);
                    }
                }
        })
           
     
        return Map(hash);
       
    }

    //排序
    mergeData = (arr, key,  number,sort) => {
        const a = arr ? arr:[];
        if(sort === 'small') return this.sumHandle(a, key,  number).sortBy(o => Number(o.pr)); 
        else return  this.sumHandle(a, key,  number).sortBy(o => -Number(o.pr));

    }


    componentDidMount() {
       
        const wsUrl = window.location.hostname;
        this.setState({
            wsUrl:wsUrl
        });
        //设置函数属性
       const dataType = ['real', 'record','pool', 'entrust', 'history'];
       const dataHandle = [this.real, this.record, this.pool, this.delegateCur, this.delegateHis];
       
       dataType.forEach( (item, index) => {
           dataHandle[index].type = item;
       });

       // const { Map } = require('immutable@4.0.0-rc.9')
    
    }


    //底部委托列表点击事件, 用于过滤买卖委托记录
    deleTabsHdClcik = (current,  type) => {
        
            const data = [].concat(this.state.pannelHdList);
            
            var dataType = 'all';
            if(current ===0) {
                dataType = type;
            } else {
                if(type === 'buy') {
                    dataType = 'buyHis';
                } else if (type === 'sale') {
                    dataType = 'saleHis';
                } else {
                    dataType = 'allHis';
                }
            }
            
            this.setState({
                delegateCurrent: current,
                delegateCurType: dataType,
            });
          
       
            data[current].dataSource = this.props.delegateData[dataType]
          
            this.setState({
                pannelHdList: data
            })
           
    }

    //点击委托列表设置交易盘价格
    getPrice = (type, price) => {
        
        if(type === 'buyPrice') {
            this.props.setPrice('salePrice', price);
        }   else {
            this.props.setPrice('buyPrice', price);
        } 
    }

    componentWillUnmount() {

       /*  if( this.refWebSocket && this.refWebSocket.state.ws.readyState === 1 ) {
            this.refWebSocket.state.ws.close();
        } 

        if(this.refWebSocketCoin && this.refWebSocketCoin.state.ws.readyState === 1 ) {
            this.refWebSocketCoin.state.ws.close();
        } */
        clearInterval(this.tiemrs);
        clearInterval(this.tiemrs2);
        this.mounted = false;
        this.tiemrs= this.tiemrs2= null;
        this.setState = (state,callback)=>{
            return;
          };  
    }

    //点击查看更多
    moreClick = (areaIndex) => {
       this.props.history.push(`/delegate?id=${this.props.coinAreaData.id}&type=0`)
    }

    //根据涨跌添加正负号 
    formatSymobol = (state) => {
     
        if(state === 1) {
            return "+";
        } else if (state === 0) {
            return '';
        } else {
            return '-';
        }
    }

    //切换CSS
    toggleCss = () => {
       
        let bg = '#3C4A59';
        if( this.state.sun) {
                bg = "#E5E5E5";
        } else {
                bg = '#3C4A59';
        }
        this.setState(preState => {
            return {
                sun:!preState.sun,
                scollBg:bg
            }
        })
        
        $('.container').toggleClass('light');
   /*      const style = this.state.sun ? {
            up: "rgba( 83, 185, 135, 1))",
            down: "rgba( 255, 77, 92, 1)",
            bg: "rgb(227, 236, 240)",
            grid: "rgb(227, 236, 240)",
            cross: "#9194A3",
            border: "rgba( 255, 77, 92, 1)",
            text: "#61688A",
            areatop: "rgba( 169, 220, 195, 1)",
            areadown: "rgba( 245, 166, 174, 1)"
        } : {
            
            up: "#589065",
            down: "#ae4e54",
            bg: "#1d1d29",
            grid: "#1f2943",
            cross: "#9194A3",
            border: "#4e5b85",
            text: "#61688A",
            areatop: "rgba(122, 152, 247, .1)",
            areadown: "rgba(122, 152, 247, .02)"
        } */
     
       
        window.widget.applyOverrides({
            "paneProperties.background": "rgb(227, 236, 240)"
   
        });

        $("iframe" ).contents().find('body').toggleClass('light');
    }

    render() {
        //获取state
        const { loginState }= this.props;
        const hdInfo = this.state.data.get('hdInfo');
        const buy =  this.state.data.get('buy').toArray();
        const sale =  this.state.data.get('sale').toArray();
        const record = this.state.data.get('record');
        const wsUrl = window.location.hostname === 'localhost' ? 'www.coinex8.com' :  window.location.hostname;
        const wsProtocol = window.location.protocol === 'http:'?'ws':'wss';
        const ty = this.state.data.get('record')[0]? this.state.data.get('record')[0].ty:-1;
       // console.log(window.performance.navigation)
        return (
            <div id="trade">
			
				<div className="trad-w">
				<div className="l">
					{/* 头部 */}
					<div className="trade-top">
						<div className="trade-top-l">
						{ /*   <Avatar
								src={this.props.coinAreaData.icon}
								size="large"
								style={{  verticalAlign: 'middle' }}
						/> */}
							<h3>
								<span className="trade-top-l-coin">{this.props.coinAreaData.coin}</span>
								<span className="trade-top-l-coin-area">/{this.props.coinAreaData.coinArea}</span>
							</h3>
						</div>
						<div className="trade-top-c">
							<dl>
								<dt>{intl.get("最新价")}</dt>
								<dd>
									<span className={cs({"buy-coin":ty === 0, 'sell-coin': ty===1}) }>{hdInfo.np} </span>
									<span>{this.calculateEX(hdInfo.np || 0)}</span>
								</dd>
							</dl>
							<dl>
								<dt>{intl.get("24H涨跌")}</dt>
								<dd>
									<span  className={setSymbol(hdInfo.tp, 'addColor')}>{this.formatSymobol(hdInfo.tp)}{hdInfo.ud ?hdInfo.ud: 0} %</span>
								</dd>
							</dl>
							<dl>
								<dt>{intl.get("24H最高价")}</dt>
								<dd>
									<span className="price">{hdInfo.hp} </span>
								</dd>
							</dl>
							<dl>
								<dt>{intl.get("24H最低价")}</dt>
								<dd>
									<span className="price">{hdInfo.lp} </span>
								</dd>
							</dl>
							<dl>
								<dt>{intl.get("24H成交量")}</dt>
								<dd>
									<span className="price">{hdInfo.vo} </span>
								</dd>
							</dl>
							<dl>
								<dt>{intl.get("24H成交额")}</dt>
								<dd>
									<span className="price">{hdInfo.vot} </span>
								</dd>
							</dl>
						</div>
						{/*<div className={cs("trade-top-r", { 'sun': this.state.sun })}></div>*/}
					</div>
                {/* 中间内容 */}
				<div className="trade-content">
                       	{/* 交易区  买卖盘*/}
                    <div className="trade-content-right">
                        <TradePriceList 
                            newPrice={hdInfo.np} //最新成交价
                            money={this.calculateEX(hdInfo.np || 0)}    // 折合价格
                            buy={buy} //委托盘 买
                            sale={sale} //委托盘 卖
                            exType={this.state.data.get('record')[0] || -1}
                            getPrice={this.getPrice}
                            coinName={this.props.coinAreaData.coin}
                            coinArea={this.props.coinAreaData.coinArea}
                            pricePre ={this.state.pricePre } // 买价格精度
                            quanPre={this.state.quanPre} //卖价格精度
                        />
                    </div> 
                    <div className="trade-content-center">
                        {/* chart */}
                        <div className="trade-content-center-t">
                           { this.state.wsLock? 
                                <ContralTitle
                                    list={this.state.list}
                                    index={this.state.index}
                                    tabsClickHandel={this.tabsClickHandel}
                                >
                                   {
                                       this.state.pricePre ?
                                            <TradeviewPage 
                                                {...this.props} 
                                                sun={this.state.sun}
                                                pricePre={this.state.pricePre} //价格精度
                                                quanPre={this.state.quanPre}//数量精度
                                            />:null
                                    }
                                   
                                   { 
                                    
                                    /*    this.state.deepChartLock ?  */
                                       <DeepChart
                                            buy={this.state.data.get('buy').valueSeq().toJS()}
                                            sale={this.state.data.get('sale').valueSeq().toJS()}
                                            pricePre={this.state.pricePre} //价格精度
                                            quanPre={this.state.quanPre}//数量精度
                                            index={this.state.index}
                                            height="398"
                                            bgcolor={'#223143'}
                                        />/* : null */
                                    }
                                </ContralTitle> : null}
                        </div>

                        {/* 交易操作面板 */}
                        <div className="trade-content-center-b">
                            {
                                <TradeInpPannel
                                    tradeStock={this.props.tradeStock}
                                    loginState={loginState}
                                    title={this.props.coinAreaData.coin}
                                    subTitle={this.props.coinAreaData.coinArea}
                                    coinAmount={this.props.tradeStock.coinBalance}
                                    regAmount={this.props.tradeStock.areaBalance}
                                    setBalance={this.props.setBalance}
                                    coinArea={this.props.coinAreaData.coinArea}
                                    setPrice={this.props.setPrice}
                                    buyPrice={this.props.tradeStock.buyPrice}
                                    salePrice={this.props.tradeStock.salePrice}
                                    id={this.props.coinAreaData.id}
                                    history={this.props.history}
                                    exChangeRate={this.calculateEX}
                                    buyFees={this.props.tradeStock.regRate}
                                    saleFees={this.props.tradeStock.coinRate}
                                    pricePre ={this.state.pricePre } // 买价格精度
                                    quanPre={this.state.quanPre} //卖价格精度
                                />
                            }
						</div>
					</div>
				</div>
			
			</div>
			
            <div>
                	{/* 交易区 */}
					<div className="trade-content-left">
                    <div className="trade-content-left-t">
                    
                        {
                            this.props.coinAreaData.id ?  
                            <TradeTabsList
                                    {...this.props}
                                    loginState={loginState}  
                                    saveCoinAction={this.props.saveCoin}
                                    data={this.props.coinAreaData}
                                    changeCoin={this.props.changeCoin}
                                    sendMessage={this.sendMessage}
                                    activeChart={this.state.index}
                                />:null
                        }
                    </div>

                {/* 最新成交记录 */}
                <div className="trade-content-left-b" >
                    <NewTradeList
                        scrollBg={this.state.scollBg}
                        record={record}
                        height={256}
                    />
                </div>
            </div>
         
			</div>  
        </div>
                
                {/* 委托列表 */}
                <div className="trade-bottom">
                    <DelegateTabsPannel  
                        pannelHdList={this.state.pannelHdList} 
                        deleTabsHdClcik={this.deleTabsHdClcik}
                        moreClick={this.moreClick}
                    />
                </div>

                {/* websocket     47.94.84.21    47.94.194.143  http://www.lyy.com*/}
              { 
                  this.state.wsLock?
                    <Websocket 
                        url={`wss://${wsUrl}/coinex-interface/trade`}
                        onMessage={this.handleData}
                        onOpen={this.handleOpen}
                        ref={
                                Websocket => {
                                this.refWebSocket = Websocket;
                        }}
                    />: ""
              }
                {/* 交易区websocket */}
               <Websocket 
                        url={`wss://${wsUrl}/coinex-interface/index`}
                        onMessage={this.areaHandleData}
                        onOpen={this.areaHandleOpen}
                        ref={
                                Websocket => {
                                this.refWebSocketCoin = Websocket;
                          }}
                /> 
            </div>
        )
    }
}

const mapStateToProps = ( state =>{
    return {
          coinAreaData:state.trade.coinArea,
          loginState: state.login.loginState,
          delegateData: state.trade.delegateDates,
          tradeStock:state.trade.tradeStock,
          ex_data:state.trade
    }
 })

 const mapStateTodispatch = ( dispatch => {
   return {
        saveCoin: (item, areaIndex) => dispatch(SAVE_COIN_LOCAL_ACTION(item, areaIndex)),
        saveDelegateDates:(data) => dispatch(ACTION_ALL_DELE_DATA(data)),
        saveDelegateHis:(data) => dispatch(ACTION_HIS_DELE_DATA(data)),
        saveCoinData:(data, login) => dispatch(GET_COIN_DATA(data, login)),
        updateCoin: (coin, data) => dispatch(EMIT_UPDATA_COINAREA(coin, data)),
        updateDeleCur:(data, types) => dispatch(UPDATE_DELEGATE_CUR(data, types)),
        updateDeleHis:(data,types) => dispatch(UPDATE_DELEGATE_HIS(data, types)),
        changeCoin: (data) => dispatch(DIS_CHANGE_COIN(data)),
        setPrice: (types, val) => dispatch(SET_COIN_PRICE(types, val)),
        setBalance: (types, val) => dispatch(SET_COIN_BALANCE(types, val)),
        clearLogin:() => dispatch(CLEAR_LOGIN_ACTIONS()),
        saveExRate:(data) => dispatch(SAVE_EXCHANGE_RATA_EX(data)),
   }
 });
export default connect(mapStateToProps, mapStateTodispatch, undefined, { pure: false})(Trade);
