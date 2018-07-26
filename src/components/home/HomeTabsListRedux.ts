
/* 
    Home页交易区数据
    initeState: 初始化redux，确定reducer结构
*/
// tslint:disable-next-line:ordered-imports
import { call, fork, put, take } from 'redux-saga/effects';
import 'whatwg-fetch';
import { _LocalStorage } from '../../utils';

import {  List , Map} from 'immutable';
import intl from "react-intl-universal";
import { createdSymbol, numToString ,setPrecision, times} from '../../utils';


// api接口
import { userList } from '../../api/home';

interface InitState {
    loading:boolean;
    error: boolean;
    tradeList: List<any>;
    allList: List<any>;
    exRate: any;
    siteInfo: any;
}
const initState:InitState = {
    loading: false,
    // tslint:disable-next-line:object-literal-sort-keys
    error: false,
    tradeList:List(),
    allList:List(),
    exRate:{},
    siteInfo:{} // 站点信息
};



const FETCH_TABS_LIST = 'FETCH_TABS_LIST';
const LOAD_TRADES_SUCCESS = 'LOAD_TRADES_SUCCESS';
const LOAD_TRADES_ERROR = 'LOAD_TRADES_ERROR';
const LOAD_TRADES = 'LOAD_TRADES';
const SORT_TABS_24H = 'SORT_TABS_24H';
const SORT_TABS_COUNT = 'SORT_TABS_COUNT';
const SAVE_COIN_LOCAL = 'SAVE_COIN_LOCAL';


// work saga 
export function* fetchTabs() {
   
    const data = yield call(userList); // 指示中间件调用fetch异步
 
    yield put ({type:LOAD_TRADES_SUCCESS, data}) // 发起一个action到store
}

// watch saga 监听被dispatch的action,当收到action或者知道其被触发，调用work saga执行任务
export function* watchFecthTabs() {
  
    while(true) {
         yield take(FETCH_TABS_LIST);  // 指示中间件等待Store上指定的action,即监听action
         yield fork(fetchTabs) ;       // 指示中间件以无阻塞的方式调用fetchTabs
    }
}


// action creators
export function ACTION_FETCH_TABS_LIST(data, login) {
    return {
        type: LOAD_TRADES_SUCCESS,
        // tslint:disable-next-line:object-literal-sort-keys
        data,
        login
    }
}

export function ACTION_LOAD_TRADES() {
    return {
        type: LOAD_TRADES,
        
    }
}

/* export function ACTION_LOAD_TRADES_SUCCESS() {
    return {
        type: LOAD_TRADES_SUCCESS
    }
}
 */

// 格式化交易区数据
function coinFormat(data, login, state) {
    const ls = new _LocalStorage();
    const lcdata =  ls.get('checkedCoinArr');
    if(!data) { return; }
    data[0].name = intl.get('自选');
    
    let exRate = 0;
    if(ls.get('lang')) {
        exRate = state.exRate.get(ls.get('lang'))?state.exRate.get(ls.get('lang')):1;
    } else {
       
        // 默认语言
        exRate =  state.exRate.get('zh_CN');
    }
   
     // 未登录
     if(!login) {
         data.forEach((v, i) => {
             const hash = {};

             if(i !== 0) {
                v.name  = v.name + intl.get('交易区');
             }
            
             if(v.data) {
               
                 v.data.forEach( o => {
                    
                     hash[o.id] = o;
                     if(lcdata[o.id]) {
                         o.isc = true;
                     }

                    // 添加汇率字段
                     if(state.exRate.get(o.ar)) {

                        let val:number|string = times( ls.get('lang') === 'en_US'? 1: exRate , times(state.exRate.get(o.ar), o.np));

                        if(val > 0 && val < 1) {
                            val = numToString(val.toPrecision(2));
                          
                         } else {
                           
                             val = setPrecision(val, 2);
                         }
                 
                        o.times = createdSymbol(ls.get('lang'))+val;

                     } else {
                         o.times = 0;
                     }

                  })
                  v.data = Map(hash);
             }
           
         });
        
         data[0].data = Map(lcdata?lcdata:{});
     } else {
      
         data.forEach((v, i) => {
             const hash = {};

             if(i !== 0) {
                v.name  = v.name + intl.get('交易区');
             }

             if(v.data) {
                 v.data.forEach( o => {
                     hash[o.id] = o;

                     // 添加汇率字段
                     if(state.exRate.get(o.ar)) {
                        let val:number|string =times(  ls.get('lang') === 'en_US'? 1: exRate ,times(state.exRate.get(o.ar), o.np));

                        if(val > 0 && val < 1) {
                            val = numToString(val.toPrecision(2));
                          
                         } else {
                           
                             val = String(setPrecision(val, 2))
                         }
                 
                        o.times = createdSymbol(ls.get('lang'))+val;

                     } else {
                         o.times = 0;
                     }
                  })
                  
                  v.data = Map(hash);
             }
           
         });
     }
     state.allList = List(data);
    
     return List(data);
 }

// 保存自选
export function ACTION_SAVE_COIN_LOCAL (params) {

    return {
        params,
        type:SAVE_COIN_LOCAL
      
    }
}
// 处理自选 
function formatSelect(id, select, data) {
    
    let a = '';  
    if(!data) { return; }
     data.forEach( (item, index) => {

              if(item.data && item.data.get(id.toString())) {
                  a =  data.update(index, v => {
                      return {
                          name: v.name,
                          // tslint:disable-next-line:object-literal-sort-keys
                          data:v.data.update(id.toString(), o => {
                              o.isc = select;
                              return Object.assign({}, o);
                          }) 
                      }
                  })
                 
                  if(select) {
                      a =  data.update(0, o => {
                          
                         return {
                             name: o.name,
                             // tslint:disable-next-line:object-literal-sort-keys
                             data: o.data.set(String(id), item.data.get(id.toString()))
                         }
                      })
                  
                  } else {
                      a = data.update(0, v=> {
                        
                          return {
                                data:v.data.delete(id.toString()),
                                name: v.name
                              
                          }
                      })
                  } 
                  
              }
      })
    
      return a;
}

// 实时更新交易区数据 
const UPDATA_COINAREA = 'UPDATA_COINAREA';
export function EMIT_UPDATA_COINAREA_HOME(coin, data) {

    return {
        coin,
        data,
        type: UPDATA_COINAREA,
       
    }
}
function updateCoin(state,coin, data) {
    let res =state.tradeList;
    const ls = new _LocalStorage();
   
    let exRate = 0;
    if(ls.get('lang')) {
        exRate = state.exRate.get(ls.get('lang'))?state.exRate.get(ls.get('lang')):state.exRate.get('BTC');
    } else {
       
        // 默认语言
        exRate =  state.exRate.get('zh_CN');
    }
  
    // 计算新的汇率
    let val:number|string = times(times(state.exRate.get(data.ar), data.np),  ls.get('lang') === 'en_US'? 1: exRate);

    if(val > 0 && val < 1) {
        val = numToString(val.toPrecision(2));
      
     } else {
     
         val = String(setPrecision(val, 2))
     }
    data.times = createdSymbol(ls.get('lang'))+ val;

  
        res.forEach( (item, index) => {
            
            if(item.data && item.data.get(String(coin))) {

                res =  res.update(index, v => {
                    return {
                            // tslint:disable-next-line:no-shadowed-variable
                            data: v.data.update(String(coin), v => Object.assign(v, data)),
                        name: v.name,
                        
                    }
                })
            }
       })
   
    return res;
}


// 排序tab 24H 
export function ACTION_SORT_TABS_24H(params) {
  
    return {
        params,
        type: SORT_TABS_24H,
        
    }
}
// 排序tab 24成交量 
export function ACTION_SORT_TABS_COUNT(params) {
    return {
        params,
        type: SORT_TABS_COUNT,
        
    }
}

// 保存汇率
const EXCHANGE_RATA = 'EXCHANGE_RATA';
export function SAVE_EXCHANGE_RATA(data) {
    return {
        data,
        type:EXCHANGE_RATA,
        
    }
}
// 未登陆时处理自选数据
/* export function selectCoin (data,coin) {
    const ls = new _LocalStorage();
    const lsData = ls.get('checkedCoinArr') || [];
   
    if(lsData.length === 0 ) {
        return data;
    } else {
       
        forEach(data, (item) => {
            forEach(item.coins, val => {
                forEach(lsData, v =>{
                    if(val[coin].id === v[coin].id) {
                        val.t.isCollect = 1;
                    } else {
                        val.t.isCollect = 0;
                    }
                })
            })
            
        })
        return data;
    } 
} */

// 搜索
const SEARCH_DATA = 'SEARCH_DATA';
export function FIRLTERS_AREA__LIST(areaIndex, val) {
    return {
        type:SEARCH_DATA,
        areaIndex,
        val
    }
}
function firters(areaIndex, val, state) {
    console.log(areaIndex);
    const allList = state.allList;
    return allList.update(areaIndex, v=> {
      
        return {
            name:v.name,
            data: v.data.filter(x => x.na.indexOf(val.toUpperCase()) >= 0)
        }
    })
}

// 保存站点信息
const SITE_INFO = "SITE_INFO";
export function SAVE_SITE_INFO(data) {
    return {
        type:SITE_INFO,
        data
    }
}

// reducer,触发action 类型
function tradeList(state = initState, action) {
  
    switch(action.type) {
        case LOAD_TRADES: {
           
            return {
                ...state,
                loding: true,
                error: false,
            };
        }

        // 获取交易区数据
        case LOAD_TRADES_SUCCESS: {
            return {
                ...state,
                loading: false,
                error: false,
                tradeList:coinFormat(action.data, action.login, state),
              //  allList: coinFormat(action.data, action.login, state)
            }
            
           
        }

        case LOAD_TRADES_ERROR: {
           
            return {
                ...state,
                loading: false,
                error: true,
            }
        }

        // 实时更新交易区数据
        case UPDATA_COINAREA:
        return {
            ...state,
            tradeList:updateCoin(state, action.coin, action.data),
        }

        // 24小时排序Tabs
        case  SORT_TABS_24H: {
            const payload = action.params;
            const areaIndex = Number(payload.areaIndex) -1;
           
            let  arr :List<any> = List();
            if(!state.tradeList.get(areaIndex).data ) { arr = state.tradeList; }

            // 从大到小
            if(payload.type === 'down') {
              
                    if(state.tradeList.get(areaIndex).data) {
                       arr = state.tradeList.update(areaIndex, v => {
                            return {
                                data: v.data.sortBy((o) =>  -o.ud),
                                name: v.name
                            }
                        })    
                    }
               
           } else {

            if(state.tradeList.get(areaIndex).data) {
                arr = state.tradeList.update(areaIndex, v => {
                     return {
                         data: v.data.sortBy((o) =>  o.ud),
                         name: v.name
                     }
                 })    
             }
                       
           }
         
            return {
                ...state,
                tradeList: arr
            }
        }

        // 成交量排序
        case SORT_TABS_COUNT: {
            const payload = action.params;
            const areaIndex = Number(payload.areaIndex) -1;
           
            let arr :List<any> = List();
            if(!state.tradeList.get(areaIndex).data ) { arr = state.tradeList; }

            // 从大到小
            if(payload.type === 'down') {
              
                    if(state.tradeList.get(areaIndex).data) {
                       arr = state.tradeList.update(areaIndex, v => {
                            return {
                                data: v.data.sortBy((o) =>  -o.gv),
                                name: v.name
                            }
                        })    
                    }
               
           } else {

            if(state.tradeList.get(areaIndex).data) {
                arr = state.tradeList.update(areaIndex, v => {
                     return {
                         data: v.data.sortBy((o) =>  o.gv),
                         name: v.name
                     }
                 })    
             }
                       
           }
        
            return {
                ...state,
                tradeList: arr
            }
        }

        // 保存自选
        case SAVE_COIN_LOCAL: {
            return {
                ...state,
                tradeList: formatSelect(action.params.id, action.params.select, state.tradeList)
            }
        }

       // 保存汇率
       case EXCHANGE_RATA:
      
       return {
           ...state,
           exRate:Map(action.data)
       }
       
       // 搜索
       case SEARCH_DATA:
       return {
           ...state,
           tradeList: firters(action.areaIndex, action.val, state)
       }

       // 保存站点信息
       case SITE_INFO:
       return {
            ...state,
            siteInfo:action.data
       }

        default:
            return state;
    }
}


export default tradeList;