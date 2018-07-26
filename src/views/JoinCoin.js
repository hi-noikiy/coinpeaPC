/* 
    上币页面
*/

import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';
import { connect } from 'react-redux';


//scss
import './JoinCoin.scss'

class JoinCoin extends React.Component {
    
  /*   constructor(props) {
        super(props);
    } */

    render() {
        return (
            <article className="currency">
                <div className="banner">
                    <h2>创业板上币进度公示</h2>
                    <div></div>
                </div>
            </article>
        )
    }
}

export default JoinCoin;