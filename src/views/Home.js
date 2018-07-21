/* 
    Home页入口
    HomeTables: Home页交易区tab列表
    MarKetLine: Home页小折线图
    Advertising: Home页底部广告
*/
import React, { Component } from 'react';
//import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Carousel, Modal, Button } from 'antd';
import { is, fromJS } from 'immutable';
import Websocket from 'react-websocket';

//自定义组件
import HomeTabsList from '../components/home/HomeTabsList';
import MarKetLine from '../components/home/MarketLine';
import Advertising from '../components/home/Advertising';
import Banner from '../components/home/Banner';

import intl from 'react-intl-universal';
import apple from '../assets/QRcode.jpeg';


//action
import { 
        ACTION_FETCH_TABS_LIST,
         ACTION_SAVE_COIN_LOCAL, 
         ACTION_SORT_TABS_24H,
        ACTION_SORT_TABS_COUNT,
        EMIT_UPDATA_COINAREA_HOME,
        SAVE_EXCHANGE_RATA,
        FIRLTERS_AREA__LIST
      } from '../components/home/HomeTabsListRedux';
import { CLEAR_LOGIN_ACTIONS,  } from './LoginRedux';


//api 
import  { getCarousel, validate } from '../api/home';

import './Home.scss';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowSearch:false,
            carouselData:[],
            wsUrl:'',
            coinList:[],
            validateLock:false,
            bannerState:false,
        }
    }
    
    componentDidMount() {
        this.showModal();
        this.getCarousel();
        const wsUrl = window.location.hostname;
        this.setState({
            wsUrl:wsUrl
        })
    }

    componentWillUnmount(){
     
        this.setState = (state,callback)=>{
            return{};
          };  

          /* if( this.refWebSocketCoinHome && this.refWebSocketCoinHome.state && this.refWebSocketCoinHome.state.ws.readyState === 1) {
                this.refWebSocketCoinHome.state.ws.close();
          } */
          
    }

    // dialog
    showModal = () => {
      this.setState({
        visible: true,
      });
    }

    handleOk = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
    }

    handleCancel = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
    }

    //获取首页轮播
    getCarousel = async () => {
        const res = await getCarousel();
        if(res.status === 1)  {
            this.setState({
                carouselData:res.data
            })
        }
        
    }
     //websocket 获取交易区数据
     areaHandleData = (data) => {
         
        const res = JSON.parse(data);
  
        if(Object.prototype.toString.call(res) !==  "[object Array]") {
           
            this.props.updateCoins(res.id, res); 
           
        } else {
         
            this.props.getCoin(JSON.parse(data), this.props.loginState);
            if(!this.state.coinList.length) {
             
                this.setState({
                    coinList: res
                })
            }
        }
       
    }

    areaHandleOpen =() => {
       if(this.state.validateLock) return;
        validate().then(res => {
            if(res.status === 1) {
                if(res.data.loginstatus === 1) {
                    this.setState({
                        validateLock:true
                    })
                    
                } else {
                   // message.info(res.msg);
                    this.props.clearLogin();
                    this.setState({
                        validateLock:false
                    })
                }

                this.props.saveExRate(res.data);
                this.refWebSocketCoinHome && this.refWebSocketCoinHome.state.ws.send(res.data.houseId); 

            } else {
                message.error(res.msg)
            }
            

           
           
        })
       
    }


    shouldComponentUpdate(nextProps, nextState) {

        const thisProps = this.props || {}, thisState = this.state || {};
       
        if(this.props.tradeTabslist.tradeList.length) return true;
        if( Object.keys(thisProps).length !== Object.keys(nextProps).length ||
             Object.keys(thisState).length !== Object.keys(nextState).length) {
              
            return true;
        }
        
        for (const key in nextProps) {
            if (!is(fromJS(thisProps[key]), fromJS(nextProps[key]))) {
                return true;
            }
          }
        
          for (const key in nextState) {
        
            if (thisState[key] !== nextState[key] || !is(fromJS(thisState[key]),fromJS(nextState[key]))) {
               
                return true;
            }
          }

          return false;
        
    }
  
    render (){
       
        const wsUrl = window.location.hostname === 'localhost' ? 'www.coinex8.com' : window.location.hostname ;
        const imgList = this.state.carouselData.map( ( item ) => {
          return <img  
                        src={item.imgUrl} 
                        alt=" " 
                        key={item.id.toString()} 
                        onClick={(e) => { if(!item.contextUrl) return; e.stopPropagation(); window.open(item.contextUrl);}}
                />
      })
        return (
            <div id="home">
                {/* banner */}
                
               {/*{ !this.props.tradeTabslist.siteInfo.bannerType ?<Carousel 
                                       easing="ease-in-out"
                                       effect="fade"
                                       autoplay
                                       speed="3000"
                               >
                                 {
                                     imgList.length?imgList:<div className="frameWork">Welcome {window.location.pathname}!!!</div>
                                 }
                               </Carousel>:*/}
                <Banner />
                {/* 折线图 */}
                {/*{this.state.coinList.length > 0 ?<MarKetLine all={this.state.coinList}/> :<div style={{height:130}}></div> } */}
                

                 {/* tradeTabLis */}
                <div style={{background:"#f4f5f6",paddingTop:'30px'}} id="hom-tab-wrap">
                    <HomeTabsList 
                            {...this.props}
                        />
                     {/* 交易区websocket   47.94.84.21    47.94.194.143  ws://www.lyy.com/coinex-interface/index*/}
                     <Websocket 
                                url={`wss://${wsUrl}/coinex-interface/index`}
                                onMessage={this.areaHandleData}
                                onOpen={this.areaHandleOpen}
                                ref={
                                        Websocket => {
                                        this.refWebSocketCoinHome = Websocket;
                                }}
                        /> 
                </div>
                
               
                 {/* 底部广告 */}
                <div style={{backgroundImage:":linear-gradient(-180deg, #FFFFFF 0%, #FFFFFF 54%, #F4FAFD 99%)"}} >
               
                    <Advertising  />
                </div>
                
                {/*首页弹窗*/}
                <Modal
                  className="joinT-model"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  footer={[
                    <Button className="btn1" key="back" onClick={this.handleCancel}><a href="https://t.me/coinex8">{intl.get("官方Telegram群")}</a></Button>,
                    <Button className="btn2" key="submit" type="primary" onClick={this.handleOk}>
                      确定
                    </Button>,
                  ]}
                >
                  <h1 style={{fontSize: '18px'}}>内测中，公测即将开启</h1>
                  <p><img style={{width:'300px', height:'300px'}} src={apple} alt=""/></p>
                  <p style={{color:'#fff',lineHeight:'50px'}}>扫码添加官方微信，进官方社群</p>
                </Modal>

            </div>
        )
    }
    
    //tabs切换交易区handle
    changeTardeArea(key) {
        console.log(key);
    }

    //显示搜索框
    showSearch = () => {
      
        this.setState({
            isShowSearch: true            
        })
    }
}

const mapStateToProps = ( state =>{
   return {
         tradeTabslist:state.home.tradeList,
         loginState: state.login.loginState,
    } 
})

const mapStateToDispath = ( dispatch => {
    return {
        saveCoin:(item, areaIndex) => dispatch(ACTION_SAVE_COIN_LOCAL(item, areaIndex)),
        getCoin:(data, login) => dispatch(ACTION_FETCH_TABS_LIST(data, login)),
        sort24H:(params) => dispatch(ACTION_SORT_TABS_24H(params)),
        sortCount:(params) =>dispatch(ACTION_SORT_TABS_COUNT(params)),
        updateCoins:(coin, data) => dispatch(EMIT_UPDATA_COINAREA_HOME(coin, data)),
        clearLogin:() =>dispatch(CLEAR_LOGIN_ACTIONS()),
        saveExRate:(data) => dispatch(SAVE_EXCHANGE_RATA(data)),
        filters:(areaIndex,val) => dispatch(FIRLTERS_AREA__LIST(areaIndex, val)),
      

    }
})
export default connect(mapStateToProps, mapStateToDispath)(Home);