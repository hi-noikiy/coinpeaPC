/* 
    头部导航
*/
import React from 'react';
import { NavLink, withRouter, RouteComponentProps,  } from 'react-router-dom';
import { connect } from 'react-redux';
import cs  from 'classnames';
import intl from 'react-intl-universal';

//action
import { Icon,  Carousel,   Popover, message} from 'antd';
import { ACTION_IS_ADD_CLASS,
         ACTION_IS_HIDE_NOTIFY,
         ACTION_IS_REMOVE_CLASS,
        } from './NavRedux';
import { CLEAR_LOGIN_ACTIONS , CHANGE_SELECT_LANG} from '../views/LoginRedux';
import { IRootState } from '../redux/initState';

//工具函数         
import { formatStr, _LocalStorage, times, setPrecision , createdSymbol} from '../utils';

//api
import { getNotice } from '../api/home';
import { loginOut } from '../api/regist';
import $ from 'jquery';
 //css
import './Nav.scss';

interface NavState {
    notice: Array<any>
    lock: boolean;
    curLang: string;
    showPop:boolean;
    showLang:boolean;
}

interface  NavProps extends RouteComponentProps<any> {
    isAddClass: boolean;
    isHideNotify: boolean;
    login: any;
    [propName: string]: any;
}

class Nav extends React.Component<NavProps, any> {
   
    readonly state:NavState;

    constructor(props:NavProps) {
       super(props);
       this.state = {
			 notice: [],
             lock:false,
             curLang:'zh_CN',
             showPop: false,
             showLang:false
        }
   }

   componentDidMount() {
        this.getNotice();
        const ls = new _LocalStorage();

        if(ls.get('lang')) {
            this.setState({
                curLang:ls.get('lang')
            })
        }
 
   }

   componentWillReceiveProps(nextProps) {
        if(nextProps.location.pathname.indexOf('/klineTrade') > -1) {
            $('.coinPea').css('display', 'none');
        } else {
        $('.coinPea').css('display', 'block');
        }
    }
   
 
   //退出登录
    loginOut = async () => {
		if(this.state.lock) return;

		this.setState({
			lock:true
        })
     
		const res = await loginOut(); 
		if(res.status === 1)  {
			// Message.success(res.msg);
            this.props.clearLogin();
            window.location.reload();
		} else message.error(res.msg);

            this.setState({
                lock:false
            })
    }

    //跳转
    redirect = (path) => {
        return () => {  
           this.props.history.push(path);
           this.setState({
                showPop:false
            })
        }
    }
    //选择语言
    langChange = (e) => {
        e.stopPropagation();
        $('.lang-ifont').addClass('langhove')
        const langMenu = this.refs.langMenu as HTMLElement;
        const a = langMenu.getElementsByClassName('select-lang-wrap')[0] as HTMLElement;
        a.style.opacity="1";
        a.style.display="block";
        a.style.zIndex="888";
       
    }

    langLive = (e) => {
        e.stopPropagation();
        $('.lang-ifont').removeClass('langhove');

        const langMenu = this.refs.langMenu as HTMLElement;
        const a = langMenu.getElementsByClassName('select-lang-wrap')[0] as HTMLElement;
        a.style.opacity="0";
        a.style.display="none";
        a.style.zIndex="-888";
      
    }
   
    //点击导航 添加class
    addClassName = () => {
        this.props.addClass();
	}
	
    //移除导航的class
    removeClass = () => {
        this.props.reClass();
	}
	
    //隐藏广播
    hiddNotify = () => {
      
        this.props.hideNotify();
    }


    //获取公告
    getNotice = async () => {
      
        const res = await getNotice();
       
        if(res.status === 1) {
            this.setState({
                notice: res.data
            })

        } else {
			console.log(res);
		}
        
    }

     
    //计算汇率
    calculateEX = () => {
      
        const ls = new _LocalStorage();
        var exRate = 1;
        const hdData = ls.get('rate');
        const usrInfo = this.props.login.assets;
       // if(!_Map.isMap(hdData.exRate))  
      
        if(!usrInfo) return (createdSymbol(ls.get('lang'))+'0');
      
        if(ls.get('lang')) {
          
            exRate = hdData[ls.get('lang')]?hdData[(ls.get('lang'))]:hdData['BTC'];
           
        } else {
            
            //默认语言
            exRate =  hdData['zh_CN'];
          
        }
        
        const val = String(setPrecision(times(times(hdData['BTC'], usrInfo), ls.get('lang') === 'en_US'? 1: exRate)))
        if(val.indexOf('.') > -1  && val.split('.')[1] && val.split('.')[1].length >= 4) {
                const a = val.split('.');
                return (createdSymbol(ls.get('lang')) + a[0]+'.'+a[1].slice(0, 4))
        } else {
            return (createdSymbol(ls.get('lang')) + val)
        }
        
      // return  (this.createdSymbol(ls.get('lang').lang) + times(times(hdData['BTC'], usrInfo.amount), exRate?exRate:1))
        
    }

    selecLang = (lang) => {
        const ls = new _LocalStorage();
        ls.set('lang', lang);
        window.location.reload(true);   

        this.props.changeLang(lang);
      //  this.props.selectLang(lang); 
        this.setState({
            curLang:lang
        });
    }

    isPhone(){
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            return true
        }
        return false
    }


    showChange(e){
        this.setState({
            showPop:e
        })
    }


    render() {
        const { usrInfo  } = this.props.login;
        
      
        let style;
        let addNavClass;
        if(window.location.pathname !== '/' && window.location.pathname !== '/ex/'  && window.location.pathname !== '/ex' && window.location.pathname !== '/ex/activity'&& window.location.pathname !== '/ex/myInviteNew') {
             style = {position:'relative'};
             addNavClass = true;
          
        } else {
            style =  {position:'absolute'};
            addNavClass = false;
        }
      
       /* 用户信息Pop层 */
       const title = (
                        <div className="pop-usr-top">
                        <img src={require('./../assets/01_02.portrait02.png')} alt='' width="28" height="28"/>
                              <p className="username">{formatStr(usrInfo.username)}</p>
                              <p>ID：{usrInfo.id}</p>
                        </div>
                    );
       const content = (
                            <div className="pop-usr-body">
                                <a href="javascript:;" onClick={this.redirect('/personal')} className="pop-usr-body-top">
                                    <span>{intl.get("账户信息")}</span>
                                    <Icon type="right" />
                                </a>
                                <a href="javascript:;" onClick={this.redirect('/assets')} className="pop-usr-body-bottom">
                                    <span>{intl.get("资产信息")}</span>
                                    <div className="pop-usr-body-assets">
                                        {/* <div>
                                            <p>{assets} BTC</p>
                                            <p>( {this.calculateEX()} )</p>
                                        </div> */}
                                        <Icon type="right" />
                                    </div>
                                </a>
                                <div className="login-out" onClick={this.loginOut}>{intl.get("退出")}</div>
                            </div>
                        );
        // const content_ex = (
        //     <div className="select-ex">
        //         <p   onClick={this.redirect('/trade')}>
        //             { intl.get('标准版')}
        //         </p>
        //         <p   onClick={this.redirect('/klineTrade')}>
        //             { intl.get('专业版')}
        //         </p>
        //     </div>
        // )

        return(
                    <div className="coinPea">
                           <div className ={ cs("inform-wrap",  {'hideNotify':this.props.isHideNotify})} 
                            style={{
                                        display:this.props.history.location.pathname !== '/' &&
                                        this.props.history.location.pathname !== '/ex' &&
                                        this.props.history.location.pathname !== '/ex/' ? 'none': 'block'}}
                            >
                            {
                                this.state.notice ?
                                <div className={cs("inform clearfix")}>
                                    <i className="inform-icon"></i>
                                    <div className="inform-l">
                                        <Carousel 
                                            className="notify"
                                            autoplay
                                            dots={false}
                                            easing="ease-in-out"
                                            vertical
                                        >
                                            {
                                                this.state.notice.map( (item,index) => {
                                                    return(
                                                        <NavLink key={Math.random().toString(36)} to={{ 
                                                            pathname: '/neaws_details',    
                                                            state:{id:item.articleType,index:index} 
                                                          }}>{item.title}</NavLink>
                                                        )
                                                })
                                            }
                                        </Carousel>
                                    </div>
                                    <Icon type="close" onClick={this.hiddNotify} />
                                </div> 
                                : null
							}
                        </div>
                   
                        <header 
                            id="header" 
                            className={addNavClass ?'isAddClass':''} 
                            style={style}
                        >
                            <nav className="header-nav">
                           
                                <div className="nav-left" 
                                     style={{
                                        display:window.location.pathname == '/ex/deal'?'none':window.location.pathname == '/ex/dealTrade'?'none':window.location.pathname == '/ex/dealWallet'?'none':'block'
                                     }}>
                                    <NavLink className="logo" to="/" exact onClick={this.removeClass} />
                                
                                        <NavLink to="/" onClick={this.removeClass} 
                                                    exact className="nav-name" 
                                                    activeClassName="nav-active"
                                        >{intl.get('首页')}</NavLink>
                                    <NavLink 
                                            to="/trade"  
                                            className="nav-name "  
                                            activeClassName="nav-active" 
                                            onClick={this.addClassName}
                                    >
                                        {intl.get('交易')}
                                    </NavLink>
                                    <NavLink
                                        to={{pathname:"/news"}}
                                            exact
                                            onClick={this.addClassName} 
                                            className=" animated  nav-name" 
                                            activeClassName="nav-active">{intl.get('资讯')}
                                    </NavLink>
                                    <NavLink
                                         to="/assets"
                                         className="animated  nav-name" 
                                         activeClassName="nav-active" 
                                         exact onClick={this.addClassName}>{intl.get('钱包')}
                                    </NavLink>
                                    <NavLink 
                                        to="/invited"
                                        exact
                                        onClick={this.removeClass}  
                                        className={cs("animated  nav-name")}
                                        activeClassName="nav-active">{intl.get('邀请')}
                                    </NavLink> 
                                    <NavLink 
                                        to="/deal"
                                        exact
                                        onClick={this.removeClass}  
                                        className={cs("animated  nav-name")}
                                        activeClassName="nav-active">{intl.get('模拟交易大赛')} <span className="Torch"></span>
                                    </NavLink> 
                                </div>
                                <div className="nav-left" 
                                     style={{
                                        display:window.location.pathname == '/ex/deal'?'block':window.location.pathname == '/ex/dealTrade'?'block':window.location.pathname == '/ex/dealWallet'?'block':'none'
                                     }}>
                                    <NavLink className="logo" to="/" exact onClick={this.removeClass} />
                                
                                        <NavLink to="/" onClick={this.removeClass} 
                                                    exact className="nav-name" 
                                                    activeClassName="nav-active"
                                        >{intl.get('首页')}</NavLink>
                                    <NavLink 
                                        to="/deal"
                                        exact
                                        onClick={this.removeClass}  
                                        className={cs("animated  nav-name")}
                                        activeClassName="nav-active">比赛介绍
                                    </NavLink> 
                                    <NavLink 
                                        to="/dealTrade"
                                        exact
                                        onClick={this.removeClass}  
                                        className={cs("animated  nav-name")}
                                        activeClassName="nav-active">模拟交易
                                    </NavLink> 
                                    <NavLink 
                                        to="/dealWallet"
                                        exact
                                        onClick={this.removeClass}  
                                        className={cs("animated  nav-name")}
                                        activeClassName="nav-active">模拟钱包
                                    </NavLink> 
                                </div>
                            <div className="nav-right">
                                {
                                    !this.props.login.loginState?<div className="nav-user-info" >
                                                        <NavLink activeClassName="nav-active"  className="nav-name last-btn"    to='/login' >{intl.get("登录")}</NavLink>
                                                        
                                                        <NavLink activeClassName="nav-active" className="nav-name" to='/register'>{intl.get("注册")}</NavLink>
                                                        </div>
                                                        :<div className="nav-user-login">
                                                            <NavLink
                                                                     to="/delegate"
                                                                     className="animated  nav-name" 
                                                                     activeClassName="nav-active" 
                                                                     exact 
                                                                     onClick={this.addClassName} 
                                                            >{intl.get('委托管理')}
                                                            </NavLink>
                                                            <NavLink
                                                                     to="/issue"
                                                                     className="animated  nav-name" 
                                                                     activeClassName="nav-active" 
                                                                     exact onClick={this.addClassName} 
                                                            >{intl.get('提交工单')}
                                                            </NavLink>
                                                            <div className="user-info-wrap">
                                                                <Popover placement="bottom" content={content} title={title} visible={this.state.showPop} onVisibleChange={e=>this.showChange(e)} trigger={this.isPhone()?'click':'hover'}>
                                                                    <img src={require('./../assets/01_02.portrait01.png')} alt='' width="18" height="18" style={{marginRight:'8px'}}/>
                                                                    <span style={{verticalAlign:'middle'}}>{formatStr(usrInfo.username)}</span>
                                                                    <i className="iconfont icon-sanJ-small">&#xe791;</i>
                                                                </Popover>
                                                            </div>
                                                        </div>
                                }
                              
                              
                                <div
                                    //style={{paddingTop:10}} 
                                    defaultValue="zh"  
                                    className="lang" 
                                    onClick={ (e) => this.setState({ showLang:!this.state.showLang }) }
                                    onMouseEnter={ (e) => this.langChange(e)} 
                                    onMouseLeave={ (e) => this.langLive(e)}
                                   ref="langMenu" 
                                >
                                    <div className="cur-lang-wrap" 
                                          
                                    >
                                        <i className={cs('lang-icon', this.state.curLang)}></i>
                                        <i className={cs("lang-ifont iconfont icon-sanJ-small",{"langhove":this.state.showLang})}>&#xe791;</i>
                                    </div>
                                    <div className={cs("select-lang-wrap",{"showlang":this.state.showLang})}>
                                        <div className="lang-list"  onClick={() => this.selecLang('zh_CN')}>
                                            <i className="lang-icon zh_CN"></i>
                                            <span>简体中文</span>
                                        </div>
                                        <div className="lang-list" onClick={() => this.selecLang('en_US')}>
                                            <i className="lang-icon en_US"></i>
                                            <span>English</span>
                                        </div>
                                    </div>
                                </div>
                            
                            </div>
                        </nav>
                    </header>
                </div>
               
        )
    }
}

const mapStateToProps = (state: IRootState) => {
    return {
        isAddClass: state.nav.isAddClass,
        isHideNotify: state.nav.isHideNotify,
        login:state.login
    }
} 

const mapDispatchToProps = (dispatch) => {
    return {
        addClass:(data) => dispatch(ACTION_IS_ADD_CLASS(data)),
        hideNotify:(data) => dispatch(ACTION_IS_HIDE_NOTIFY(data)),
        reClass:(data) => dispatch(ACTION_IS_REMOVE_CLASS(data)),  
        clearLogin: () => dispatch(CLEAR_LOGIN_ACTIONS()),
        changeLang: (lang) => dispatch(CHANGE_SELECT_LANG(lang))
    }
}

export default connect(mapStateToProps, mapDispatchToProps, undefined,{pure:false})(withRouter(Nav));