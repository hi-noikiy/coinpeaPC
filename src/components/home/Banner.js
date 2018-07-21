import React from 'react';
import cs from 'classnames';
import intl from 'react-intl-universal';
import { NavLink, Link } from 'react-router-dom';
//css
import './Banner.scss';

//api
import { tradingIsMining } from '../../api/home';

/* function Block(props) {
    return (
        <div className="block-items">
            {
                props.childList.map( (v, i) => {
                    return (
                        <div key={Math.random()*i.toString(36)}>
                            <p>{v.top}</p>
                            <p className={cs('')}>
                                <i></i>
                                {v.bottom}
                            </p>
                            {
                                props.dashed && i === 0 ?<div className="dashed"></div>:null
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

class Banner extends React.PureComponent {

    state = {
        data:[
            {
                dashed:true,
                childList:[
                    {
                        top:'本小时待分配收入累积折合',
                        bottom:'40.26193762'
                    },
                    {
                        top:'本小时每百万份SEA累积收入折合',
                        bottom:'0.38104619'
                    },
                ]
            },
            {
                dashed:true,
                childList:[
                    {
                        top:'今日待分配收入累积折合',
                        bottom:'40.26193762'
                    },
                    {
                        top:'今日连续持有SEA每百万份收入折合',
                        bottom:'0.38104619'
                    },
                ]
            },
            {
                dashed:false,
                childList:[
                    {
                        top:'昨日待分配收入累积折合',
                        bottom:'40.26193762'
                    },
                    {
                        top:'昨日待分配收入累积折合',
                        bottom:'0.38104619'
                    },
                    {
                        top:'SEA总流通量',
                        bottom:'0.38104619'
                    },
                ]
            },

        ]
    }
    render() {
        const  blocks  = this.state.data.map((v, i) => {
            return  <Block childList={v.childList} dashed={v.dashed} key={Math.random()*i.toString()}/>
            
        })
        return (
            <div className="block">
                <div className="block-top">
                    <h3>交易即挖矿</h3>
                    <p>交易手续费 100% 返利，持有SEA再享平台 100% 收益</p>
                </div>
                <div className="block-bottom">
                    {blocks}
                </div>
            </div>
        )
    }
} */

class Banner extends React.PureComponent {

    state = {
        data:{
            continuouslyHolding:'',
            hourCumulative:'',
            output:'',
            perMillion:'',
            todayCumulative:'',
            total:'',
            yesterdayCumulative:'',
            coinName:''
        }
    }

    componentDidMount() {
        tradingIsMining().then(res => {
            if(res.status === 1) {
                this.setState({
                    data:res.data
                })
            }
        })
    }

    render() {
       
        return (
            <div className="block">
                <div className="block-top">
                    <h3>{intl.get('Banner-hd')}</h3>
                    <p>
                        {
                            intl.get('Banner-des-1')+this.state.data.awardPercent1Today/100+'%'
                            +intl.get('Banner-des-1_1')+this.state.data.coinName +' '+intl.get('Banner-des-2')+
                            this.state.data.awardPercentToday/100+'%'+
                            intl.get('Banner-des-2_1')
                        }
                    </p>
                </div>
                <div className="block-bottom">
                        <div className="block-items">
                            <div>
                                <p>{intl.get('Banner-l-t')}</p>
                                <p className={cs('p-large')}>
                                    <i></i>
                                    {this.state.data.hourCumulative} 
                                </p>
                                  <div className="dashed"></div>
                            </div>
                            <div>
                                <p>{intl.get('Banner-l-b') +this.state.data.coinName+intl.get('Banner-l-b_1')}</p>
                                <p className={cs('p-small')}>
                                    {/*<i></i>*/}
                                    {this.state.data.perMillion}
                                  
                                </p>
                            </div>
                        </div>
                        <div className="block-items">
                            <div>
                                <p>{intl.get('Banner-c-t')}</p>
                                <p className={cs('p-large')}>
                                    <NavLink className={cs('p-large')} to='/details?ty=t'>
                                            <i></i>
                                            {this.state.data.todayCumulative} 
                                    </NavLink>
                                </p>
                                <div className="dashed"></div>
                            </div>
                            <div>
                                <p>{intl.get('Banner-c-b')}</p>
                                <a className={cs('p-small')} >
                                    {/*<i></i>*/}
                                    {this.state.data.continuouslyHolding}
                                   
                                </a>
                            </div>
                        </div>
                        <div className="block-items last-items">
                            <div>
                                <p>{intl.get('Banner-r-t')}</p>
                                <NavLink className={cs('p-small')} to='/details?ty=y'>
                                    {/*<i></i>*/}
                                    {this.state.data.yesterdayCumulative}
                                </NavLink>
                            </div>
                            <div>
                                <p className="last-p ">{intl.get('Banner-r-c')}</p>
                                <p className={cs('p-small')}>
                                   {/*  <i></i> */}
                                    {this.state.data.output} &nbsp;{this.state.data.coinName}  &nbsp;
                                    <Link to="/neaws_details?mk=1" className="banner-link">{intl.get('Bnner-r-link1')}</Link>
                                </p>
                            </div>
                            <div>
                                <p className="last-p last-p-sea">{intl.get('Banner-r-b')}</p>
                                <p className={cs('p-small')}>
                                   {/*  <i></i> */}
                                    <span>{this.state.data.total}</span> &nbsp;
                                    {this.state.data.coinName}  &nbsp;
                                    <Link to="/neaws_details?mk=2" className="banner-link" >{intl.get('Bnner-r-link2')}</Link>
                                </p>
                            </div>
                        </div>
                        
                    
                </div>
            </div>
        )
    }
} 
export default Banner;