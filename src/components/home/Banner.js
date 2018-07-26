
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import cs from 'classnames';
import intl from 'react-intl-universal';
import './Banner.scss';
import { tradingIsMining } from '../../api/home';

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
                          
                            intl.get('Banner-des-1')+this.state.data.coinName +' '+intl.get('Banner-des-2')
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
                                <p>{intl.get('Banner-l-b') +this.state.data.coinName}</p>
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