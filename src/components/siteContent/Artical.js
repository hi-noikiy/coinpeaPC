/* 
    站点文章组件
*/

import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { getSiteContent } from '../../api/site';
import './Artical.scss';

export default class Artical extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content:''
        }
    }


    componentDidMount() {
        this.getInfoContent();
    }



    getInfoContent = async ()=>{
        let id=this.props.typeid;
         const res =  await getSiteContent(id);
         if(res.status === 1){
            this.setState({
                content:res.data?res.data.content:'',
                title: res.data?res.data.title:'',
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
                    <h2>{this.state.title}</h2>
                    <div className="artical-content" dangerouslySetInnerHTML={{__html:this.state.content}}></div>
                </Scrollbars>
            </div>
        )
    }
}