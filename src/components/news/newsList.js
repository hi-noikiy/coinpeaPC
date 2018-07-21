/* 
    站点文章组件
*/

import React, { Component } from 'react';
import {NavLink} from "react-router-dom"; 
import moment from 'moment'; 
import { List ,message } from 'antd';
import { newsLists } from '../../api/news';
import '../../views/News.scss';


import intl from 'react-intl-universal';


export default class Artical extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          data: [],
          loading:false,
        }
    }


    componentDidMount() {
        this.getInfoContent();
    }



    getInfoContent = async ()=>{
        let id=this.props.typeid;
         const res =  await newsLists(id);
         this.setState({loading:false})
         if(res.status === 1){
            this.setState({
              data: res.data
            })
         }else{
          message.info(res.msg)
        }

    }

    render() {
        return (
          <div className="neawsR demo-infinite-container">
          <List 
              itemLayout="horizontal"
              dataSource={this.state.data}
              locale={{emptyText: intl.get('暂无数据')}}
              loading={this.state.loading}
              renderItem={(item,index) => (
              <List.Item>
                  <List.Item.Meta
                      title={item.title}  
                      description={<p className="newSumBox"><span className="newSummary">{item.summary}</span><NavLink className="moreNeaw" to={{ 
                        pathname: '/neaws_details',    
                        state:{id:item.articleType,index:index} 
                      }}>[{intl.get('详细')}]</NavLink></p>}
                  />
                  <div className="newsTime">{moment(item.createTime).format("YYYY-MM-DD")}</div>
              </List.Item>
              )}
          >
          </List>
        </div>
        )
    }
}