/* 
    生成APP Redux store
*/

import {createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducerucer from './reducers';

import rootSaga from './saga';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducerucer,
  compose(applyMiddleware(sagaMiddleware),window.devToolsExtension?window.devToolsExtension():f=>f)
);

sagaMiddleware.run(rootSaga);

export default store;