
export interface InavState {
    isAddClass: boolean;
    isHideNotify: boolean;
}

const navState:InavState = {
    isAddClass:false,
    isHideNotify:false,
}

// action
const IS_ADD_CLASS: string = 'IS_ADD_CLASS';
const IS_HIDE_NOTIFY: string = 'IS_HIDE_NOTIFY';
const IS_REMOVE_CLASS: string = 'IS_REMOVE_CLASS';

// action creator
interface Iactions {
    type: string;
    params?:boolean
}

export function ACTION_IS_ADD_CLASS(params: boolean): Iactions{
    return {
        type:IS_ADD_CLASS,
        // tslint:disable-next-line:object-literal-sort-keys
        params
    }
}

export function ACTION_IS_HIDE_NOTIFY (params:boolean): Iactions {
    return {
        type:IS_HIDE_NOTIFY,
        // tslint:disable-next-line:object-literal-sort-keys
        params
    }
}

export function ACTION_IS_REMOVE_CLASS (params): Iactions {
    return {
        type:IS_REMOVE_CLASS,
        // tslint:disable-next-line:object-literal-sort-keys
        params
    }
}

// reducer 
export default function navReducer(state = navState, action:Iactions):InavState{
    switch(action.type) {

        // 添加导航背景颜色class
        case IS_ADD_CLASS: {
            return {
                ...state,
                isAddClass:true,
            }
        }

        // 删除导航背景颜色CLASS
        case IS_REMOVE_CLASS: {
            return {
                ...state,
                isAddClass:false,
            }
        }
        // 隐藏导航广播
        case IS_HIDE_NOTIFY: {
        
            return {
                ...state,
                isHideNotify:true,
            }
         
        }

        default:
        return state;
    }
}