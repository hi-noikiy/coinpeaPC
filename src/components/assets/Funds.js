/**
 * 资产管理资金页面
 */
import { Icon, Input, Switch, Table } from 'antd';
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { connect } from 'react-redux';
import { precision_zero } from '../../utils';

//css
import './Funds.scss';
import { EMIT_HIDE_ASSETS, GetAssetInfo } from './FundsRedux';




//图片
//import coinPic from '../../assets/02_01.day_and_night.png';

const InputGroup = Input.Group;

class Funds extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assetlist: {},
            data: [],
            focus: false,
            hideAsset: false,
            initData: [],
            loading: false,
            value: ''
        }
    }

    componentDidMount() {
        this.props.GetAssetInfo(); //获取个人资产信息
        //this.getAssetlist();  //获取资产列表
    }


    // 获取资产列表
    /*   getAssetlist(){
          this.setState({ loading: true })
          GetUserAssetList().then(data=>{
              if(data.status === 1) {
                  data.data.forEach(item => {
                      item.total = addTotal(item.frozen_fmt, item.total_fmt);
                      item.valuation = times(addTotal(item.frozen_fmt, item.total_fmt), item.coinBasicInfoDo.lastDealPrize);
                  })
  
                  this.setState({
                      data:data.data,
                      initData: data.data,
                      loading: false,
                  })
              } else {
                  message.error(data.msg)
              }
             
          })
      } */

    handleInputChange(e) {
        this.setState({
            value: e.target.value,
        });
        this.handleSearch(e, e.target.value);
    }

    handleFocusBlur(e) {
        this.setState({
            focus: e.target === document.activeElement,
        });
    }

    handleSearch(e, value) {

        this.props.EMIT_HIDE_ASSETS(value, undefined, undefined, value) //return this.setState({data: [].concat(this.state.initData)});
        /*   const searchResult = this.state.initData.filter((item,index)=>{
              return item.coinBasicInfoDo.englishName.indexOf(value) > -1;
          });
        
          this.setState({
              data: searchResult
          }) */
    }


    //
    render() {

        const columns = [{
            className: 'colum1',
            dataIndex: 'coinType',
            key: 'coinType',
            title: intl.get('币种')
        }, {
            className: 'colum2',
            dataIndex: 'allName',
            key: 'allName',
            title: intl.get('全称'),

        }, {
            className: 'colum3',
            dataIndex: 'total',
            key: 'total',
            sorter: (a, b) => a.total - b.total,
            title: intl.get('总额'),

        }, {
            className: 'colum4',
            dataIndex: 'balance',
            key: 'balance',
            title: intl.get('可用余额'),
        }, {
            className: 'colum5',
            dataIndex: 'freeze',
            key: 'freeze',
            title: intl.get('下单冻结'),

        },
        {
            className: 'recharge',
            dataIndex: '',
            render: (text, record) => <a href="javascript:void(0);"
                className={record.withdrawStatus ? "" : "no-trade"}
                onClick={
                    e => this.props.changeTab(1, record.coinId, record.sortName, record.withdrawStatus, record.total, record.freeze, record.balance, record.icon, record)
                }
            >{intl.get('充值')}</a>,
            title: intl.get('操作'),

        },
        {
            className: 'withdraw',
            dataIndex: '',
            render: (text, record) => <a href="javascript:void(0);"
                onClick={e => this.props.changeTab(2, record.coinId, record.sortName, record.rechargeStatus, record.total, record.freeze, record.balance, record.icon)}
                className={record.rechargeStatus ? "" : "no-trade"}
            >{intl.get('提币')}</a>,
            title: '',


        }
        ];
      
        const AssetsList = this.props.assetsInfo.data ? this.props.assetsInfo.data.map((item, index) => {
            return {
                allName: item.coinBasicInfoDo.englishName.toUpperCase(),
                balance: item.total_fmt,
                coinId: item.coinBasicInfoDo.id,
                coinType: <p><img src={item.coinBasicInfoDo.icoinUrl} alt="icon" /><span>{item.coinBasicInfoDo.sortName}</span></p>,
                freeze: item.frozen_fmt,
                icon: item.coinBasicInfoDo.icoinUrl,
                key: index,
                rechargeStatus: item.coinBasicInfoDo.rechargeStatus,
                sortName: item.coinBasicInfoDo.sortName,
                total: precision_zero(item.total, 8),
                valuation: item.valuation,
                withdrawStatus: item.coinBasicInfoDo.withdrawStatus,

            }
        }) : [];
 
        return (
            <div className="funds-wrap">
                <div className="funds-wrap-top clear">
                    <div className="funds-wrap-topL clear">
                        <div className="ant-search-input-wrapper">
                            <InputGroup>
                                <Input
                                    placeholder={intl.get("搜索")}
                                    value={this.state.value}
                                    onChange={this.handleInputChange.bind(this)}
                                    onFocus={this.handleFocusBlur.bind(this)}
                                    onBlur={this.handleFocusBlur.bind(this)}
                                />
                            </InputGroup>
                            <Icon type="search" style={{ color: this.state.focus ? '#3DADD9' : '#B0BDCE' }} />
                        </div>
                        <div className="hide-assets">
                            <span>{intl.get("隐藏小额资产")}</span>
                            <Switch defaultChecked={false} onChange={this.hideAssets.bind(this)} />
                        </div>
                    </div>
                    <div className="funds-wrap-topR">
                        {/* 
                        勿动！！！
                       <p>总当前估值：<b>{this.props.assetsInfo.totalBTC} BTC / ¥ {this.props.assetsInfo.convert}</b></p> */}
                        {/*  <p>
                            <span>24h提现额度：{this.props.assetsInfo.userWithdraw}BTC</span>
                            <span>已用：{this.props.assetsInfo.withdrawQuota}BTC</span>
                        </p> */}
                    </div>
                </div>
                <Table pagination={false} loading={this.props.assetsInfo.loading} columns={columns} dataSource={AssetsList} locale={{ 'emptyText': intl.get('暂无数据') }} />
            </div>
        )

    }

    hideAssets(checked) {
        if (checked) {
            this.props.EMIT_HIDE_ASSETS(0, 'hide', true, this.state.value)

            this.setState({
                hideAsset: checked,
                //data:lowAssets
            });
        }
        else {
            this.props.EMIT_HIDE_ASSETS(0, 'hide', false, this.state.value)
            this.setState({
                data: [].concat(this.state.initData),
                hideAsset: checked,

            })
        }


    }

}

const mapStatetoProps = (state) => {
    return {
        assetsInfo: state.assets.Funds,
    }
}

const actionCreators = { GetAssetInfo, EMIT_HIDE_ASSETS };

export default connect(
    mapStatetoProps,
    actionCreators
)(Funds);