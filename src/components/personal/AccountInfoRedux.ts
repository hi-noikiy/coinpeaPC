/*
    账户信息redux
*/
//action 

import intl from 'react-intl-universal';

export function idcardCheck() {
    return {
        type: 'IDCARD_CHECKED'
    }
}

export function idcardUnCheck() {
    return {
        type: 'IDCARD_UNCHECKED'
    }
}
export function idcardFailCheck() {
    return {
        type: 'IDCARD_FAILCHECKED'
    }
}
export function idcardChecking() {
    return {
        type: 'IDCARD_CHECKEDING'
    }
}
export function msgCheck() {
    return {
        type: 'MSG_CHECKED'
    }
}

export function msgUnCheck() {
    return {
        type: 'MSG_UNCHECKED'
    }
}

export function googleCheck() {
    return {
        type: 'GOOGLE_CHECKED'
    }
}

export function googleUnCheck() {
    return {
        type: 'GOOGLE_UNCHECKED'
    }
}
//reducer
const initialState = {
    idcardCheck: 0,
    msgCheck:false,
    googleCheck:false,
    idcardType: intl.get('未实名认证'),
}
const ChangePersonalCheck = (state = initialState,action) => {
    switch(action.type){
        case 'GOOGLE_CHECKED':
            return {
                ...state,
                googleCheck:true
            }
        case 'GOOGLE_UNCHECKED':
            return {
                ...state,
                googleCheck:false
            }
            case 'MSG_CHECKED':
            return {
                ...state,
                msgCheck:true
            }
        case 'MSG_UNCHECKED':
            return {
                ...state,
                msgCheck:false
            }
        case 'IDCARD_CHECKED':
            return {
                ...state,
                idcardCheck:1,
                idcardType:intl.get('认证成功'),
            }
        case 'IDCARD_UNCHECKED':
            return {
                ...state,
                idcardCheck:0,
                idcardType:intl.get('未实名认证'),
            }
        case 'IDCARD_FAILCHECKED':
            return {
                ...state,
                idcardCheck:2,
                idcardType:intl.get('认证失败'),
            }
        case 'IDCARD_CHECKEDING':
            return {
                ...state,
                idcardCheck:3,
                idcardType:intl.get('认证中'),
            }
        default:
            return state
    }
}




export default ChangePersonalCheck
  