/*  
    交易页面交易区数据
*/

import { put, take, call, fork } from 'redux-saga/effects';
import { _LocalStorage } from '../../utils';
import { selectCoin } from '../home/HomeTabsListRedux';
import { init } from 'react-intl-universal';
import{ Map, List, forEach as _forEach } from 'immutable';
import intl from "react-intl-universal";


const   tradeState = {
    data:List(),
    coin:'',
    icon:'',
    coinArea:'',
    id:'',
    buyPrice:'',
    salePrice:'',
    exRate:{},
    regRate:0,
    coinRate:0,
};

//Action
const SAVE_COIN_LOCAL_EX = 'SAVE_COIN_LOCAL_EX';
//获取数据
const COIN_DATA_EX = 'GET_COIN_DATA_EX';
export  function  GET_COIN_DATA (data, login) {
    return {
        type: COIN_DATA_EX,
        data,
        login
    }
}

//格式化交易区数据
 function coinFormat(data, login) {
    
const ls = new _LocalStorage();
const lcdata =  ls.get('checkedCoinArr');

   if(!data) return;
   data[0].name = intl.get('自选');
   //未登录
    if(!login) {
        data.forEach(v => {
            const hash = {};
            if(v.data) {
                v.data.forEach( o => {
                    hash[o.id] = o;
                    if(lcdata[o.id]) {
                        o.isc = true;
                    }
                 })
                 v.data = Map(hash);
            }
          
        });
       
        data[0].data = Map(lcdata?lcdata:{});
      
    } else {
        data.forEach(v => {
            const hash = {};
            if(v.data) {
                v.data.forEach( o => {
                    hash[o.id] = o;
                 })
                 v.data = Map(hash);
            }
          
        });
      
    }

    if(!data[0].data) {
        data[0].data = Map({});
    }
   
    return List(data);
}

//Action Creater
//保存自选
export function SAVE_COIN_LOCAL_ACTION(params) {
    return {
        type: SAVE_COIN_LOCAL_EX,
        params
    }
}
//处理自选 
function formatSelectCoin(areaIndex,id, select, data) {
    
      var a = '';  
       if(!data) return;
       
       data.forEach( (item, index) => {
                if(item.data && item.data.get(String(id))) {
                    a =  data.update(index, v => {
                        return {
                            name: v.name,
                            data:v.data.update(String(id), o => {
                                o.isc = select;
                                return Object.assign({}, o);
                            }) 
                        }
                    })
                   
                    if(select) {
                       
                        a =  data.update(0, o => {
                           
                          if(o.data) {
                                return {
                                    name: o.name,
                                    data: o.data.set(String(id), item.data.get(String(id)))
                                }
                          }
                           
                        })
                    
                      
                    } else {
                     
                        a = data.update(0, v=> {
                          
                            if(v.data ) {
                                return {
                                    name: v.name,
                                    data:v.data.delete(id.toString()) 
                                }
                            }
                            
                        })
                    } 
                    
                }
        })
       
        return a;
}
//实时更新交易区数据 
const UPDATA_COINAREA_EX = 'UPDATA_COINAREA_EX';
export function EMIT_UPDATA_COINAREA(coin, data) {

    return {
        type: UPDATA_COINAREA_EX,
        coin,
        data
    }
}
function updateCoinArea(state,coin, data) {
  
    var res =state.data;
        res.forEach( (item, index) => {
            
            if(item.data && item.data.get(String(coin))) {
              res =  res.update(index, v => {
                   return {
                       name: v.name,
                       data: v.data.update(String(coin), v => Object.assign(v, data))
                   }
               })

            }
       })
   
    return res;
}

//更换币种
const CHANGE_COIN = 'CHANGE_COIN';
export function DIS_CHANGE_COIN (data) {
   
    const transData  =  Map(data);
    
    return {
        type: CHANGE_COIN,
        transData
    }
} 

//保存汇率
const EXCHANGE_RATA = 'EXCHANGE_RATA';
export function SAVE_EXCHANGE_RATA_EX(data) {
    return {
        type:EXCHANGE_RATA,
        data
    }
}
//reducer
 const coinArea = (state = tradeState, action) => {
  /* 
    state.data.update(action.params.areaIndex, v => {
                return {
                    name:v.name,
                    data:v.data.update(action.params.id.toString(), o => {
                        o.isc = action.params.select;
                        return Object.assign(o);
                    }) 
                }
  */
    switch(action.type) {
      
        //保存自选
        case SAVE_COIN_LOCAL_EX:
        return {
            ...state,
             data:formatSelectCoin(action.params.areaIndex,action.params.id, action.params.select, state.data)
        }

        //获取交易区数据
        case COIN_DATA_EX:
        
        return {
            ...state,
          /*   id: state.id?state.id:action.data[1].data[0].id,
            icon:state.icon?state.icon:action.data[1].data[0].url,
            coin:state.coin?state.coin:action.data[1].data[0].na.split('/')[0],
            coinArea:state.coinArea?state.coinArea:action.data[1].data[0].na.split('/')[1], */
            data:coinFormat(action.data, action.login),
            
        }

        //实时更新交易区数据
        case UPDATA_COINAREA_EX:
        return {
            ...state,
            data:updateCoinArea(state, action.coin, action.data)
        }

        //切换币种
        case CHANGE_COIN: 
        return {
            ...state,
            id: action.transData.get('id') ,
            coin:action.transData.get('na').split('/')[0],
            coinArea:action.transData.get('na').split('/')[1],
            icon:action.transData.get('url')
        }

       //保存汇率
       case EXCHANGE_RATA:
       return {
           ...state,
           exRate:action.data
       }
        default:
            return state; 
    }

}
export default coinArea;
