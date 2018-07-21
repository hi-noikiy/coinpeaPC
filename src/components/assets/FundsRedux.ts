
/*
    用户资产信息redux
*/
import { GetUserAssetList } from '../../api/funds';
// tslint:disable-next-line:ordered-imports
import { put, take, call, fork } from 'redux-saga/effects';

import { message } from 'antd';
import  { addTotal, times } from '../../utils';

const GET_ASSETSINFO_SUCCESS = 'GET_ASSETSINFO_SUCCESS';
const GET_ASSETSINFO = 'GET_ASSETSINFO';


// action 
export function GetAssetInfoSuccess(data) {
    return {
        payload:data,
        type: GET_ASSETSINFO_SUCCESS,
        
    }
}

export function GetAssetInfo() {
    return {
        type: GET_ASSETSINFO
    }
}



// work saga 
export function* fecthAssets() {
    const data = yield call(GetUserAssetList); // 指示中间件调用fetch异步
    yield put ({type:GET_ASSETSINFO_SUCCESS, data}) // 发起一个action到store
}

// watch saga 监听被dispatch的action,当收到action或者知道其被触发，调用work saga执行任务
export function* watchFecthAssets() {
    while(true) {
         yield take(GET_ASSETSINFO); // 指示中间件等待Store上指定的action,即监听action
         yield fork(fecthAssets) ;// 指示中间件以无阻塞的方式调用fetchTabs
    }
}

export interface IFunsState {
    convert:number;
    data:Idata[] | any;
    loading:true;
    search:'';
    srcData:Idata[] | any;
    totalBTC:0;
    userWithdraw:0;
    withdrawQuota:0;
}
// reducer
interface Idata {
    coinBasicInfoDo:any;
    [propName: string]: any;
}
const initialState:IFunsState = {
    convert:0,
    data:null,
    loading:true,
    search:'',
    srcData:null,
    totalBTC:0,
    userWithdraw:0,
    withdrawQuota:0,
}

// 隐藏小额资产
const HIDE_LOWER_ASSETS = 'HIDE_LOWER_ASSETS';
export function EMIT_HIDE_ASSETS(val,types, bool,search) {
    return {
        bool,
        search,
        type: HIDE_LOWER_ASSETS,
        types,
        val,
    }
}
export default function Funds(state = initialState,action:any) {
    switch(action.type){
        case GET_ASSETSINFO_SUCCESS:
        if(action.data.status === 1) {
            
            action.data.data.forEach(item => {

                    item.total = addTotal(item.frozen_fmt, item.total_fmt);
                    item.valuation = times(addTotal(item.frozen_fmt, item.total_fmt), item.coinBasicInfoDo.lastDealPrize);
            });
            
            return {
                    ...state,
                    data:action.data.data,
                    loading:false, 
                    srcData:action.data.data,
                   
                }
        } else {
            message.error(action.data.msg);
            return {
                ...state,
                loading:false
            };
        }
        // 隐藏资产及搜索
        case HIDE_LOWER_ASSETS:
        let newData:any = [];
        if(action.types === 'hide') {
            
            action.bool? newData = state.srcData.filter( item => {
                return item.total !== 0
            }) : newData =  state.srcData
         
            newData = [].concat(newData).filter((item:any) => {
                return (item.coinBasicInfoDo.sortName.indexOf(String(action.search).toUpperCase()) >=0 ) // ||item.coinBasicInfoDo.englishName.indexOf(action.search) >=0
            })
          
        } else {
            newData = state.srcData.filter( item => {
                return (item.coinBasicInfoDo.sortName.indexOf(String(action.val).toUpperCase()) >=0 ) // ||item.coinBasicInfoDo.englishName.indexOf(action.val) >=0 
            }) 
 
        }
        return {
            ...state,
            data:newData,
            search: action.search
        }
            
        default:
            return state;
    }
}