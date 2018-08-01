/* 
    专业K线页面 选择币种组件
*/

import React from 'react';
import './KlineSelectCoin.scss';
import { Tabs, Icon} from 'antd';
import datafeedConfig from '../../utils/datafeed/datafeedConfig.js';
import {  _LocalStorage } from '../../utils/index';
import { is } from 'immutable';
import { indexOf, remove } from 'lodash';
import AreaTabs from './AreaTabs';
import qs from 'querystring';
import cs from 'classnames';
//api 
import { addSelect , delSelect } from '../../api/home.js';


//变量
const TabPane = Tabs.TabPane;
let { symbolResolveJSON } = datafeedConfig;

type snum = number | string;
interface obj{
    id:snum;
    select:boolean;
    areaIndex:snum;
}
interface IProps {
    data:any;
    saveCoinAction: (obj:obj ) => void;
    loginState: boolean;
    history:any;
    activeChart: number;
    changeCoin: (id:number) => void;
    sendMessage: (id:number) => void;
    calculateEX:(pr:string) => string;
}

interface IState {
    selectCoinArea: number;
    coinId: string | number;
    checkedCoin: snum[];
    activeKey: string;
    isAcive: boolean;   
}


class KlineSelectCoin extends React.Component<IProps, IState> {

    public state:IState;
    ls: _LocalStorage;
    
    constructor(props) {
        super(props);
        this.state = {
            selectCoinArea:1,
            coinId:'0',
            checkedCoin: [],
            activeKey:'1',
            isAcive:false
            
        }
    }

    componentDidMount() {
        //初始化localstorage
        this.ls = new _LocalStorage();
        
        if(qs.parse(this.props.history.location.search)['?na']) {
           
           const na = (qs.parse(this.props.history.location.search)['?na'] as string).replace('_', '/');
           
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
       
        document.onclick = () => {
            this.setState({
                isAcive:false
               })
        }
   
     
   }
   
   componentWillUnmount() {
        document.onclick = null;
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
  
   }

   componentWillReceiveProps(nextProps) {
       
           this.setState({
               coinId:nextProps.data.id
           });
   }
   
    //添加自选
    select = (e, item, areaIndex) =>  {
       
        e.stopPropagation();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

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
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

       if(this.props.data.id === coin.id) return;
      
       if(this.props.activeChart === 0) {
          
           (window as any).widget.onChartReady(() => {
                this.props.changeCoin(coin);
                this.props.sendMessage(coin.id);
               
                this.props.history.replace(`/klineTrade?na=${coin.na.split('/')[0]+'_'+coin.na.split('/')[1]}`);
                (window as any).hasWsMessage = false;
                //通过字符串的形式传入coinId和交易区Id
                // window.hasWsMessage = false; // 乱加的
                //const a = window.location.pathname
                // window.location.href= `${a}?id=${coin.id}&na=${coin.na}&active=${this.state.activeKey}`;
             
              /*   window.widget.remove();
                window._createWidget(); */
              
               symbolResolveJSON['name'] =  coin.na.replace('/','_');
               symbolResolveJSON['ticker'] = coin.na.replace('/','_'); 
              // if(window._onResetCacheNeededCallback) window._onResetCacheNeededCallback();
              (window as any).widget.chart().resetData();
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
            this.props.history.replace(`/klineTrade?na=${coin.na.split('/')[0]+'_'+coin.na.split('/')[1]}`); //&active=${this.state.activeKey}
            this.setState({
                coinId: coin.id
            });
         
       }

       this.showCoin(e);

    }
  
    //选择交易区
    changeCoin = (index) =>{
        
        this.setState({
            selectCoinArea:index
        });
        return false;
    }

 

     //添加自选
     saveCoin = ( e, coinId:snum) => {
        e.stopPropagation();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        if(indexOf(this.state.checkedCoin, coinId) > -1) {
            remove(this.state.checkedCoin, n => {
                    return n === coinId;
                })
        } else {

            this.state.checkedCoin.push(coinId);
  
        }
        this.setState({checkedCoin:this.state.checkedCoin.concat([])});
      

    }

    showCoin = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState((preState) => ({
            isAcive:!preState.isAcive
        }));
      
    }

    render() {
    
        const paneList = this.props.data.data.map( (item, index:number) => {

            return (
                        <TabPane
                            tab={item.name}
                            key={(index).toString()}

                        >
                            <AreaTabs 
                                tradeList={item.data?item.data.toArray():[]}
                                coinId={this.state.coinId}
                                key={((index+1)*Math.random()).toString(36)}
                                selectCoin={this.selectCoin}
                                areaIndex={index}
                                saveCoin={this.select}
                                calculateEX={this.props.calculateEX}
                            />
                        </TabPane>
                    )
            });
        
        return (
            <div id="KlineSelectCoin">
                <div 
                    className={cs("KlineSelectCoin-name",{ "active-select": this.state.isAcive})}
                    onClick={this.showCoin}
                >
                    <span>{this.props.data.coin+'/'+this.props.data.coinArea}</span>
                    <Icon type="caret-down" className="KlineSelectCoin-slide"/>
                </div>
                <div className={cs("KlineSelectCoin-line ")} style={{display:this.state.isAcive?'block':'none'}}></div>
                    <div
                        className={cs("KlineSelectCoin-list animated", {'fadeIn': this.state.isAcive})} 
                        style={{display:this.state.isAcive?'block':'none'}}
                    >
                        <Tabs
                            type="card"
                            tabBarStyle={{border:'none'}}
                            size="default"
                            style={{ width: 586, height:368 }}
                            tabBarGutter={1}
                            activeKey={this.state.activeKey}
                            onTabClick={(val,e) =>{
                                console.log(val)
                                e.stopPropagation();
                                e.nativeEvent.stopPropagation();
                                 e.nativeEvent.stopImmediatePropagation();
                                 this.changeTardeArea(val);
                            }}
                           
                        >
                            { paneList }
                        </Tabs>
                    </div>
            </div>
        )
    }
}


export default  KlineSelectCoin;