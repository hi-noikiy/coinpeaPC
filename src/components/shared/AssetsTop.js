/* 
    资产管理提币和充值页面公共
*/
import React, { Component } from 'react';
import { Select } from 'antd';
//import coinPic from '../../assets/02_01.day_and_night.png';
import './AssetsTop.scss'
const Option = Select.Option;

class AssetsTop extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
    componentDidMount() {
    }

    componentWillUnmount(){
    }

    render() {
        const op = this.props.cointype.map( (item,index) =>{
            return <Option key={item.name} value={item.name}><img src={item.url}  alt="images" /> {item.name}</Option>
        })

        const df = <p><img src={this.props.cointype[0].url}  alt="images"/> {this.props.cointype[0].name}</p>

        return (
            <div className="assets-wrap-top clear">
                <Select showSearch
                    defaultValue={df}
                    onChange={ this.props.changeCoin }
                >
                    {op}
                </Select>
                <ul className="clear coinAssets">
                    <li>总额<br/><span>{this.props.cointype[this.props.nowCoin].all}</span></li>
                    <li>冻结<br/><span className="freeze">{this.props.cointype[this.props.nowCoin].freeze}</span></li>
                    <li>可用<br/><span>{this.props.cointype[this.props.nowCoin].usable}</span></li>
                </ul>
            </div>
        )
    }
    
}




export default AssetsTop