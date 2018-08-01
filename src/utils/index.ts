//localstorage 封装
import { Decimal } from 'decimal.js';

import { is } from 'immutable';
import { forEachRight } from 'lodash';
export class _LocalStorage {
    
    public LS:any;
  //  public name:string;

    constructor() {
     //   this.name = name;
        this.LS = null;
        this.isLocalStorage();
    }

    //判断是否支持Locastorage
     isLocalStorage() {

        if(window && window.localStorage) {
            this.LS = window.localStorage;
        } else {
            throw new Error('您的浏览器不支持localStorage')
        }
    }

    

    //设置localstorage
    public set(key, data) {
        
        if(this.LS.getItem( window.location.hostname+key)) {
            this.clear( window.location.hostname+key);
        }
        
        this.LS.setItem( window.location.hostname+key, JSON.stringify(data));
    }

    //获取localstorage
    public get(name) {
      
        let data = this.LS.getItem( window.location.hostname+name);
       
        if( data === 'undefined' || data === null) return false;
      
        data = JSON.parse(data);
        return data;
    }

    //清除localStorage
    public clear(key) {
        this.LS.removeItem(window.location.hostname+key);
    }
} 


export class _sessionStorage {
    
    public LS:any;
  //  public name:string;

    constructor() {
     //   this.name = name;
        this.LS = null;
        this.isLocalStorage();
    }

    //判断是否支持Locastorage
     isLocalStorage() {

        if(window && window.sessionStorage) {
            this.LS = window.sessionStorage;
        } else {
            throw new Error('您的浏览器不支持sessionStorage')
        }
    }

    

    //设置localstorage
    public set(key, data) {
        
        if(this.LS.getItem( window.location.hostname+key)) {
            this.clear( window.location.hostname+key);
        }
        
        this.LS.setItem( window.location.hostname+key, JSON.stringify(data));
    }

    //获取localstorage
    public get(name) {
      
        let data = this.LS.getItem( window.location.hostname+name);
       
        if( data === 'undefined' || data === null) return false;
      
        data = JSON.parse(data);
        return data;
    }

    //清除localStorage
    public clear(key) {
        this.LS.removeItem(window.location.hostname+key);
    }
} 

//表格文字买卖颜色
export const addColor = (type, val) => {
    if(Number(val) === 0) return;
    if(type === 'buy') {
        return 'buy-coin';
    } else if (type === 'sell') {
        return 'sell-coin'
    } else {
        return '';
    }

}

//添加正负号及百分比
export const addSymbols = (val) => {

   let value = val;
    if(value > 0) {
        value = '+'+value+'%';
    } else {
        value = value+'%';
    }
    return value;

}

//格式化数字
export const formatNumber  = (val) => {
    
        val +='';
        const list = val.split('.');
        const prefix = list[0].charAt(0) === '-' ? '' : list[0].charAt(0);

        let num = prefix ? list[0].slice(1) : list[0];
        let result = '';
      
        while(num.length > 3) {
            result = `,${num.slice(-3)}${result}`;
           
            num = num.slice(0, num.length - 3);
        }
        if(num) {
            result = num + result;
        }
        
        return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

//转换科学记数法
export const numToString = (val) => {
   
    const a = new Decimal(val);
    return a.toString();
}

//转换科学计数法，不四舍五入 不 补零
export const setPrecision =  (val, decimal?) => {
      
       if (val === '0') return 0;
       
        const a = new Decimal(Number(val));
     
        const b = a.toFixed(Number(decimal || 4) , Decimal.ROUND_DOWN);
        let c = b.split('.');

       if(c[1] === undefined || Number(c[1].toString()) === 0) {
            return c[0];
        } else {
           
            const arr = String(c[1]).split('');
            let str;

             forEachRight(arr, function (item) {
                    if(arr[arr.length-1] === '0') {
                        arr.pop();
                    }
            }); 
            str = c[0]+'.'+ arr.join('');
            return str 
        }
     // return  b;
            
}


//转换科学计数法，补零
export const precision_zero =  (val, decimal) => {
  
    if (val === '0') return 0;
     const a = new Decimal(Number(val));
     const b = a.toFixed(Number(decimal || 4) , Decimal.ROUND_DOWN);
  
     return b;
         
}

//加法
export const addTotal = (num1, num2) => {
    num1 = Number(num1);
    num2 = Number(num2);
   
    return new Decimal(num1).plus(num2).toNumber();
}

//乘法
export const times = (n1, n2) => {
    n1 = Number(n1);
    n2 = Number(n2);
 

    const val =  new Decimal(n1?n1:0).times(n2?n2:0).toNumber();
    
    return val;
}

//替换字符串中间部分，只保留五位
export function formatStr (str) {
    if(!str) return;
    const s = str.split('@');
    return s[0][0]+'***'+s[0][s[0].length-1]+'@'+ s[1];
}


export function shallowEqualImmutable(objA, objB) {
    if (objA === objB || is(objA, objB)) {
        return true;
    }

    if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) {
        return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
    for (var i = 0; i < keysA.length; i++) {
        if (!bHasOwnProperty(keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }

    return true;
}



// 头部链接变量的获取
export function getQueryString(name) {  
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
    var r = window.location.search.substr(1).match(reg);  
    if (r != null) return unescape(r[2]);  
    return null;  
}


//设置符号和颜色
export const setSymbol = (type, isAddColor?) => {
    if(isAddColor) {
        switch(String(type)){
            case '-1':
            return 'sell-coin';
            
            case '1':
            return 'buy-coin';

            default:
            return '';
        }
    } else {
        switch(String(type)){
            case '-1':
            return '-';
            
            case '1':
            return '+';

            default:
            return '';
        }
    }
    
}





  //计算汇率符号
  export const  createdSymbol = (lang) =>{
                switch(lang){
                        case 'en_US':
                        return '$';
                        case 'zh_CN':
                        return '￥';
                        case 'zh_TW':
                        return 'NT$';
                        case 'ko_KR':
                        return '₩';
                        case 'ru_RU':
                        return 'руб';
                        case 'ja_JP':
                        return '¥'
                        default:
                        return '￥';
                    }
}