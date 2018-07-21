 const initState = {
     buyPrice:0,
     salePrice:0,
     areaBalance:0,
     coinBalance:0
 }

 //设置价格
const COIN_PRICE = 'COIN_PRICE';
export function SET_COIN_PRICE(types, val) {
    return {
        type:COIN_PRICE,
        types,
        val,
    }
}

//设置余额
const COIN_BALANCE = 'COIN_BALANCE';
export function SET_COIN_BALANCE(types,data){
    return {
        type:COIN_BALANCE,
        types,
        data
    }
}

 const tradeStock = (state = initState, action) => {
     switch(action.type) {
        //设置价格
        case COIN_PRICE: 
        return {
            ...state,
            [action.types]:action.val
        }

        //设置余额
        case COIN_BALANCE:{
            return {
                ...state,
                [action.types]:action.data
            }
        }
        
        default:
        return state;
     }
 }

 export default tradeStock;