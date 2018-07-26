
/* 
    分页组件
*/
import React from 'react';

import './Paged.scss';

class Page extends React.Component {

    state = {
        activeIndex:0
    }

    selectPage = (index) => {
        this.setState({
            activeIndex:index
        })
    }

    next = () =>{
        this.setState((preState) => {
            return {
                activeIndex:preState.activeIndex++
            }
        })
    }

    pre = () => {
        this.setState((preState) => {
            return {
                activeIndex:preState.activeIndex--
            }
        })
    }

    render() {
        const { activeIndex } = this.state;
        const { count, showList, pageNum } = this.props;
        const countPage = Math.ceil(count/showList);
        const arr = [];
        for(let i = 0; i < countPage;i ++) {
            arr.push(<span className={i===activeIndex ? 'isActive':''} onClcik={()=>{this.selectPage(index)}}>{i}</span>)
        }
    
        return (
            <div className="paged-wrap">
                {arr}        
            </div>
        )
    }
}
const Paged = (props) => {

    
}