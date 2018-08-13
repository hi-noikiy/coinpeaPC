/* 
    app路由配置文件
*/

import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import PrivateRoute from '../components/shared/PrivateRoute';
// import { Spin, Icon } from 'antd';
import {connect} from 'react-redux';
// import { spring, AnimatedSwitch  } from 'react-router-transition';

/* import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; 
import AsyncSiteContent from  '../views/SiteContent';*/
import './router.scss';

// const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const Loading = (props) => { 
    if (props.error) {
        return <div style={{textAlign:'center',fontSize:'30', paddingTop:'50', color:'#3dadd9'}}>加载出错啦，请刷新页面</div>;
      } else if (props.pastDelay) {
        return <div style={{textAlign:'center', background:'#252e33', width:'100%', height:'100%', paddingTop:'150px', minHeight:'600px' }}> <img src={require('../assets/pulse.gif')} width='50px' height='50px' /> </div>

      } else { 
        return null;
    }    
};


// function bounce(val) {
//     return spring(val, {
//       stiffness: 330,
//       damping: 22,
//     });
//   }

// const bounceTransition = {
//     // start in a transparent, upscaled state
//     atEnter: {
//       opacity: 0,
//       scale: 1.2,
//     },
//     // leave in a transparent, downscaled state
//     atLeave: {
//       opacity: bounce(0),
//       scale: bounce(0.8),
//     },
//     // and rest at an opaque, normally-scaled state
//     atActive: {
//       opacity: bounce(1),
//       scale: bounce(1),
//     },
//   };

//主页
const AsyncHome = Loadable({
    loader:()=> import('../views/Home'),
    loading: Loading,
     delay: 200, 
});

//交易页
const AsyncTrade = Loadable({
    loader:()=>import('../views/Trade'),
    loading: Loading,
     delay: 200, 
});

const AsyncCoin = Loadable({
    loader:()=>import('../views/Coin'),
    loading: Loading,
     delay: 200, 
});
const AsyncTrustManagemant = Loadable({
    loader:()=>import('../views/TrustManagemant'),
    loading: Loading,
     delay: 200, 
});

//个人中心
const AsyncPersonal = Loadable({
    loader:()=>import('../views/Personal/Personal'),
    loading: Loading,
     delay: 200, 
});
// 邀请页面
const AsyncMyInviteNew = Loadable({
    loader:()=>import('../views/Personal/MyInviteNew'),
    loading: Loading,
     delay: 200, 
});

//修改密码
const AsyncChangePassword = Loadable({
    loader:()=>import('../views/Personal/subpage/ChangePassword'),
    loading: Loading,
     delay: 200, 
});

//关闭短信验证
const AsyncClosePhone = Loadable({
    loader:()=>import('../views/Personal/subpage/ClosePhone'),
    loading: Loading,
     delay: 200, 
});

//修改手机号码
const UpdatePhone  = Loadable({
    loader:()=>import('../views/Personal/subpage/updatePhone'),
    loading: Loading,
     delay: 200, 
});

//关闭短信验证
const CloseGoogle = Loadable({
    loader:()=>import('../views/Personal/subpage/CloseGoogle'),
    loading: Loading,
     delay: 200, 
});


//绑定电话
const AsyncBindPhoneNumber = Loadable({
    loader:()=>import('../views/Personal/subpage/BindPhoneNumber'),
    loading: Loading,
    delay: 200, 
});
//身份认证
const AsyncAccountCheck = Loadable({
    loader:()=>import('../views/Personal/subpage/AccountCheck'),
    loading: Loading,
    delay: 200, 
});

const AsyncGoogleCheck = Loadable({
    loader:()=>import('../views/Personal/subpage/GoogleCheck'),
    loading: Loading,
     delay: 200, 
});

const AsyncSiteContent = Loadable({
    loader:()=>import('../views/SiteContent'),
    loading: Loading,
     delay: 200, 
});

//资产
const AsyncAssets = Loadable({
    loader:()=>import('../views/Assets'),
    loading: Loading,
     delay: 200, 
});

//模拟交易活动   首页
const AsyncDeal = Loadable({
    loader:()=>import('../views/activity/Deal'),
    loading: Loading,
     delay: 200, 
});

//模拟交易活动   模拟交易
const AsyncDealTrade = Loadable({
    loader:()=>import('../views/activity/DealTrade'),
    loading: Loading,
     delay: 200, 
});

//模拟交易活动   模拟钱包
const AsyncDealWallet = Loadable({
    loader:()=>import('../views/activity/DealWallet'),
    loading: Loading,
     delay: 200, 
});

//资讯页面
const AsyncNews = Loadable({
    loader:()=>import('../views/News'),
    loading: Loading,
     delay: 200, 
    
});

//福利页面
const AsyncWeal = Loadable({
    loader:()=>import('../views/Weal'),
    loading: Loading,
     delay: 200, 
});

//资讯详情页面 
const AsyncNews_details = Loadable({
    loader:()=>import('../views/News_details'),
    loading: Loading,
     delay: 200, 
});

//专业K线交易页面
const AsyncKlineTrade = Loadable({
    loader:()=>import('../views/KlineTrade'),
    loading:Loading,
    delay:200
})

//登录页面
const Login = Loadable({
    loader:()=>import('../views/Login'),
    loading:Loading,
    delay:200
})
//注册页面
const Regiester = Loadable({
    loader:()=>import('../views/Regiester'),
    loading:Loading,
    delay:200
})
//注册成功页面
const RegiesterSucess = Loadable({
    loader:()=>import('../views/RegiesterSucess'),
    loading:Loading,
    delay:200
})
//忘记密码页面
const ForgetPass = Loadable({
    loader:()=>import('../views/ForgetPass'),
    loading:Loading,
    delay:200
})
//忘记密码页面的下一个页面
const Rechangepassword = Loadable({
    loader:()=>import('../views/RechangePassword'),
    loading:Loading,
    delay:200
})

//忘记密码页面的下一个页面
const AginValid = Loadable({
    loader:()=>import('../views/AginValid'),
    loading:Loading,
    delay:200
})

//上币页面
const JoinCoin = Loadable({
    loader:()=>import('../views/JoinCoin'),
    loading:Loading,
    delay:200
})

//分配收入详情
const Details =  Loadable({
    loader:()=>import('../views/Details'),
    loading:Loading,
    delay:200
})

//挖矿分红页面
const Dividend =  Loadable({
    loader:()=>import('../views/Dividend'),
    loading:Loading,
    delay:200
})

//工单页面
const Issue =  Loadable({
    loader:()=>import('../views/Issue'),
    loading:Loading,
    delay:200
})

//手续费返还
const Rebate =  Loadable({
    loader:()=>import('../views/Rebate'),
    loading:Loading,
    delay:200
})

// http://coinex8.com/.well-known/pki-validation/fileauth.txt
const Fileauth = Loadable({
    loader:()=>import('../views/Fileauth'),
    loading:Loading,
    delay:200
})

const WhitePaper = Loadable({
    loader:()=>import('../views/WhitePaper'),
    loading:Loading,
    delay:200
})


// function mapStyles(styles) {
//     return {
//       opacity: styles.opacity,
//       transform: `scale(${styles.scale})`,
//     };
//   }
  
const MyRouter = (props) => (
               
                <Switch location={props.location}  >
                    {/* <AnimatedSwitch
                        atEnter={bounceTransition.atEnter}
                        atLeave={bounceTransition.atLeave}
                        atActive={bounceTransition.atActive}
                        mapStyles={mapStyles}
                        className="route-wrapper"
                    > */}
                        <Route path="/"  component={AsyncHome} exact loginState={props.loginState}></Route>
                        <Route path="/trade"   component={AsyncTrade} ></Route>
                        <Route path="/klineTrade"  component={AsyncKlineTrade}></Route>
                        <Route path="/Coin"  component={AsyncCoin}></Route>
                        <PrivateRoute path="/delegate"  component={AsyncTrustManagemant} loginState={props.loginState}></PrivateRoute>
                        <Route path="/news/:target?" component={AsyncNews} ></Route>
                        <Route path="/neaws_details" component={AsyncNews_details} ></Route>
                        <PrivateRoute path="/activity"  component={AsyncWeal} loginState={props.loginState}></PrivateRoute>
                        <PrivateRoute path="/personal"  component={AsyncPersonal} loginState={props.loginState}></PrivateRoute>
                        <Route path="/invited" component={AsyncMyInviteNew} loginState={props.loginState}></Route>
                        <Route path="/changepassword"  component={AsyncChangePassword} loginState={props.loginState}></Route>
                        <PrivateRoute path="/closephone"  component={AsyncClosePhone} loginState={props.loginState}></PrivateRoute>
                        <PrivateRoute path="/updatePhone"  component={UpdatePhone} loginState={props.loginState}></PrivateRoute>
                        <PrivateRoute path="/closeGoogle"  component={CloseGoogle} loginState={props.loginState}></PrivateRoute>
                        <PrivateRoute path="/bindphonenum"  component={AsyncBindPhoneNumber} loginState={props.loginState}></PrivateRoute>
                        <PrivateRoute path="/accountcheck"  component={AsyncAccountCheck} loginState={props.loginState}></PrivateRoute>
                        <PrivateRoute path="/googlecheck"  component={AsyncGoogleCheck} loginState={props.loginState}></PrivateRoute>
                        <Route path="/site" component={AsyncSiteContent}></Route>
                        <PrivateRoute path="/assets" component={AsyncAssets}  loginState={props.loginState}></PrivateRoute>
                        <PrivateRoute path="/deal" component={AsyncDeal}  loginState={props.loginState}></PrivateRoute>
                        <PrivateRoute path="/dealTrade" component={AsyncDealTrade}  loginState={props.loginState}></PrivateRoute>
                        <PrivateRoute path="/dealWallet" component={AsyncDealWallet}  loginState={props.loginState}></PrivateRoute>
                        <Route path="/login" component={Login}></Route>
                        <Route path="/register" component={Regiester} ></Route>
                        <Route path="/registerSucess" component={RegiesterSucess}></Route>
                        <Route path="/forgetPass" component={ForgetPass}></Route>
                        <Route path="/rechangepassword" component={Rechangepassword}></Route>
                        <Route path="/valid" component={AginValid}  ></Route>
                        <Route path="/currency"  component={JoinCoin}></Route>
                        <Route path="/details"  component={Details}></Route>
                        <Route path="/dividend"  component={Dividend}></Route>
                        <Route path="/rebate"  component={Rebate}></Route>
                        <PrivateRoute path="/issue"  component={Issue} loginState={props.loginState}></PrivateRoute>
                        <Route path="/.well-known/pki-validation/fileauth.txt" component={Fileauth}  ></Route>
                        <Route path="/whitePaper" component={WhitePaper}  ></Route>
                        <Redirect to="/" />
                    {/* </AnimatedSwitch> */}
                </Switch>
               
            );

const mapStateToprops = (state) => {
    return {
        loginState: state.login.loginState
    }
}
export default connect(mapStateToprops,undefined, undefined, {pure:false})(MyRouter);