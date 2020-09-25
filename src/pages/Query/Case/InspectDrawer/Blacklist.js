import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	Button,
	Col,
	Modal,
	Row,
	Space,
	Spin,
	Tag,
} from 'antd';
import { UserAddOutlined, UsergroupAddOutlined } from '@ant-design/icons';

// import shared and child components
import { TableBody } from '_components'

// import services

// import helpers
import { helpers } from "_helpers";

// destructure imported components and objects
const { compare, toDatetime } = helpers;

class Blacklist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for Spin
			loading: false,
			selectedRowKeys: [], // for selecting rows in TableBody
		};
	}
	
	componentDidMount() {
	}

	// for related email panel
	columns = [
		{
			title: 'Blacklist ID',
			dataIndex: 'id',
			key: 'id',
			width: '10%',
			sorter: (a, b) => compare(a.id, b.id),
		},
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
			width: '10%',
			sorter: (a, b) => compare(a.type, b.type),
			// setFilter: true,
			render: type => {
				let color = 'default';
				let text = 'Unknown';
				switch (type) {
					case 'U' :
						color = 'geekblue';
						text = 'Device ID';
						break;
					case 'P' :
						color = 'purple';
						text = 'Phone Number';
						break;
					case 'E' :
						color = 'green';
						text = 'Email';
						break;
					default:
						color = 'default';
						text = 'Unknown';
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
			title: 'Data',
			dataIndex: 'data',
			key: 'data',
			width: '25%',
			sorter: (a, b) => compare(a.data, b.data),
			setFilter: true 
		},
		{
			title: 'Status',
			dataIndex: 'is_active',
			key: 'is_active',
			width: '10%',
			sorter: (a, b) => compare(a.is_active, b.is_active),
			// setFilter: true,
			render: status => {
				let color = 'default';
				let text = 'Unknown';
				switch (status) {
					case 1 :
						color = 'green';
						text = 'Active';
						break;
					case 0 :
						color = 'default';
						text = 'Inactive';
						break;
					default:
						color = 'default';
						text = 'Unknown';
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
			title: 'Created At',
			dataIndex: 'created_at',
			key: 'created_at',
			width: '15%',
			sorter: (a, b) => compare(a.created_at, b.created_at),
			render: timestring => (<>{ toDatetime( Date.parse(timestring) ) }</>),
			// setFilter: true
		},
		{
			title: 'Updated At',
			dataIndex: 'updated_at',
			key: 'updated_at',
			width: '15%',
			sorter: (a, b) => compare(a.updated_at, b.updated_at),
			render: timestring => (<>{ toDatetime( Date.parse(timestring) ) }</>),
			// setFilter: true
		},
		{
			title: 'Actions',
			key: 'action',
			render: (text, record) => (
				<Space size='small'>
					<Button 
						type='link' 
						icon={ <UserAddOutlined /> }
						onClick={ this.props.onClickUnban.bind(this, record) }
					>
						Unban
					</Button>
				</Space>
			),
			width: '10%',
			setFilter: false
		},
	];

	handleSelectChange = selectedRowKeys => this.setState({ selectedRowKeys });

	onClickBatchUnban = () => {
		console.log("batch delete");
		console.log(this.state.selectedRowKeys);
	}

	titleModal = () => (
		<Row>
			<Col span={ 8 }>
				Search Blacklist
			</Col>
		</Row>	
	)

	render(){
		return (
			<div className="Blacklist">
				<Modal
					key={ this.props.modalKey }
					title={ this.titleModal() }
					width={ 1200 }
					style={{ top: 20 }}
					bodyStyle={{ minHeight: 600, overflow: "auto" }}
					visible={ this.props.visible }
					onCancel={ this.props.onCancel }
					footer={ null }
				>
					<div>
						<Spin spinning={ this.state.loading }>
							<Row style={{ margin: this.props.isSmall ? "8px" : "16px" }}>
								<Col 
									style={{ 
										fontSize: '20px', textAlign: 'right' 
									}}
									span={ 24 } 
								>
									{ this.props.blacklist.length === 0 ? <></> :
										<Button 
											icon={ <UsergroupAddOutlined /> }
											onClick={ this.props.onClickBatchUnban.bind(this, this.state.selectedRowKeys) }
										>
											Batch Unban
										</Button>
									}
								</Col>
							</Row>
							<div>
								<TableBody
									columns={ this.columns } 
									data={ this.props.blacklist }
									isSmall={ true }
									selectedRowKeys={ this.state.selectedRowKeys }
									onSelectChange={ this.handleSelectChange }
								/>
							</div>
						</Spin>
					</div>
				</Modal>
			</div>
		);
	}
}

export default Blacklist;
