import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	Button, 
	Card, 
	Descriptions, 
	Drawer, 
	Space, 
	Tag, 
} from 'antd';
import { 
	EditOutlined, 
	PlusOutlined, 
} from '@ant-design/icons';

// import shared and child components
import { TableBody } from '_components'
import { SecondaryDrawer } from './SecondaryDrawer'

// import helpers
import { helpers } from '_helpers';

// destructure imported components and objects
const { compare } = helpers;

class ProcessDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false, // for opening or closing the drawer
			record: {}, // for loading a record into the form in drawer
			disabled: false, // for disabling the input fields in drawer
			tableDrawerKey: Date.now(), //for refreshing the drawer
		};
	}
	
	// define columns in TableBody
	columns = [
		{
			title: 'Process',
			dataIndex: 'process',
			key: 'process',
			sorter: (a, b) => compare(a.process, b.process),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			render: process => {
				let color = 'geekblue';
				let text = 'Open';
				switch (process) {
					case 'o' :
						color = 'geekblue';
						text = 'Open';
						break;
					case 'q' :
						color = 'purple';
						text = 'Queried';
						break;
					case 'r' :
						color = 'cyan';
						text = 'Replied';
						break;
					case 'a' :
						color = 'green';
						text = 'Approved';
						break;
					case 'e' :
						color = 'red';
						text = 'Rejected';
						break;
					case 'd' :
						color = 'default';
						text = 'Deferred';
						break;
					default:
						color = 'geekblue';
						text = 'Open';
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
			title: 'Details',
			dataIndex: 'details',
			key: 'details',
			sorter: (a, b) => compare(a.details, b.details),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: true
		},
		{
			title: 'Created At',
			dataIndex: 'created_at',
			sorter: (a, b) => compare(a.created_at, b.created_at),
			key: 'created_at',
			width: '20%',
			setFilter: false
		},
		{
			title: 'Created By',
			dataIndex: 'alias',
			sorter: (a, b) => compare(a.alias, b.alias),
			key: 'alias',
			width: '20%',
			setFilter: false
		},
		{
			title: 'Actions',
			key: 'action',
			render: (text, record) => (
				<Space size='small'>
					<Button 
						type='link' 
						icon={ <EditOutlined /> }
						onClick={ this.handleClickEdit.bind(this, record) }
					>
						Edit
					</Button>
				</Space>
			),
			width: '30%',
			setFilter: false
		},
	];

	// handlers for click edit
	handleClickEdit = record => {
		this.setState({
			visible: true, 
			disabled: false,
			record,
		});
	}

	// handlers for click add
  handleClickAdd = event => {
    this.setState({
      visible: true,
			disabled: false,
			record: {},
    });
  };

	// handlers for click close
  handleClose = () => {
    this.setState({
      visible: false,
			record: {},
			tableDrawerKey: Date.now(),
    });
  };

	// handlers for click submit
	handleSubmit = record => {
		if (this.state.record.id)  // edit the entry
			this.props.edit(this.state.record.id, record);
		else // create an entry
			this.props.create({case_id: this.props.record.id, ...record});

		this.setState({
			record: {},
			visible: false,
			tableDrawerKey: Date.now(),
		});
	}

	// define the add button
	genExtra = () => (
		<Button 
			type="ghost"
			style={{ border: "none" }}
			size="small"
			onClick={ this.handleClickAdd }
		>
			<PlusOutlined />
			{ "Add" }
		</Button>
	);

	//genStatus
	genStatus = () => {
		let color = 'geekblue';
		let text = 'Open';
		switch (this.props.record.status) {
			case 'o' :
				color = 'geekblue';
				text = 'Open';
				break;
			case 'q' :
				color = 'purple';
				text = 'Queried';
				break;
			case 'r' :
				color = 'cyan';
				text = 'Replied';
				break;
			case 'a' :
				color = 'green';
				text = 'Approved';
				break;
			case 'e' :
				color = 'red';
				text = 'Rejected';
				break;
			case 'd' :
				color = 'default';
				text = 'Deferred';
				break;
			default:
				color = 'geekblue';
				text = 'Open';
				break;
		};	
		return (
			<Tag color={ color } key={ uuidv4() }>
				{ text }
			</Tag>
		);
	}

	render(){
		return (
			<div className='ProcessDrawer'>
				<Drawer
					title="Process A Case"
					width={ 900 }
					bodyStyle={{ paddingBottom: 80 }}
					visible={ this.props.visible } 
					onClose={ this.props.onClose }
				>
					<Card
						title="Case Info"
						style={{ marginBottom: "16px", background: "#fafafa" }}
					>	
						<Descriptions>
							<Descriptions.Item label="Case Name">
								{ this.props.record.casename }
							</Descriptions.Item>
							<Descriptions.Item label="Status">
								{ this.genStatus() } 
							</Descriptions.Item>
							<Descriptions.Item label="Category">
								{ this.props.record.categoryname }
							</Descriptions.Item>
							<Descriptions.Item label="Queried Email">
								{ this.props.record.email }
							</Descriptions.Item>
							<Descriptions.Item label="Account Bound">
								{ this.props.record.accountname }
							</Descriptions.Item>
						</Descriptions>
					</Card>
					<Card
						title="Process History"
						style={{ marginBottom: "16px" }}
						extra={ this.genExtra() }
					>	
						<TableBody 
							data={ this.props.data } 
							columns={ this.columns } 
							isSmall={ true }
							showHeader={ true }
						/>
					</Card>
					<div>
						<SecondaryDrawer
							tableDrawerKey={ this.state.tableDrawerKey }
							record={ this.state.record }
							visible={ this.state.visible } 
							onSubmit={ this.handleSubmit }
							onClose={ this.handleClose }
						>
						</SecondaryDrawer>
					</div>
				</Drawer>
			</div>
		);
	}
}

export { ProcessDrawer };
