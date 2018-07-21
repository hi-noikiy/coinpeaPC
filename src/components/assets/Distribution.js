/**
 * 资产管理资金页面
 */
import { Table , Select , DatePicker ,Button ,message} from 'antd';
import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { precision_zero } from '../../utils';
import { distributeRecords } from '../../api/funds';
import moment from 'moment'

//css
import './Distribution.scss';

const Option = Select.Option;

class Distribution extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            value: '',
            option:[
              {"title":intl.get("全部")},
              {"title":intl.get("手续费现金分红")},
              {"title":intl.get("交易挖矿")},
              {"title":intl.get("佣金")},
            ],
            startValue: null,
            endValue: null,
            endOpen:false,
            pagination:{
              total: 0,
              current:1,
              hideOnSinglePage:true,
              pageSize:15,
              showQuickJumper:true,
              next:1,
              pre:1,
              position:"bottom",
            },
            selsect:{
              value:null,
              type:null
            },
            disabledBtn:false
        }
    }

    componentDidMount() {
      const startTime = this.state.startValue;
      const endTime = this.state.endValue;
      const type = this.state.selsect.type;
      const numPerPage = this.state.pagination.pageSize;
      const pageNum = this.state.pagination.current;
      this.getDistributelist({startTime,endTime,type,pageNum,numPerPage});  //获取列表
    }

    //获取列表
    getDistributelist(params){
          distributeRecords(params).then(data=>{
              if(data.status === 1) {
                  this.setState({
                      data:data.data,
                      loading: false,
                      pagination:{
                        total: data.page.totalCount,
                        current: data.page.pageNum,
                        hideOnSinglePage:true,
                        pageSize:data.page.numPerPage,
                        showQuickJumper:true,
                        next:data.page.nextPage,
                        pre:data.page.prePage,
                        position:"bottom",

                    }
                  })
              }
             
          })
    } 

    onStartChange = (value) => {
      this.onChange('startValue', value);
    }
  
    onEndChange = (value) => {
      this.onChange('endValue', value);
    }

    handleStartOpenChange = (open) => {
      if (!open) {
          this.setState({ endOpen: true });
      }
    }
  
    handleEndOpenChange = (open) => {
      this.setState({ endOpen: open });
    }

    handleChange( value , e) {
        this.setState({
          selsect:{
            value:value,
            type:e.key === '0'?null:Number(e.key)
          }
        });
    }

    
    //结束日期区间    
    disabledEndDate = (endValue) => {
      const startValue = this.state.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return endValue.valueOf() <= startValue.valueOf();
    }

    //开始日期区间
    disabledStartDate = (startValue) => {
      const endValue = this.state.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    }

    onChange = (field, value) => {
      this.setState({
        [field]: value,
      });
    }

    //搜索
    serachHandle = () =>{
      if(this.state.startValue&&!this.state.endValue){
        this.setState({
          disabledBtn:true
        });
        message.error(intl.get('请选择结束时间'),2,() =>{
          this.setState({
              disabledBtn:false
          })
        });
      }else if(this.state.endValue&&!this.state.startValue){
        this.setState({
          disabledBtn:true
        });
        message.error(intl.get('请选择开始时间'),2,() =>{
          this.setState({
              disabledBtn:false
          })
        });
      }else{
        this.getDistributelist({
          numPerPage:this.state.pagination.pageSize,
          pageNum:1,
          endTime:this.state.endValue,
          startTime:this.state.startValue,
          type:this.state.selsect.type
        });
        this.setState({
          pagination:{
            current:1,

          }
        })
      }
    }

    // 分页
    getTabsData = (page) => {
      this.setState({
        pagination:{
          total:page.total,
          current:page.current,
          hideOnSinglePage:true,
          pageSize:this.state.pagination.pageSize,
          showQuickJumper:true,
          next:page.next,
          pre:page.pre,
          position:"bottom",
        }
      })
      this.getDistributelist({
        numPerPage:this.state.pagination.pageSize,
        pageNum:page.current,
        endTime:this.state.endValue,
        startTime:this.state.startValue,
        type:this.state.selsect.type
      });


    }

    render() {
      const { startValue, endValue, endOpen } = this.state;
      const columns = [{
            className: 'colum1',
            dataIndex: 'time',
            key: 'time',
            title: intl.get('时间')
        }, {
            className: 'colum2',
            dataIndex: 'type',
            key: 'type',
            title: intl.get('类型'),

        }, {
            className: 'colum3',
            dataIndex: 'coinType',
            key: 'coinType',
            title: intl.get('币种'),

        }, {
            className: 'colum4',
            dataIndex: 'number',
            key: 'number',
            title: intl.get('数量'),
        }, {
            className: 'colum5',
            dataIndex: 'lable',
            key: 'lable',
            title: intl.get('备注'),

        }
      ];
      
      const AssetsList = this.state.data.length ? this.state.data.map((item, index) => {
            return {
                coinType: item.coinName,
                time:moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
                type:item.remark,
                number: item.quantity,
                lable:item.remark,
                key: item.id
            }
      }) : [];

      const OptionList = this.state.option.map( (item, index) => {  
        return  <Option value={item.title} key={index} title={item.title}>{item.title}</Option>

    });
 
        return (
            <div className="distribution-wrap">
                <div className="funds-wrap-top clear">
                    <div className="funds-wrap-topL clear">
                      {/* 选择日期 */}
                      <div className="select-date">

                        <DatePicker
                            className="my-datepiker"
                            disabledDate={this.disabledStartDate}
                            dropdownClassName="my-datepeker-dropdown"
                            showToday={false}
                            size="large"
                            format="YYYY-MM-DD"
                            value={startValue}
                            placeholder={intl.get("请选择开始时间")}
                            onChange={this.onStartChange}
                            onOpenChange={this.handleStartOpenChange}
                            style={{verticalAlign:'bottom'}}
                        />
                        <span style={{marginRight:15, marginLeft:15}}>{intl.get("至")}</span>
                        <DatePicker
                            className="my-datepiker"
                            size="large"
                            disabledDate={this.disabledEndDate}
                            dropdownClassName="my-datepeker-dropdown"
                            showToday={false}
                            format="YYYY-MM-DD"
                            value={endValue}
                            placeholder={intl.get("请选择结束时间")}
                            onChange={this.onEndChange}
                            open={endOpen}
                            onOpenChange={this.handleEndOpenChange}
                            style={{verticalAlign:'bottom'}}
                        />

                        <Select 
                          style={{ width: 150,marginLeft:15,marginTop:2 }} 
                          onChange={this.handleChange.bind(this)}
                          optionFilterProp="children"
                          showSearch
                          value={this.state.selsect.value?this.state.selsect.value:intl.get('请选择类型')}
                        >
                          { OptionList }
                        </Select>

                        <Button size="large" type="primary"  style={{marginLeft:15,width:'80px',fontSize:'14px',borderRadius:0}} onClick={this.serachHandle} disabled={this.state.disabledBtn}>{intl.get("查询")}</Button>
                      </div>
                    </div>
                </div>
                <Table 
                  pagination={this.state.pagination} 
                  loading={this.state.loading} 
                  columns={columns} 
                  dataSource={AssetsList} 
                  onChange={this.getTabsData.bind(this)}
                  locale={{ 'emptyText': intl.get('暂无数据') }} 
                />
            </div>
        )

    }


}


export default Distribution;