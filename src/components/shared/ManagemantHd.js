/* 

    管理头部
*/
import React from 'react';
import './ManagemantHd.scss';


const ManagemamntHd = (props) => {
    //生成头部右侧
    const a = props.titleR.map( (item, index) => {
           return (
                <span 
                    key={index.toString()}
                    className={props.index===index? 'isActive':''}
                    onClick={()=>{props.controlTabs(index)}}
                >{item}</span>
           )
    });
    const line =  <span className="line" key={Math.random().toString()}></span>;
    a.forEach( (item, index) => {
           if(index !== a.length-2) {
               a.splice(index, 0, line)
           }
    });
 
    return (
            <div className="trust-top">
                <div className="trust-left">
                    <span>{props.left_main}</span>
                        &nbsp;/&nbsp;
                    <span>{props.left_sub}</span>
                </div>
                <div className="trust-right">
                   {a}
                </div>
            </div>
    )
}

 export default ManagemamntHd;