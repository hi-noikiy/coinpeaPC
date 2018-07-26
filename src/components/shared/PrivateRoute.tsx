/**
 * 路由HOC组件
 */

import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';



export default function PrivateRoute ({component: Component, ...rest}) {

   const { loginState } = rest;
    
    return (

        <Route {...rest} render={ (props) => {
          
           return loginState ? <Component {...props} loginState={loginState}/> : 
                         <Redirect to={{
                            pathname: '/login',
                            state: { from: props.location }
                        }}/>
        }} >
            
        </Route> 
    )
}