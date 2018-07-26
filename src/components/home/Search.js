/* 
    home 页搜索框
*/
import React from 'react'; 
import { Icon } from 'antd';
import './Search.scss';
import intl from "react-intl-universal";

const Search = (props) => {
   
    return (

        <div id="home-tab-search">
            <input 
                    autoFocus
                    type="text" 
                    placeholder={intl.get("搜索")}
                    value={props.value} 
                    onChange={e=>props.handleChange(e)} 
                    id="search"
                    className={props.isShowSearch?'active':''} />
            <Icon size="lg" type="search"  id="search-icon"/>
        </div>
    )
}

export default Search

