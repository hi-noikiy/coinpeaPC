/* 
    福利页面
*/

import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import { Tabs } from 'antd';
import Background from '../assets/04_01.banner_background.png';
import WealItem from '../components/weal/WealItem'
import './Weal.scss';
const TabPane = Tabs.TabPane;
var sectionStyle = {
    width: "100%",
    height: "450px",
    backgroundImage: `url(${Background})` 
  };


class Weal extends Component {
  state = {
    tradeList: [
      {
          name:'全部 ',
          data:[
                  {
                      cName:'BITCOIN OS 糖果分发，持有以太坊即可领取',
                      price:'10 BTC : 1 LTBC',
                      count:' 持有 BTC',
                      type:'0',
                      coinId:' 2018-03-16',
                  },
                  {
                    cName:'BITCOIN OS 糖果分发，持有以太坊即可领取',
                    price:'10 BTC : 1 LTBC',
                    count:' 持有 BTC',
                    type:'1',
                    coinId:' 2018-03-16',
                   
                },

                  
          ]
      },
      {
          name:'进行中',
          data:[
            {
                cName:'BITCOIN OS 糖果分发，持有以太坊即可领取',
                price:'10 BTC : 1 LTBC',
                count:' 持有 BTC',
                type:'0',
                coinId:' 2018-03-16',
               
            },
                  
          ]
      },
      {
          name:'即将发放',
          data:[
            {
                cName:'BITCOIN OS 糖果分发，持有以太坊即可领取',
                price:'10 BTC : 1 LTBC',
                count:' 持有 BTC',
                type:'1',
                coinId:' 2018-03-16',
              
            },
            {
                cName:'BITCOIN OS 糖果分发，持有以太坊即可领取',
                price:'10 BTC : 1 LTBC',
                count:' 持有 BTC',
                type:'1',
                coinId:' 2018-03-16',
               
            },
            {
                cName:'BITCOIN OS 糖果分发，持有以太坊即可领取',
                price:'10 BTC : 1 LTBC',
                count:' 持有 BTC',
                type:'1',
                coinId:' 2018-03-16',
               
            },
                  
          ]
      },
      {
          name:'已结束',
          data:[
            {
                cName:'BITCOIN OS 糖果分发，持有以太坊即可领取',
                price:'10 BTC : 1 LTBC',
                count:' 持有 BTC',
                type:'2',
                coinId:' 2018-03-16',
               
            },
                  
          ]
      },
  ],
  }
  componentDidMount() {

  }
  changeTardeArea = (val) => {
    console.log(val)
}

  render() {
    const paneList = this.state.tradeList.map( (item, index) => {
      return (
                  <TabPane
                      tab={item.name}
                      key={index.toString()}
                  >
                  <WealItem
                        tradeList={item.data}
                                />
                  </TabPane>
              )
    });
    return ( 
        <div id="weal">
                {/* banner */}
                <div className="weal-banner"  style={sectionStyle}>
                    <p className="p1">不错过任何一颗糖</p>
                    <p className="p2">Coinex8糖果旨在帮助优秀的区块链项目增长，并给Coinex8用户带来好处</p>   
                </div>
                {/* 内容 */}
                <div className="weal-content">
                  <Tabs
                    size="default"
                    defaultActiveKey="0"
                    onChange={this.changeTardeArea}
                >
                { paneList }               
                </Tabs>
              </div>
            </div>
    );
    }
}

export default withRouter(Weal);