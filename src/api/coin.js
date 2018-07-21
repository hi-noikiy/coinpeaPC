
import { _mAjax } from '.';

export const coinlist = () => _mAjax(` /coinex-interface/api/coinInfo/allCoins`,{methods: 'get'});
export const coinContent = (data) => _mAjax(`/coinex-interface/api/coinInfo/findCoinInfo`,{methods: 'get',data})