/* 
*  个人中心头部公共组件
*/
import React, { Component } from 'react';
import './TabHead.scss'

class TabHead extends Component {
   
  

    render() {
        const { activeIndex } = this.props;
        const tabList =  this.props.breadText.map( (item,index) => {
          
            return (
                        <a 
                            key={index} 
                            onClick={()=>{ this.props.changeTab(index)}} 
                            className={index === Number(activeIndex)?'active':''}
                        >
                            {item}
                        </a>
                    )
        })
        return (
            <div className="personalTop clear">
                <h2>{this.props.columText}  <span>/  {this.props.breadText[activeIndex]}</span></h2>                    
                <div className="personalNav">
                    {tabList}
                </div>
            </div>
        )
    }
    
}




export default TabHead