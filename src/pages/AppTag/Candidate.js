import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	Col,
	Modal,
	Row,
	Spin,
	Tag,
} from 'antd';

// import shared and child components
import { TableBody } from '_components'

// import services

// import helpers
import { helpers } from "_helpers";

// destructure imported components and objects
const { compare } = helpers;

class Candidate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			spinning: false,
		};
	}
	
	componentDidMount() {
	}

	componentDidUpdate(prevProps) {
		const { tagId } = this.props;
		if(prevProps.tagId !== tagId) {
			this.setState({ spinning: true }, async () => {
				this.props.searchCandidatesByTagSync({
					currentPage: 1, 
					pageSize: 10, 
					tagId, 
				});
				this.setState({ 
					spinning: false,
				});
			});
		}
	}
	// for related email panel
	columns = [
		{
			title: 'Candidate ID',
			dataIndex: 'candidate_id',
			key: 'candidate_id',
			width: '60%',
			sorter: (a, b) => compare(a.candidate_id, b.candidate_id),
			setFilter: true
		},
		{
			title: 'Status',
			dataIndex: 'is_active',
			key: 'is_active',
			width: '40%',
			sorter: (a, b) => compare(a.is_active, b.is_active),
			// setFilter: true
			render: is_active => {
				let color = 'lime';
				let text = 'No';
				switch (is_active) {
					case 1 :
						color = 'red';
						text = 'Yes';
						break;
					default:
						color = 'lime';
						text = 'No';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ text }
					</Tag>
				);
			},
		},
		{
			title: 'Duplicated',
			dataIndex: 'is_duplicated',
			key: 'is_duplicated',
			width: '40%',
			sorter: (a, b) => compare(a.is_duplicated, b.is_duplicated),
			// setFilter: true
			render: is_duplicated => {
				let color = 'lime';
				let text = 'No';
				switch (is_duplicated) {
					case 1 :
						color = 'red';
						text = 'Yes';
						break;
					default:
						color = 'lime';
						text = 'No';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ text }
					</Tag>
				);
			},
		},
		{
			title: 'Deleted',
			dataIndex: 'is_deleted',
			key: 'is_deleted',
			width: '40%',
			sorter: (a, b) => compare(a.is_deleted, b.is_deleted),
			// setFilter: true
			render: is_deleted => {
				let color = 'lime';
				let text = 'No';
				switch (is_deleted) {
					case 1 :
						color = 'red';
						text = 'Yes';
						break;
					default:
						color = 'lime';
						text = 'No';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ text }
					</Tag>
				);
			},
		},
	];

	titleModal = () => (
		<Row>
			<Col span={ 8 }>
				Candidates
			</Col>
		</Row>	
	)

	// handler for pagination
	handleChangePage = async (page, pageSize) => {
		this.setState({ spinning: true }, async () => {
			this.props.searchCandidatesByTagSync({
				currentPage: page, 
				pageSize: pageSize, 
				tagId: this.props.tagId, 
			});
			this.setState({ 
				spinning: false,
			});
		});
	}

	render(){
		return (
			<div className="Candidate">
				<Modal
					key={ this.props.modalKey }
					title={ this.titleModal() }
					width={ 600 }
					style={{ top: 20 }}
					bodyStyle={{ minHeight: 600, overflow: "auto" }}
					visible={ this.props.visible }
					onCancel={ this.props.onClose }
					footer={ null }
				>
					<Spin spinning={ this.state.spinning }>
						<TableBody
							columns={ this.columns } 
							data={ this.props.dataCandidate ? this.props.dataCandidate : [] }
							isSmall={ true }
							pagination={ {
								pageSize: this.props.pageSizeCandidate, 
								current: this.props.currentPageCandidate, 
								total: this.props.candCount, 
								onChange: this.handleChangePage,
							} }
						/>
					</Spin>
				</Modal>
			</div>
		);
	}
}

export { Candidate };
