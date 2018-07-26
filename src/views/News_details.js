import './NewsDetails.scss';
import React, { Component } from 'react';
import { newsLists, articleList } from '../api/news'

class NeawsDetails extends Component {
	state = {
		data: ''
	}

	componentDidMount() {

		let id = this.props.location.state? Number(this.props.location.state.id):'';
		
		this.getListData(id);
	}
	
	getListData = async (id) => {

		
		let res = {};

		if(this.props.location.search) {
			if(this.props.location.search === '?mk=1' ) {
				res = await articleList({mark:1});

			} else {
				res = await articleList({mark:2});
				
			}

		} else {
			if(id) {
				const index = this.props.location.state.index;
				res = await newsLists(id);
				if (res.status === 1) {
					this.setState({
						data: res.data[index].content,
					});
					return ;
				}

			}  else {
				res = await articleList({mark:1});
			}
		}

		if (res.status === 1) {
			this.setState({
				data: res.data.content,
			});
			return ;
		}
		
		
	}

	render() {
		return (
			<div className="neawsDeBox">
				<div dangerouslySetInnerHTML={{ __html: this.state.data }} className="content"></div>
			</div>
		)
	}

}
export default NeawsDetails;