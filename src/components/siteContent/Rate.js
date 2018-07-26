/* 
    费率说明
*/

import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { getSiteContent } from '../../api/site';
import { Table } from 'antd';
import img from '../../assets/07_08.commission.png'
import './Rate.scss';


const columns = [{
    title: '币种',
    dataIndex: 'coinType',
    key: 'coinType',
    className: 'colum1'
  }, {
    title: '对BTC交易费',
    dataIndex: 'btcRate',
    key: 'btcRate',
    className: 'colum2'
  }, {
    title: '对USDT交易费',
    dataIndex: 'usdtRate',
    key: 'usdtRate',
    className: 'colum3'
  }, {
    title: '对QC交易费',
    dataIndex: 'qcRate',
    key: 'qcRate',
    className: 'colum4'
  }, {
    title: '提现费率',
    dataIndex: 'getRate',
    key: 'getRate',
    className: 'colum5'
  }, {
    title: '单笔限额',
    dataIndex: 'oneLimit',
    key: 'oneLimit',
    className: 'colum6'
  }, {
    title: '单日限额',
    dataIndex: 'dayLimit',
    key: 'dayLimit',
    className: 'colum7'
  }];

export default class btcRate extends Component {
    
    constructor(props) {
        super(props);
        this.state ={
          loading:false,
          rateDate:[{
            key:1,
            coinType: <span><img src={img} alt=''/>WTB</span>,
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:2,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:3,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:4,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:5,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:6,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:7,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:8,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:9,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:10,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:11,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:12,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:13,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:14,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:15,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:16,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        },{
            key:17,
            coinType:'WTB',
            btcRate:'0.2%',
            usdtRate:'0.2%',
            qcRate:'0.2%',
            getRate:'0.2%',
            oneLimit:'2000WTB',
            dayLimit:'  500000WTB'
        }]
        }
    }


    componentDidMount() {
      
    }

    getRate(){
        this.setState({ loading: true });
        getSiteContent(this.props.typeid).then(data=>{
            this.setState({
              rateDate:data,
              loading: false
            }) 
        })
    }

    render() {
        return (
            <div className="rate-wrap">
                  <ul className="rate-head clear">
                    <li>币种</li>  
                    <li>对BTC交易费</li>  
                    <li>对USDT交易费</li>  
                    <li>对QC交易费</li>  
                    <li>提现费率</li>  
                    <li>单笔限额</li>  
                    <li>单日限额</li>  
                  </ul>
                  <Scrollbars style={{ height: 654 }}>
                    <Table pagination={false} loading={this.state.loading} showHeader={false} columns={columns} dataSource={this.state.rateDate} />
                  </Scrollbars>
                
            </div>
        )
    }
}