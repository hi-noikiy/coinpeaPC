/* 
    选择币
*/

import React from 'react';
import { Icon, Tabs} from 'antd';
import cs from 'classnames';
import './SelectCoin.scss';

import intl from 'react-intl-universal';
const TabPane = Tabs.TabPane;

class SelectCoin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowCoin:false
        }
        
    }

    componentDidMount() {
        document.onclick= () => {
        
            if(this.state.isShowCoin) {
                this.setState({
                    isShowCoin:false,
                })
            }
            
        }
    }
    
   componentWillUnmount() {
       document.onClick = null;
   }

    componentWillReceiveProps(nextProps) {
      if(this.props.activeIndex !== nextProps.activeIndex && this.state.isShowCoin) {
          this.setState({
            isShowCoin:false
          })
      }
    }

    hdClick = (e) => {

        e.stopPropagation();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        this.setState((preState) => {
            return {
                isShowCoin : !preState.isShowCoin
            }
        });
       
       
    }

    changeID = (e,id) =>{
        
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        e.nativeEvent.stopPropagation();
        this.hdClick(e);
        this.props.coinClick(e, id);
        
       
    }

    render() {

        const menu = this.props.coinList.map((item, index) => {
            
              const list = item.regionCoinRelations.map( (val, i) => {
                  return (
                            <span 
                                 onClick={(e)=> {
                                     e.nativeEvent.stopPropagation();
                                     e.stopPropagation();
                                     e.nativeEvent.stopImmediatePropagation();
                                     this.changeID(e, val.id)}}
                                 key={(Math.random()**2).toString()}
                                 className={cs("coin-name",this.props.activeCoinIndex===val.id?'isActive':'')}
                            >
                                <img style={{ verticalAlign:'middle', marginRight:8 }} alt=""  src={val.icoinUrl} />
                                <span>{val.sortName}</span>
                            </span>
                        ) 
              });
            
              const list_wrap = item.regionCoinRelations.map( (item, index) => {
                    if(index%4 === 0) {
                        return <div className="coin-name-wrap" key={(Math.random()**3).toString()}>{list.splice(0,4)}</div>
                    }
                    return " ";
                
              });
           
              return (
                <TabPane 
                    tabPosition='left'
                    key={(Math.random()**2).toString()}
                    tab={item.coinName+intl.get('交易区')}
                    className="coinList"
                >
                    
                    {list_wrap}
                </TabPane>
              )
             
        });
      
        const id = this.props.activeCoinIndex;
        let selectData;
        this.props.coinList.map( e => {
            const data1 = e.regionCoinRelations.filter(e=>e.id === id);
            if(data1.length){
                selectData = data1[0]
            }
        });

        return(
            <div className="select-coin">
                    <div className="menu-wrap">
                        <div className="menu-hd" onClick={(e) => this.hdClick(e)}>
                            <img src={selectData.icoinUrl} alt="" style={{ verticalAlign: 'middle',marginRight:8 }}  />
                            <span className="menu-hd-span">{selectData.name}</span>
                            <Icon type={this.state.isShowCoin ? "caret-up" : "caret-down"}  style={{marginLeft:6}}/>
                        </div>
                        <div className={cs("menu-body",{'isShow-menu': this.state.isShowCoin})} onClick={(e) =>{
                                                                                                                    e.stopPropagation();
                                                                                                                    e.nativeEvent.stopPropagation();
                                                                                                                    e.nativeEvent.stopImmediatePropagation();
                            }}>
                            <Tabs tabPosition="left" size="large">{menu}</Tabs>
                        </div>
                    </div>

            </div>
        )
    }
}

export default SelectCoin;