import React, {Component} from 'react';
import TradeTabs from './TradeTabs.js';
import { Tabs , message, Slider} from 'antd';
import datafeedConfig from '../../utils/datafeed/datafeedConfig.js';
import { remove } from 'lodash';
import { _LocalStorage } from '../../utils/index.ts';
import { is, fromJS, toArray, entries  } from 'immutable';
import querystring from 'querystring';
import qs from 'querystring';
//api 
import { addSelect , delSelect } from '../../api/home.js';

//css
import './TradeTabsList.scss';

//变量
const TabPane = Tabs.TabPane;
let { symbolResolveJSON } = datafeedConfig;
export default class TradeTabsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coinId:3,
            checkedCoin:[],
            activeKey:'1'
        };
    }
    
    componentDidMount() {
         //初始化localstorage
         this.ls = new _LocalStorage();
       
         if(qs.parse(this.props.history.location.search)['?na']) {
            const na =qs.parse(this.props.history.location.search)['?na'].replace('_', '/');
            
            this.props.data.data.forEach((v, i) => {
               v.data.valueSeq().forEach(o => {
               
                    if(na === o.na) {
                       
                           this.setState({
                               coinId: o.id,
                               activeKey:i.toString()
                          })
                    }
               })
           })
         }
        
    
      
    }
   
    shouldComponentUpdate(nextProps, nextState) {
        
        if(!is(nextProps.data.data, this.props.data.data)) {
            return true;
        }
        if(JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data) ) {
         
            return true
        }

        if(JSON.stringify(nextState) !== JSON.stringify(this.state)) {
           
            return true
        }
        return false;
      /*   const thisProps = this.props || {}, thisState = this.state || {};
     
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
          return false; */
    }

    componentWillReceiveProps(nextProps) {
        
            this.setState({
                coinId:nextProps.data.id
            })
       
    }
    //添加自选
    select = (e, item, areaIndex) =>  {
       
        e.stopPropagation();

        item.isc  = !item.isc;
        //未登录 则保存在本地
        if(!this.props.loginState) {
            item.isc ? this.addLocalStore(item): this.removeLocalStore(item.id);
        } else {
            item.isc ? addSelect(item.id).then(res => {
              //  message.info(res.msg)
            }) : delSelect(item.id).then(res => {
              //  message.info(res.msg)
            }) ;
        }
        
        this.props.saveCoinAction({id:item.id, select:item.isc, areaIndex: areaIndex});
    
      /*   this.props.data.data[areaIndex].data.update(item.id.toString(), v => v.isc = 1 ) */
       
    }

    //本地存储自选
    addLocalStore = (coin) => {
        
        const lcdata = this.ls.get('checkedCoinArr') || {};
        lcdata[coin.id] = coin;
        this.ls.set('checkedCoinArr', lcdata);
    }

    //删除本地存储
    removeLocalStore = (coinId) => {
        
       
        const lcdata = this.ls.get('checkedCoinArr');
   
        if(lcdata[coinId]) {
           
            delete lcdata[coinId];
        }
    
       this.ls.set('checkedCoinArr', lcdata);
    }

    //交易页面 切换交易区 
    changeTardeArea = (val) => {
        this.setState({
            activeKey: val
        })
    }
    //选择币
    selectCoin = (e, coin) =>{
       
        e.stopPropagation();
       if(this.props.data.id === coin.id) return;
      
       if(this.props.activeChart === 0) {
           window.widget.onChartReady(() => {
                this.props.changeCoin(coin);
                this.props.sendMessage(coin.id);
                
                this.props.history.replace(`/trade?na=${coin.na.split('/')[0]+'_'+coin.na.split('/')[1]}`)
                window.hasWsMessage = false;
                //通过字符串的形式传入coinId和交易区Id
                // window.hasWsMessage = false; // 乱加的
            //   const a = window.location.pathname
                // window.location.href= `${a}?id=${coin.id}&na=${coin.na}&active=${this.state.activeKey}`;
             
              /*   window.widget.remove();
                window._createWidget(); */
              
               symbolResolveJSON['name'] =  coin.na.replace('/','_');
               symbolResolveJSON['ticker'] = coin.na.replace('/','_'); 
              // if(window._onResetCacheNeededCallback) window._onResetCacheNeededCallback();
               window.widget.chart().resetData();
              /*  window.widget.setSymbol(coin.na.replace('/','_'), '5', function(data) {
                    console.log(data)
                }) */
              
                this.setState({
                    coinId: coin.id
                });

            })
       } else {
           
            this.props.changeCoin(coin);
            this.props.sendMessage(coin.id);
            this.props.history.replace(`/trade?na=${coin.na.split('/')[0]+'_'+coin.na.split('/')[1]}`); //&active=${this.state.activeKey}
            this.setState({
                coinId: coin.id
            });
         
       }

    }


    render() {
       
       
        const paneList = this.props.data.data.map( (item, index) => {

                return (
                            <TabPane
                                tab={item.name}
                                key={(index).toString()}
                                
                            >
                                <TradeTabs 
                                    tradeList={item.data?item.data.toArray():[]}
                                    coinId={this.state.coinId}
                                    key={(index+1)*Math.random().toString(36)}
                                    selectCoin={this.selectCoin}
                                    areaIndex={index}
                                    saveCoin={this.select}
                                />
                            </TabPane>
                        )
        });
         
        return (
                <Tabs
                    size="default"
                    style={{ height: 444,width:280 }}
                    tabBarGutter="1"
                    activeKey={this.state.activeKey}
                    onChange={this.changeTardeArea}
                >
                    { paneList }
                </Tabs>
        )
    }
}