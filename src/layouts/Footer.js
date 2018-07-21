/* 
    页面底部布局
*/
import React from 'react';
import { withRouter,Link } from 'react-router-dom';
import './Footer.scss';
import { Divider, BackTop, Button } from 'antd';
import {fromJS, is} from 'immutable';
import { _LocalStorage } from '../utils';
import intl from 'react-intl-universal';
import apple from '../assets/QRcode.jpeg';
import GZH from '../assets/GZH.jpeg';
import Tcoinex from '../assets/Tcoinex8.png';
//api
//import { getLink, getSiteInfo , getSite }  from '../api/home';


 class Footer extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            flinks:[],
            'showfLink': true,
            'siteInfo': {},
            links:[],
            orderLinks:[{name:'',url:'https://twitter.com/Coinex8Official/'}, {name:'',url:'https://www.facebook.com/Coinex8Official/'},{name:'',url:'https://t.me/coinex8'}]
        }
    }
  
    componentDidMount() {  
      /*   this.getInfo(getLink, 'flinks');
        this.getInfo(getSiteInfo, 'siteInfo');
        this.getInfo(getSite,'links'); */
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

  /*   getInfo = async (fn, key) => {
        const res = await fn();
        const ls = new _LocalStorage();
        if(res.status === 1) {
            this.setState({
                [key]: res.data
            })
        }
        ls.set("footerList",res.data)
     }
 */
    redirect = (path) => {
        this.props.history.push(path);
    }
    
    render() {
         //关于我们
        const Links = this.props.links.map( (item, index) => {
            return <Link to={'/site?index='+(index)} key={index.toString()}>{item.typeName}</Link>
        });
        const OrderLinks = this.props.orderLinks.map( (item, index) => {
            return <a href={item.url} key={index.toString()} target="view_window">{item.name}</a> 
        });

        //友情链接
        const flinks = this.props.flinks.map( (item, index) => {
            return <a href={item.url} key={index.toString()} target="view_window">{item.name}</a>
        });
     
        return (
            <footer id="footer">
               <div className="footer-content">
                    <div className="footer-top">
                            <div  className="footer-top-l">
                                <div className="footer-top-l-link">{Links}</div>
                                <p>{intl.get("客服支持")}：{this.props.siteInfo.serviceEmail}</p>
                                <p>{intl.get("市场合作")}：{this.props.siteInfo.businessEmail}</p>
                            </div>
                            <div className='footer-top-m'>
                                <img src={GZH} alt=""/>
                            </div>
                            <div className="footer-top-r">
                                <div  className="footer-logo"><a href="/" style={{color:'transparent'}}>EX</a></div>
                                <p>{this.props.siteInfo.copyrightInfo}</p>
                            </div>
                    </div>
                    <div className="order-link">
                        <div className="order-link-l">
                            {OrderLinks}
                        </div>
                        <div className="order-link-r">{intl.get("市场有风险  投资需谨慎")}</div>
                    </div>
                    <Divider />
                    {/*<div className="footer-bottom clearfix">
                        <h4>{intl.get("友情链接")}</h4>
                        <div className="footer-bottom-r">{flinks}</div>
                    </div>*/}
               </div>
               <Button className='joinT' style={{borderRadius:'26px'}}><a href="https://t.me/coinex8"><img src={Tcoinex} alt=""/>{intl.get("官方Telegram群")}</a></Button>
               <BackTop />
            </footer>
        )
    }
}
export default withRouter(Footer);