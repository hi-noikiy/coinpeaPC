/* 
    选择币
*/

import React from 'react';
import { Avatar, Icon } from 'antd';
import cs from 'classnames';
import './SelectCoin.scss';
import './CommonSelect.scss';

class CommonSelect extends React.Component {

    state = {
        isShowCoin:false,
       
    }

 

    hdClick = () => {
      
        if(!this.state.isShowCoin) {
           
            this.setState({
                isShowCoin : true
            });

        } else {
            this.setState({
                isShowCoin : false
            })
        }
        
    }

    render() {
      
        const menu = this.props.coinList.map((item, index) => {
               
                return (
                            <span 
                                onClick={
                                        (e)=>{
                                                e.stopPropagation();
                                                this.props.coinClick(item.id, item.sortName, item.icoinUrl, item.rechargeStatus, item.withdrawStatus);
                                                this.hdClick();
                                            }
                                    }
                                 key={(Math.random()**2).toString()}
                                 className="coin-name"
                            >
                                <Avatar style={{verticalAlign:'middle', marginRight:8 }} size="small"  src={item.icoinUrl} />
                                <span className={this.props.activeCoinIndex===item.icoinUrl?'isActive':''}>{item.sortName}</span>
                            </span>
                        ) 
  
        });

        const list_wrap = menu.map( (item, index) => {
            if(index%4 === 0) {
                return <div className="coin-name-wrap" key={(Math.random()**3).toString()}>{[].concat(menu).splice(index,4)}</div>
            }
            return null;
        
        });
       
        return(
            <div className="select-coin">
                    <div className="menu-wrap">
                        <div className="menu-hd" onClick={this.hdClick}>
                            <Avatar style={{ backgroundColor: 'none', verticalAlign: 'middle',marginRight:8 }} size="large" src={this.props.coinIcon}/>
                            <span className="menu-hd-span">{this.props.coinName}</span>
                            <Icon type={this.state.isShowCoin ? "caret-up" : "caret-down"}  style={{marginLeft:6}}/>
                        </div>
                        <div className={cs("menu-body",{'isShow-menu': this.state.isShowCoin})} >
                            <div className="coin-wrap">
                                {list_wrap}
                            </div>
                        </div>
                    </div>

            </div>
        )
    }
}

export default CommonSelect;