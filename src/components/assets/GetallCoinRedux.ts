
/*
    币种信息redux
*/
import { call, fork, put, take,  } from 'redux-saga/effects';
import { GetAllCoin } from '../../api/funds';

const GET_ALLCOIN = 'GET_ASSETS_LIST';
const SET_ACTIVEID = 'SET_ACTIVEID';
const GET_ALLCOIN_SUCCESS = 'GET_ASSETS_LIST_SUCCESS';

// action 
export function getAllCoinSuccess(data:any) {
return {
        payload:data,
        type: GET_ALLCOIN_SUCCESS,
       
    }
}

export function getAllCoin() {
    return {
        type: GET_ALLCOIN
    }
}


export function setActiveCoinId(id:number, name:string, count:string, freeze:string, useable:string, icoinUrl:string, smCount:string){
    return {
        count,
        freeze,
        icoinUrl,
        id,
        name,
        smCount,
        type: SET_ACTIVEID,
        useable,
    }
}


// work saga 
export function* fecthAllcoin() {

    const data = yield call(GetAllCoin); // 指示中间件调用fetch异步
      yield put ({type:GET_ALLCOIN_SUCCESS, data}) // 发起一个action到store
}

// watch saga 监听被dispatch的action,当收到action或者知道其被触发，调用work saga执行任务
export function* watchFecthAllcoin() {
  
    while(true) {
         yield take(GET_ALLCOIN); // 指示中间件等待Store上指定的action,即监听action
         yield fork(fecthAllcoin) ;// 指示中间件以无阻塞的方式调用fetchTabs
    }
}

// reducer
const initialState = {
    activeCoinName:"",
    activeCoinid:1,
    coinList:[],
    count: "",
    freeze: "",
    icoinUrl:'',
    useable: "",
  
    
}


export default function GetallCoin(state = initialState, action:any) {
    switch(action.type){
        // 获取充值列表
        case GET_ALLCOIN_SUCCESS:
            return {
                ...state,
                activeCoinName: state.activeCoinName?state.activeCoinName:action.data.data[0].sortName,  
                activeCoinid:state.activeCoinid?state.activeCoinid:action.data.data[0].id,
                coinList:action.data.data,
                icoinUrl: state.icoinUrl?state.icoinUrl:action.data.data[0].icoinUrl,
                
            }
        // 选中充值币中
        case SET_ACTIVEID:
            return {
                ...state,
                activeCoinName: action.name.toUpperCase(),
                activeCoinid: action.id,
                count:action.count,
                freeze:action.freeze,
                icoinUrl:action.icoinUrl,
                useable: action.useable,
               
            }

        default:
            return state
    }
}