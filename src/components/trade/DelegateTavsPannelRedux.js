import { List } from "antd";

const initState = {
    all:[],
    buy:[],
    sale:[],
    allHis:[],
    buyHis:[],
    saleHis:[],
    
};

//全部委托数据
const ALL_DELE_DATA = 'ALL_DELE_DATE';
export function ACTION_ALL_DELE_DATA (data) {
    return {
        type: ALL_DELE_DATA,
        data
    }
} 

//历史委托数据
const HIS_DELE_DATA = 'HIS_DELE_DATA';
export function ACTION_HIS_DELE_DATA (data) {
    return {
        type: HIS_DELE_DATA,
        data
    }
} 

//实时更新当前委托
const DELEGATE_CUR = 'DELEGATE_CUR';
export function UPDATE_DELEGATE_CUR(data,types) {
    return {
        type: DELEGATE_CUR,
        data,
        types
    }
}

function updateDelegate(state, data, types) {
   const a = [].concat(state);
    if(!data.id) return state;
  
    if(data.st === 3 || data.st === 4) {
      
        state.forEach((v, i) => {
        
            if(data.id === v.id) {
               
                state.splice(i, 1);
            }
        });
        return state;
    } else {
       
       const bool = state.every((v, i) => {
            
            return data.id !== v.id
       });

       if(bool) {
        
        state.unshift(data);
        
       }  else {
            state.forEach((v, i) => {
            
                if(data.id === v.id) {
                    
                    state[i] = data;
                
                } 
            });
       }
       
    }
 
   return state;
    
}

//实时更新历史数据
const DELEGATE_HIS = 'DELEGATE_HIS';
export function UPDATE_DELEGATE_HIS (data, types) {
    
    return {
        type: DELEGATE_HIS,
        data,
        types
    }
}
function updateHis(srcData, data, types) {
   
    if(!data.id) return srcData;
    const a = srcData?srcData:[]
    a.unshift(data);
    if(a.length >= 10) {
        a.pop();
    }
   
    return a.concat([]);

}


//过滤函数
function filters(arr, type) {
   
    if(arr) {
      
        return [].concat(arr).filter( item => item.ty === type )
    }
}

//reducer
export default function delegateDates (state=initState, action) {

        switch(action.type) {
            case ALL_DELE_DATA:
           
            return {
                ...state,
                all:action.data,
                buy: filters(action.data, 0),
                sale:filters(action.data, 1)
            }

            case HIS_DELE_DATA:
            return {
                ...state,
                allHis:action.data,
                buyHis: filters(action.data, 0),
                saleHis:filters(action.data, 1)
            }
            
            //实时 当前委托数据
            case DELEGATE_CUR: 
            const alls = updateDelegate(state.all, action.data, action.types);
            
            return {
                ...state,
                all:alls,
                buy: filters(alls, 0),
                sale:filters(alls, 1)
            }

            //实时历史数据
            case DELEGATE_HIS:
            
            const allHisS = updateHis(state.allHis, action.data, action.types);   

            return {
                ...state,
                allHis: allHisS,
                buyHis: filters(allHisS, 0),
                saleHis:filters(allHisS, 1),
            }

            default:
            return state
        }

} 