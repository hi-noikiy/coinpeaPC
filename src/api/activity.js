//模拟交易api 
import 'es6-promise'
import { _mAjax } from '.';

export const tradList = (data) => _mAjax('/coinex-interface/api/tradeGameAssign/tradList', {'method':'post', data: data});
