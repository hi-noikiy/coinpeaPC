/* 
    站点文章组件
*/

import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { coinContent} from '../../api/coin.js'
import './Artical.scss';

export default class ArticalTwo extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            content:''
        }
    }


    componentDidMount() {
        this.coinContent(this.props.typeid);
    }


    coinContent= async (id)=>{
        const res= await coinContent({'coinId':id});
        if(res.status === 1){
            this.setState({
                content:res.data.content
            })
        }

    }

    render() {
        return (
            <div className="artical-wrap">
                <Scrollbars 
                    style={{ width: 860, height: 634, }}
                    renderThumbVertical={({ style, ...props }) =>
                        <div {...props} style={{ ...style, borderRadius:8,backgroundColor:'#E5E5E5', width: '4px', }}/>
                    }
                >  
                    <div className="artical-content" dangerouslySetInnerHTML={{__html:this.state.content}}></div>
                </Scrollbars>
            </div>
        )
    }
}