import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	Button, 
	Card, 
	Col, 
	Collapse, 
	Descriptions, 
	Drawer, 
	Row, 
	Tag, 
	message, 
	notification,
} from 'antd';
import { NodeIndexOutlined } from '@ant-design/icons';

// import shared and child components
import { TableBody } from '_components'
import DrawerDropdown from './DrawerDropdown'
import Template from './Template'

// import helpers
import { helpers } from '_helpers';

// destructure imported components and objects
const { compare } = helpers;

// destructure child components
const { Item } = Descriptions;
const { Panel } = Collapse;

class InspectDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for the template modal
			visibleTemplate: false,
			modalKeyTemplate: Date.now(),
		};
	}

	// for process history panel
	columnsProcess = [
		{
			title: 'Process',
			dataIndex: 'process',
			key: 'process',
			sorter: (a, b) => compare(a.process, b.process),
			sortDirection: ['ascend', 'descend'],
			width: '25%',
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
			sorter: (a, b) => compare(a.details, b.details),
			sortDirection: ['ascend', 'descend'],
			key: 'details',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Created At',
			dataIndex: 'created_at',
			sorter: (a, b) => compare(a.created_at, b.created_at),
			sortDirection: ['ascend', 'descend'],
			key: 'created_at',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Created By',
			dataIndex: 'alias',
			sorter: (a, b) => compare(a.alias, b.alias),
			sortDirection: ['ascend', 'descend'],
			key: 'alias',
			width: '25%',
			setFilter: false
		},
	];

	// for related email panel
	columnsEmail = [
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			width: '34%',
			setFilter: false
		},
		{
			title: 'Profile Name',
			dataIndex: 'profilename',
			key: 'profilename',
			width: '33%',
			setFilter: false
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
			width: '33%',
			setFilter: false
		},
	];

	// for related account panel
	columnsAccount = [
		{
			title: 'Candidate ID',
			dataIndex: 'candidate_id',
			key: 'candidate_id',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Account Type',
			dataIndex: 'account_type',
			key: 'account_type',
			width: '25%',
			render: account_type => {
				let color = 'gold';
				let text = 'Phone';
				switch (account_type) {
					case 'f' :
						color = 'blue';
						text = 'Facebook';
						break;
					case 'p' :
						color = 'gold';
						text = 'Phone';
						break;
					default:
						color = 'gold';
						text = 'Phone';
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
			title: 'Account Name',
			dataIndex: 'accountname',
			key: 'accountname',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: '20%',
			render: status => {
				let color = 'green';
				let text = 'Unbanned';
				switch (status) {
					case 'b' :
						color = 'red';
						text = 'Banned';
						break;
					case 'u' :
						color = 'green';
						text = 'Unbanned';
						break;
					default:
						color = 'green';
						text = 'Unbanned';
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

	// handlers for unban
	onClickUnban = () => {
		const key = `open${Date.now()}`;
		const btn = (
			<Button 
				type='primary' 
				size='small' 
				onClick={ this.handleClickConfirmUnban.bind(this, notification.close, key) }
			>
				Confirm
			</Button>
		);
		notification.open({
			message: 'About to UNban This Account',
			description:
				<> 
					{"Are you sure to "} 
					<span style={{color: "#5a9ef8"}}><strong>UNban</strong></span> 
					{" this account?"}
				</>,
			btn,
			key,
			duration: 0,
			onClose: () => message.info("Ban Cancelled"),
		});
	};

	handleClickConfirmUnban = (closeNotification, notificationKey) => {
		this.props.onClickUnban();
		message.success("the account has been UNbanned successfully");
		closeNotification(notificationKey);
	};

	// handlers for ban
	onClickBan = () => {
		const key = `open${Date.now()}`;
		const btn = (
			<Button 
				type='primary' 
				size='small' 
				onClick={ this.handleClickConfirmBan.bind(this, notification.close, key) }
			>
				Confirm
			</Button>
		);
		notification.open({
			message: 'About to Ban This Account',
			description:
				<> 
					{"Are you sure to "} 
					<span style={{color: "#ec5f5b"}}><strong>Ban</strong></span> 
					{" this account?"}
				</>,
			btn,
			key,
			duration: 0,
			onClose: () => message.info("Ban Cancelled"),
		});
	};

	handleClickConfirmBan = (closeNotification, notificationKey) => {
		this.props.onClickBan();
		message.success("the account has been Banned successfully");
		closeNotification(notificationKey);
	};


	// handlers for templates
	handleClickTemplates = event => {
		this.setState({
			visibleTemplate: true,
		});
	}

	handleCloseTemplate = event => {
		this.setState({
			visibleTemplate: false,
			modalKeyTemplate: Date.now(),
		});
	}

	// define the bind button
	genExtra = () => (
		<Button
			type="ghost"
			style={{ border: "none" }}
			size="small"
			onClick={ this.onClickBind }
		>
			<NodeIndexOutlined />
			Bind
		</Button>
	);

	onClickBind = () => this.props.onClickBind(this.props.dataCase);

	// define status 
	getStatus = status => {
		let color = 'geekblue';
		let text = 'Open';
		switch (status) {
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
	// define labels
	getLabels = labelname => {
		const labels = this.props.labels.slice();
		const elements = labelname === undefined 
			|| labelname[0] === null 
			|| labels.length === 0 
			? <></> : 
			labelname.map( (item, index) => {
				const label_color = labels
					.find( label => label.labelname === item ).label_color;
				let color = 'default';
				switch (label_color) {
					case 'l' :
						color = 'success';
						break;
					case 'b' :
						color = 'processing';
						break;
					case 'r' :
						color = 'error';
						break;
					case 'y' :
						color = 'warning';
						break;
					case 'g' :
						color = 'default';
						break;
					default :
						color = 'default';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ item }
					</Tag>
				);
			});
		return elements;
	}

	// define the header for the table drawer
	title = (
		<Row>
			<Col span={ 8 }>
				Inspect A Case
			</Col>
			<Col
				span={ 2 }
				offset={ 12 }
			>
				<DrawerDropdown 
					onClickAction={ this.handleClickAction }
					onClickEdit={ this.handleClickEdit }
					onClickUnban={ this.onClickUnban }
					onClickBan={ this.onClickBan }
					onClickTemplates={ this.handleClickTemplates }
				/>
			</Col>
		</Row>	
	)

	// sorting rules
	dynamicSort(property) {
			var sortOrder = 1;

			if(property[0] === "-") {
					sortOrder = -1;
					property = property.substr(1);
			}

			return function (a,b) {
					if (typeof a[property] === "string") {
						if(sortOrder === -1){
								return b[property].localeCompare(a[property]);
						}else{
								return a[property].localeCompare(b[property]);
						}        
					} else {
						if(sortOrder === -1){
								return a[property] - b[property];
						}else{
								return b[property] - a[property];
						}        
					}
			}
	}

	render(){
		return (
			<div 
				className='InspectDrawer'
				key={ this.props.tableDrawerKey } 
			>
				<Drawer
					title={ this.title }
					width={ 1000 }
					bodyStyle={{ paddingBottom: 80 }}
					visible={ this.props.visible }
					onClose={ this.props.onClose }
				>
					<Card
						style={{ marginBottom: "16px", background: "#fafafa" }}
					>
						<Descriptions 
							column={ 3 }
						>
							<Item
								label="Case Name" 
								span = { 2 } 
							> 
								{ this.props.dataCase.casename }
							</Item>
							<Item
								label="Created At"
								span = { 1 } 
							>
								{ this.props.dataCase.created_at }
							</Item>
							<Item
								label="Status"
								span = { 2 } 
							>
								{ this.getStatus( this.props.dataCase.status ) }
							</Item>
							<Item 
								label="Labels"
								span = { 1 } 
							>
								{ this.getLabels( this.props.dataEmail.labelname ) }
							</Item>
							<Item 
								label="Remarks" 
								span = { 2 } 
							>
								{ this.props.dataCase.remarks }
							</Item>
						</Descriptions>
					</Card>
					<Collapse 
						defaultActiveKey={
							this.props.disabled ? ['1', '2', '3'] : ['1']
						} 
						expandIconPosition="left"
					>
							<Panel 
								header="Process History" 
								key="4"
							>
								<TableBody
									columns={ this.columnsProcess } 
									data={ this.props.dataProcess ? 
										this.props.dataProcess : [] } 
									isSmall={ true }
									pagination={ false }
								/>
							</Panel>
							<Panel 
								header="Related Email" 
								key="2"
							>
								<TableBody
									columns={ this.columnsEmail } 
									data={ this.props.dataEmail ? 
										[ this.props.dataEmail ] : [] }
									isSmall={ true }
									pagination={ false }
								/>
							</Panel>
							<Panel 
								header="Related Account" 
								key="3"
								extra={ this.genExtra() }
							>
								<TableBody
									columns={ this.columnsAccount } 
									data={ this.props.dataAccount ? 
										[ this.props.dataAccount ] : [] } 
									isSmall={ true }
									pagination={ false }
								/>
							</Panel>
						</Collapse>
				</Drawer>
				<div>
					<Template
						modalKey={ this.state.modalKeyTemplate }
						visible={ this.state.visibleTemplate }
						onCancel={ this.handleCloseTemplate }
					>
					</Template>
				</div>
			</div>
		);
	}
}

export { InspectDrawer };