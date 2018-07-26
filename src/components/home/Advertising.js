/* 
    home页 图片广告
*/

import React from 'react';
import { Button } from 'antd';
import './Advertising.scss';


import image1 from "../../assets/01_01.iphone.png";
import icon1 from "../../assets/01_01.icon0101.svg";
import icon2 from "../../assets/01_01.icon0201.svg";
import icon3 from "../../assets/01_01.icon0301.svg";
import icon4 from "../../assets/01_01.icon0401.svg";
import intl from 'react-intl-universal';

import QRCode from "qrcode.react";
export default class Advertising extends React.PureComponent {
    
    constructor(props) {
        super(props);
        this.state = {
            pics: [],
            phonePic:true,
            data:[
                    {title:intl.get('极致'), des:intl.get('多终端掌握交易行情'), des2:intl.get('高性能引擎确保交易快捷方便'),icon:icon1},
                    {title:intl.get('安全'), des:intl.get('采用银行级用户数据加密'), des2:intl.get('风险多级控制'),icon:icon2},
                    {title:intl.get('专业'), des:intl.get('精英团队专业打造'), des2:intl.get('十年金融安全经验为您护航'),icon:icon3},
                    {title:intl.get('服务'), des:intl.get('全年7x24小时客服服务'), des2:intl.get('秉承客户至上'),icon:icon4}
                ],
        }
    }

    render() {
      
        //图片下文字广告
        const  DLlist = this.state.data.map( (item, index) => {
            return (
                <dl key={index.toString()}>
                    <dt>
                        <div  className="advertising-icon"></div>
                        <h4>{item.title}</h4>
                    </dt>
                    <dd>
                        <p>{item.des}</p>
                        <p>{item.des2}</p>
                    </dd>
                </dl>

            )  
        })
        
        return (
            <div className="advertising-wrap">
                {/*<div className="advertising-top">
                    <div className="advertising-top-l">
                        <img src={image1} alt="phone pic" />
                    </div>
                    <div className="advertising-top-r">
                        <h3>{intl.get('随时随地，不错过任何机会')}</h3>
                        <div className="advertising-top-r-button">
                            <QRCode value={this.state.phonePic ? "http://facebook.github.io/react/" : "http://baidu.com/"} renderAs="svg" size={102} />
                            <div className="download-button-wrap">
                                <Button icon="apple" className="download-button ipone" type="primary" style={{fontSize:'18px'}} onClick={()=>{this.setState({phonePic:true})}}>{intl.get("iPhone")}</Button>
                                <Button icon="android"  className="download-button andriod" style={{fontSize:'18px'}} onClick={()=>{this.setState({phonePic:false})}}>{intl.get("Android")}</Button>
                            </div>
                        </div>
                    </div>
                </div>*/}
                <div className='advertising-top'>
                    <h1>{intl.get('优势')}</h1>
                </div>
                <div className="advertising-bottom">
                    {DLlist}
                </div>
            </div>
        )
    }
}