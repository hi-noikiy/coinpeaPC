/* 
    页面结构
*/
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Nav from './Nav';
import MyRouter from '../routes';
import { Layout, LocaleProvider } from 'antd';
import Footer from './Footer'
import { _LocalStorage } from '../utils';
import { is, fromJS } from 'immutable';
import { connect } from 'react-redux';
import intl from 'react-intl-universal';
import qs from 'querystring';


import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_US from 'antd/lib/locale-provider/en_US';
import zh_TW from 'antd/lib/locale-provider/zh_TW';

//api
import { getLink, getSiteInfo , getSite }  from '../api/home';

import { SAVE_SITE_INFO } from '../components/home/HomeTabsListRedux';
import {  CHANGE_SELECT_LANG} from '../views/LoginRedux';
import {ACTION_IS_HIDE_NOTIFY } from './NavRedux';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
import $ from 'jquery';

const locales = {
    "en_US": require('../local/en_US.json'),
    "zh_CN": require('../local/zh_CN.json'),
}

class Frames extends  Component {
    constructor(props) {
        super(props);

        this.state = {
            flinks:[],
            'showfLink': true,
            'siteInfo': {},
            links:[],
            orderLinks:[{name:'',url:'https://twitter.com/Coinex8Official/'}, {name:'',url:'https://www.facebook.com/Coinex8Official/'},{name:'',url:'https://t.me/coinex8'}],
            initDone:false,
            antlang:zh_CN
        }
        
    }

    componentDidMount()  {

        if(qs.parse(window.location.search)['?langue']) {
            const ls = new _LocalStorage();
            ls.set('lang',qs.parse(window.location.search)['?langue']);
            this.props.changeLang(qs.parse(window.location.search)['?langue']);
            
        }
      
        this.loadLocales(qs.parse(window.location.search)['?langue']);
        
        this.getInfo(getLink, 'flinks');
        this.getInfo(getSiteInfo, 'siteInfo');
        this.getInfo(getSite,'links');
    
    }
    
    componentWillUpdate() {

        if(!NProgress.isStarted()) {
            NProgress.start();
        }
    }

    componentDidUpdate () {
       
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            NProgress.done();
        },500);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const thisProps = this.props || {}, thisState = this.state || {};
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

    getInfo = async (fn, key) => {
        const res = await fn();
        const ls = new _LocalStorage();
        if(res.status === 1) {
            this.setState({
                [key]: res.data
            })

            if(key === 'siteInfo') {
              
                this.props.saveInfo(res.data)
            }
          
        }

        if(key==='links'){
            ls.set("footerList",res.data)
        }
        
    }

    loadLocales = (lang) => {
        let antlang;
        if(this.props.lang === 'zh_CN'){
            antlang = zh_CN;
        }else if(this.props.lang === 'zh_TW'){
            antlang = zh_TW;
        }else{
            antlang = en_US;
        }
        intl.init({
            currentLocale: lang?lang:this.props.lang,
            locales,
        }).then( () => {
            this.setState({initDone: true, antlang});
           
        })
    }

    selectLang = (lang) => {
     
        this.loadLocales(lang);
    }

    render() {
      
        return (
            this.state.initDone &&
            <LocaleProvider locale={this.state.antlang}> 
                <Layout className="frame" >  
                <Nav src={this.state.siteInfo.logo} selectLang={this.selectLang}/>
                    <section className="container">
                            <MyRouter />
                    </section>
                <Footer
                        siteInfo={this.state.siteInfo}
                        flinks={this.state.flinks}
                        showfLink={this.state.showfLink}
                        links={this.state.links}
                        orderLinks={this.state.orderLinks}
                />
                </Layout>
            </LocaleProvider>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.login.lang,
    }
}

const mapStateToDispatch = (dispatch => {
    return {
        saveInfo:(data) => dispatch(SAVE_SITE_INFO(data)),
        changeLang:(lang) => dispatch(CHANGE_SELECT_LANG(lang)),
        hideNotify:() => dispatch(ACTION_IS_HIDE_NOTIFY()), //隐藏广播
    }
})


export default connect(mapStateToProps, mapStateToDispatch, undefined,{pure:false})(withRouter((props) => (<Frames location={props.location}  loginState={props.loginState} lang={props.lang} {...props}/>)))