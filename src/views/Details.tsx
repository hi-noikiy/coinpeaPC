/* 
    分配收入详情
*/

import React from 'react';
import intl from 'react-intl-universal';
/* import moment from 'moment';
import { connect } from 'react-redux'; */
import { Divider } from 'antd';

 
//scss
import './Details.scss'

//自定义组件
import PriceList from '../components/shared/PriceList';

//api接口
import { tradingIsMiningDetail } from '../api/share';

//类型定义
interface obj {
	coinName: string;
	culFee: number;
	fee:number;
	[propName: string]: any;
}

interface IDetailsState  {
	data: ReadonlyArray<obj>;
	text: string;
	totaldistributed: number;
	undistributed: number; 
}


class Details extends React.PureComponent<any, IDetailsState> {
	
	public state:IDetailsState;

    constructor(props) {
		super(props);
		const search = this.props.history.location.search === '?ty=t' ? 'today': 'yesterday';
		this.state = {
			data:[],
			text:this.transformText(search),
			totaldistributed: 0, //总收入
			undistributed: 0     //分配折合
		}

		this.getData(search);
	}


	private transformText = (search:string):string => {
		
		const obj = {
			today:'今',
			yesterday: '昨'
		}

		return obj[search];
	}

	private getData = (search:string) => {

		const enum dayType {
			today = 1,
			yesterday
		}
		
		tradingIsMiningDetail({dayType:search === 'today' ? dayType.today: dayType.yesterday })
		.then(res => {

			try {
					if(search === 'today') {
						this.setState({
							data: res.data.statExFeeHourDos,
							totaldistributed: res.data.totaldistributed,
							undistributed: res.data.undistributed
						})		
					} 
					
					else {

						this.setState({
							data: res.data.statExFeeDayDos,
							totaldistributed: res.data.totaldistributed,
							undistributed: res.data.undistributed
						})		
					}

			}  catch(e) {
				
				console.log(e)
			}
				
				
		});
	
	}

    render() {

		const list = this.state.data.map((item, index)=>{
			return <PriceList 
						key={index.toString()} 
						left={item.coinName} 
						right={item.fee} 
						center={item.culFee}
						listClickHandle={()=> void(0)}
					/>
		});

        return (
            <div className="details">
                <div className="banner"></div>
                <section className="banner-des">
                    <div className="left">
						<h3>{intl.get(this.state.text+'日分配收入折合')}</h3>
						<p>
							<i></i>
							<span>{this.state.undistributed}</span>
						</p>
					</div>
					<div className="right">
						<h3>{intl.get(this.state.text+'日平台总收入折合')}</h3>
						<p>
							<i></i>
							<span>{this.state.totaldistributed}</span>
						</p>
					</div>
					
                </section>

				<article className="income-wrap">
					<div className="income-tile">
						<Divider>{intl.get(this.state.text+'日分配收入详情')}</Divider>
					</div>
					<ul className="income-list">
						<li className="income-list-title">
							<div>{intl.get('币种')}</div>
							<div>{intl.get('平台总手续费')}</div>
							<div>{intl.get('分配收入')}</div>
						</li>
						{list}
					</ul>
				</article>
            </div>
        )
    }
}

export default Details;