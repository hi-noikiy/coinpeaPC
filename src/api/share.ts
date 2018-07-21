//公用api 
import { _mAjax } from '.';

export const tradingIsMiningDetail = (data) => _mAjax('/coinex-interface/api/index/websit/tradingIsMiningDetail', {'methods':'get', data});
