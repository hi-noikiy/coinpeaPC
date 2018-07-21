/* 
    时钟组件 依赖于 moment.js

*/

import React from 'react';
import moment from 'moment';
import './Clock.scss';
class Clock extends React.PureComponent {

    state = {
        localData:(new Date()).valueOf(),
        timer:null,
     
    }

    componentDidMount() {
         this.timer = setInterval(() => {
            this.setState((preState) => ({
                localData: preState.localData + 1000,
            }));
          }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
        
    }

 
    render() {
        return (
            <div id="clock">{moment(this.state.localData).format("YYYY-MM-DD HH:mm:ss")}</div>
        )
    }
}

export default Clock;