/* 
    委托列表
*/
import './DelegateTabs.scss';
import React from 'react';


import { Table } from 'antd';
import intl from 'react-intl-universal'
/* import { is,fromJS } from 'immutable' */

class DelegateTabs extends React.Component {
   
   /*  shouldComponentUpdate(nextProps, nextState){
        const thisProps = this.props || {}, thisState = this.state || {};
        if( Object.keys(thisProps).length !== Object.keys(nextProps).length ) {
            
            return true;
        }
      
        for (const key in nextProps) {
          
                if (!is(fromJS(thisProps[key]), fromJS(nextProps[key]))) {
                    return true;
                }
            }
        
            return false;
      } */
    render() {
      
       return  (
            <Table 
                     rowKey={this.props.rowKeys}
                    key={this.props.rowKeys+'cc'}
                    style={{display:this.props.isShow?'block':'none'}}
                    className="my-tabs"
                    columns={this.props.columns} 
                    dataSource={this.props.dataSource}
                    pagination={false}  
                    locale={{emptyText: intl.get('暂无数据') }}                
             />
       )
    }
}

export default DelegateTabs;