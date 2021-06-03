import React, { Component } from 'react';

// import components from ant design
import { 
	Col,
	Modal,
	Pagination,
	Row,
	Spin,
} from 'antd';

// import shared and child components
import { TableBody } from '_components'

// import services

// import helpers
import { helpers } from '_helpers';

// destructure imported components and objects
const { compare, toDatetime } = helpers;

class Content extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	componentDidMount() {
	}

	// for related email panel
	columns = [
		{
			title: 'Content ID',
			dataIndex: 'id',
			key: 'id',
			width: '10%',
			sorter: (a, b) => compare(a.id, b.id),
			setFilter: true
		},
		{
			title: 'Username',
			dataIndex: 'username',
			key: 'username',
			width: '10%',
			sorter: (a, b) => compare(a.username, b.username),
			setFilter: true
		},
		{
			title: 'Content',
			dataIndex: 'txt',
			key: 'txt',
			width: '10%',
			sorter: (a, b) => compare(a.txt, b.txt),
			setFilter: true 
		},
		{
			title: 'Created At',
			dataIndex: 'created_at',
			key: 'created_at',
			width: '15%',
			sorter: (a, b) => compare(a.created_at, b.created_at),
			render: timestring => (<>{ toDatetime( Date.parse(timestring) ) }</>),
			// setFilter: true
		},
	];

	titleModal = () => (
		<Row>
			<Col span={ 8 }>
				Conversation Contents
			</Col>
		</Row>	
	)

	// handler for click close
	onCancel = event => {
		this.props.onCancel();
	}

	render(){
		return (
			<div className="Content">
				<Modal
					key={ this.props.modalKey }
					title={ this.titleModal() }
					width={ 1000 }
					style={{ top: 20 }}
					bodyStyle={{ minHeight: 600, overflow: "auto" }}
					visible={ this.props.visible }
					onCancel={ this.onCancel }
					footer={ null }
				>
					<Spin spinning={ this.props.loading }>
						<TableBody
							columns={ this.columns } 
							data={ this.props.data }
							size={ "small" }
							pagination={ false }
						/>
						<div style={{marginTop: "16px", textAlign: "right" }} >
							<Pagination
								showSizeChanger
								showQuickJumper
								size={ "small" }
								current={ this.props.currentPage }
								pageSize={ this.props.pageSize }
								pageSizeOptions={ [10, 25, 50, 100] }
								total={ this.props.total }
								onChange={ this.props.onChangePage }
								onShowSizeChange={ this.props.onChangePage }
							/>
						</div>
					</Spin>
				</Modal>
			</div>
		);
	}
}

export { Content };
