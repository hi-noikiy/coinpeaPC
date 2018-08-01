/* 
Tab 切换 

*/
import React from 'react';

import './ContralTitle.scss';

class ContralTitle extends React.Component {
    
    
    render() {
        const TabsTitle = this.props.list.map( (item, index) => {
                return (
                    <div 
                            className={index === this.props.index?'isActive':''} 
                            style={{marginRight:20}}
                            key={index.toString()}
                            onClick={(e) => {this.props.tabsClickHandel(index)}}
                    >{item}</div>
                )
        })
        
       
        return (
            <div className="ContralTitle">
                <div className="ContralTitle-top">
                    <div className="triangle" id="kchartTriangle"></div>
                    {TabsTitle}
                </div>
                <div className="contralTitle-content">
                   {
                         React.Children.map(this.props.children, (child, index) => {
                                return <div style={{display:this.props.index === index?'block':'none'}} >{child}</div>
                            
                        })
                   }
                </div>
            </div>
        )
    }
}


export default ContralTitle;