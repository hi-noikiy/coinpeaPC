import React, { Component } from 'react';
import { Button } from 'antd';
import '../../views/Weal.scss';


export default class wealItem extends Component {
    
          render() {
          
                const TrList = this.props.tradeList.map( (item, index) => {
                    
                        return (
                            <dl className="weal_dl"  key={index.toString()}>
                            <dt>                                           
                                <img src={require('../../assets/07_08.copy_button02.png')} alt="" />
                                {
                                    item.type == '0 '
                                    ?
                                    <p>进行中</p>
                                    :
                                    (
                                        item.type == '1'
                                        ?
                                        <p className="colorBlue">即将发放</p>
                                        :
                                        (
                                            item.type =='2'
                                            ?
                                            <p className="colorHui">已结束</p>
                                            :
                                            <p>进行中</p>
                                        )

                                    )

                                }
                                
                            </dt>
                            <dd>
                            
                                <h3>{item.cName}</h3>
                                <p><span>派发规则:</span> 10 BTC : 1 LTBC</p>
                                <p><span>派发要求: </span>持有 BTC</p>
                                <p><span>区块高度: </span>501225</p>
                                <p><span>截止日期: </span>2018-03-16</p>
                                {
                                    item.type == '0 '
                                    ?
                                    <Button className="btn">存入</Button>
                                    :
                                    (
                                        item.type == '1'
                                        ?
                                        <Button disabled className="btn colorHui">即将发放</Button>
                                        :
                                        (
                                            item.type == '2'
                                            ?
                                            <Button disabled className="btn colorHui">已结束</Button>
                                            :
                                            <Button className="btn">存入</Button>
                                        )

                                    )

                                }
                                
                            </dd>
        
                        </dl>
                        )
                });
    
                return (
                    <div>
                        {TrList}
                    </div>
                )    
          }
    
        
      }