

import {fork} from 'redux-saga/effects';

import { watchFecthTabs } from '../components/home/HomeTabsListRedux.ts';
import { watchFecthAssets } from '../components/assets/FundsRedux.ts';
import { watchFecthAllcoin } from '../components/assets/GetallCoinRedux.ts';
import { watchFecthLogin,watchFetchAssets } from '../views/LoginRedux.ts';

export default function* rootSaga() {
    yield [
            fork(watchFetchAssets),
            fork(watchFecthTabs),
            fork(watchFecthAssets),
            fork(watchFecthAllcoin),
            fork(watchFecthLogin)
    ];
}