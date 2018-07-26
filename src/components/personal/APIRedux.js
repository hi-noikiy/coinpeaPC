import { combineReducers } from 'redux';


//action 
export function saveKey(index) {
    return {
        type: 'SAVE_KEY',
        data:index
    }
}

export function editKey(index) {
    return {
        type: 'EDIT_KEY',
        data:index
    }
}

export function deleteKey(index) {
    return {
        type: 'DELETE_KEY',
        data:index
    }
}


export function secretShow(index) {
    return {
        type: 'SECRET_SHOW',
        data:index
    }
}

export function secretHide(index) {
    return {
        type: 'SECRET_HIDE',
        data:index
    }
}



//reducer
const initialState = {
    secretKeyList:[{
        name: 'CoCoCoin',
        APIKey: '613hasHGAL217shaldgaskjHcabAGAhaskdajsba83712Lgjasxghk218jsakdgaldjADh',
        Secret: 'dahsjdalasdklfHHKAd2423',
        opation: ['read','trade'],
        limitIp: '123.206.106.0',
        editing: true,
        secretShow:true,
        radio:'nolimit'
    },{
        name: 'Lucy',
        APIKey: '613hasHGAL217shaldgaskjHcabAGAhaskdajsba83712Lgjasxghk218jsakdgaldjADh',
        Secret: 'dahsjdalasdklfHHKAd2423',
        opation: ['read'],
        limitIp: '0,0,0,0',
        editing: false,
        secretShow: false,
        radio:'limit'
    }]
}


const ChangePersonalCheck = (state = initialState,action) => {
    const { type,data } = action;
    switch(type){
        case 'SAVE_KEY':{
            newlist = state.secretKeyList.forEach((item,index)=>{
                if(index == data){
                    item.editing = true;
                }
                return item
            });
            return {
                ...state,
                secretKeyList:newlist
            }
        }
        case 'EDIT_KEY':
            newlist = state.secretKeyList.forEach((item,index)=>{
                if(index == data){
                    item.editing = true;
                }
                return item
            });
            return {
                ...state,
                secretKeyList:newlist
            }
        case 'DELETE_KEY':
            newlist = state.secretKeyList.filter((item,index)=>{
                return index != data
            });
            return {
                ...state,
                secretKeyList: newlist
            }
        case 'SECRET_SHOW':
            newlist = state.secretKeyList.forEach((item,index)=>{
                if(index == data){
                    item.secretShow = true;
                }
                return item
            });
            return {    
                ...state,
                secretKeyList:newlist
            }
        case 'SECRET_HIDE':
            newlist = state.secretKeyList.forEach((item,index)=>{
                if(index == data){
                    item.secretShow = false;
                }
                return item
            });
            return {
                ...state,
                secretKeyList:newlist
            }
        default:
            return state
    }
}



export default ChangePersonalCheck
  