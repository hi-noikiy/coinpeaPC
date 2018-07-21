/* 
    个人中心二级页头部公共组件
*/
import React, { Component } from 'react';
import back from '../../assets/07_02.return.png';
import { Link } from 'react-router-dom';

class SubpageHead extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }

    componentWillUnmount(){
    }

    render() {
        return (
            <div className="personalTwo_top">
                <Link to={this.props.backLink}><img src={back} alt="img"/><span>{this.props.backText}</span></Link>
                <h3>{this.props.columText}</h3>
            </div>
        )
    }
    
}




export default SubpageHead