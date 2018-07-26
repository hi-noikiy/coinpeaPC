/* 
    分配收入详情
*/

import React from 'react';
import intl from 'react-intl-universal';
 import moment from 'moment';
/*import { connect } from 'react-redux'; */
import { Divider , Icon} from 'antd';

 
//scss
import './Details.scss';
import './Dividend.scss';


interface DividendState {
	data:Array<{t:number, dayp:string,countFees:string,return:string}>
}

class Dividend extends React.Component<object, DividendState> {

	public state:DividendState;

   	public constructor(props) {
		super(props);
		 this.state = {
			data:[
				{
					t:1531455607,
					dayp:'283.71965140',
					countFees:'283.71965140',
					return:'283.71965140'
				},
				{
					t:1531455607,
					dayp:'283.71965140',
					countFees:'283.71965140',
					return:'283.71965140'
				},
				{
					t:1531455607,
					dayp:'283.71965140',
					countFees:'283.71965140',
					return:'283.71965140'
				},
				{
					t:1531455607,
					dayp:'283.71965140',
					countFees:'283.71965140',
					return:'283.71965140'
				},
				{
					t:1531455607,
					dayp:'283.71965140',
					countFees:'283.71965140',
					return:'283.71965140'
				},
				{
					t:1531455607,
					dayp:'283.71965140',
					countFees:'283.71965140',
					return:'283.71965140'
				},
			]
		}
    }

    render() {

		const list = this.state.data.map((v, i) => {
			return (
				<li key={i.toString()}>
					<div>{moment(v.t).format('HH-MM-DD')}</div>
					<div>{v.dayp}</div>
					<div>{v.countFees}</div>
					<div>{v.return}</div>
				</li>
			)
		});

        return (
            <div className="details dividend">
                <div className="banner">
					<div className="banner-text">
						<h2 data-text="创业板上币进度公示" >创业板上币进度公示</h2>
						<Divider className="banner-plan">"交易即挖矿"计划</Divider>
					</div>
					
				</div>
                <section className="banner-des">
                   <h3>{intl.get('返还规则')}</h3>
					<p>
						白皮书里已经对SEA的分配比例有详细的说明。
						51%比例的SEA通过“交易即挖矿”的方式逐步回馈给交易用户。
						一旦51%的SEA全部回馈完成，“挖矿”即自动终止。
						每日（UTC+8，以下同）都会将前一日的用户所产生交易手续费，100%折算成FT返还给用户，
						折算价格按前一交易日SEA的均价（均价计算方式为总成交金额/总成交量）。我们将于每日上午11点，开始发放前一日交易手续费折合SEA的返还。
					</p>
                </section>

				<article className="income-wrap">
					<div className="income-tile">
						{intl.get('返还记录')}
					</div>
					<ul className="income-list">
						<li className="income-list-title">
							<div>{intl.get('日期')}</div>
							<div>{intl.get('当日')}SEA{intl.get('均价')} (BTC)</div>
							<div>{intl.get('当日总手续费折合')}(BTC)</div>
							<div>{intl.get('当日挖矿手续费返还')}(SEA)</div>
						</li>
						{list}
						<li className="page">
							<div>
								<Icon type="left" />&nbsp;
								{intl.get('上一页')}
							</div>
							<div>
								
								{intl.get('下一页')}&nbsp;
								<Icon type="right" />
							</div>
						</li>
					</ul>
				</article>
            </div>
        )
    }
}

export default Dividend;