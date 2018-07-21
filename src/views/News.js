/* 
    资讯页面
*/
import './News.scss';
import React, { Component } from 'react';
import { Tabs ,message } from 'antd';
import { newsTabs } from '../api/news'
import { getQueryString } from '../utils'
import NewsList from '../components/news/newsList'
const TabPane = Tabs.TabPane;
class Neaws extends Component {
    state = {
        data: [],
        NewsTabList:[],
        loading:false,
        id:0,
        firstId:0
      }

      callback(id) {
        this.setState({loading:true})
        this.props.history.push('/news?id='+id)
      }

      getTabData = async()=> {
        this.setState({loading:true})
        const res=await newsTabs();
        this.setState({loading:false})
        if(res.status === 1){
          
            if(res.status === 1){
             const id=this.props.history.location.search? getQueryString('id'):res.data[0].id
              this.setState({
                NewsTabList: res.data,
                id:id,
                firstId:res.data[0].id
              });
            }else{
          
              message.info(res.msg)
            }
        }
        
      }
      componentDidMount() {
          this.getTabData();
      }
     
   
    render () {
      const id=this.props.history.location.search?getQueryString('id'):this.state.firstId
      const paneList = this.state.NewsTabList.map((item, index) => {
        return (
          <TabPane tab={item.typeName} key={item.id}>
            <NewsList typeid={item.id}></NewsList>
          </TabPane>
                )
      });
        return (
          <div className="neawBox">
              <ul className="neawsL">
                <li> 
                  <Tabs onChange={this.callback.bind(this)} tabPosition='left' className="newsTabs" activeKey={id.toString()} >
                    { paneList } 
                  </Tabs>
                </li>
                </ul>                       
            </div>
        )
    }
}
export default Neaws;

