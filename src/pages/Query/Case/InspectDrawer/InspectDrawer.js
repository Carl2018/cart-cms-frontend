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
	Spin, 
	Tag, 
	message, 
	notification,
} from 'antd';
import { 
	ApiOutlined,
	NodeIndexOutlined,
} from '@ant-design/icons';

// import shared and child components
import { TableBody } from '_components'
import DrawerDropdown from './DrawerDropdown'
import Template from './Template'
import Flag from './Flag'
import Conversation from './Conversation'

// import helpers
import { helpers } from '_helpers';

// destructure imported components and objects
const { compare } = helpers;
const { Item } = Descriptions;
const { Panel } = Collapse;

class InspectDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for the template modal
			visibleTemplate: false,
			modalKeyTemplate: Date.now(),
			// for the flag modal
			visibleFlag: false,
			modalKeyFlag: Date.now(),
			// for the conversation modal
			visibleConversation: false,
			modalKeyConversation: Date.now(),
			// for Spin
			spinning: false,
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
			ellipsis: true,
			setFilter: false
		},
		{
			title: 'Profile ID',
			dataIndex: 'profilename',
			key: 'profilename',
			width: '33%',
			setFilter: false
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
			ellipsis: true,
			width: '33%',
			setFilter: false
		},
	];

	// for related account panel
	columnsAccount = [
		{
			title: 'Account Name',
			dataIndex: 'accountname',
			key: 'accountname',
			width: '20%',
			ellipsis: true,
			setFilter: false
		},
		{
			title: 'Candidate ID',
			dataIndex: 'candidate_id',
			key: 'candidate_id',
			ellipsis: true,
			width: '20%',
			setFilter: false
		},
		{
			title: 'Account Type',
			dataIndex: 'account_type',
			key: 'account_type',
			width: '20%',
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
					case 'a' :
						color = 'red';
						text = 'Apple';
						break;
					case 'g' :
						color = 'green';
						text = 'Google';
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
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: '15%',
			render: status => {
				let color = 'default';
				let text = 'Unknown';
				switch (status) {
					case 'h' :
						color = 'red';
						text = 'Hard Banned';
						break;
					case 's' :
						color = 'orange';
						text = 'Soft Banned';
						break;
					case 'u' :
						color = 'green';
						text = 'Unbanned';
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
			title: 'Region',
			dataIndex: 'region',
			key: 'region',
			ellipsis: true,
			width: '10%',
			setFilter: false
		},
		{
			title: 'Physical Region',
			dataIndex: 'physical_region',
			key: 'physical_region',
			ellipsis: true,
			width: '15%',
			setFilter: false
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
		if (!this.props.dataAccount) {
			message.error("The case is not bound to any account");
		} else if (this.props.dataAccount.status !== 'u') {
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
		} else {
			message.info("The account has been unbanned already");
		}
	};

	handleClickConfirmUnban = async (closeNotification, notificationKey) => {
		this.setState({ spinning: true });
		await this.props.onClickBan(this.props.dataAccount);
		this.setState({ spinning: false });
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
		if (!this.props.dataAccount) {
			message.error("The case is not bound to any account");
		} else if (this.props.dataAccount.status === 'u') {
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
		} else {
			message.info("The account has been banned already");
		}
	};

	handleClickConfirmBan = async (closeNotification, notificationKey) => {
		this.setState({ spinning: true });
		message.info("The ban button has been temporarily disabled");
		//await this.props.onClickBan(this.props.dataAccount);
		this.setState({ spinning: false });
		closeNotification(notificationKey);
	};

	// handlers for process
	onClickProcess = () => this.props.onClickProcess(this.props.dataCase);

	// handlers for edit 
	onClickEdit = () => this.props.onClickEdit(this.props.dataCase);

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

	// handlers for flags
	handleClickFlags = event => {
		this.setState({
			visibleFlag: true,
		});
	}

	handleCloseFlag = event => {
		this.setState({
			visibleFlag: false,
			modalKeyFlag: Date.now(),
		});
	}

	// handlers for conversations
	handleClickConversations = event => {
		this.setState({
			visibleConversation: true,
		});
	}

	handleCloseConversation = event => {
		this.setState({
			visibleConversation: false,
			modalKeyConversation: Date.now(),
		});
	}

	// define the bind button
	genExtra = () => (
		<div
			onClick={ event => event.stopPropagation() }
		>
			{
				this.props.dataCase.accountname === "Unbound" ?
					(
						<Button
							type="ghost"
							style={{ border: "none" }}
							size="small"
							onClick={ this.onClickBind }
						>
							<NodeIndexOutlined />
							Bind
						</Button>
					)
				:
					(
						<Button
							type="ghost"
							style={{ border: "none" }}
							size="small"
							onClick={ this.onClickUnbind }
						>
							<ApiOutlined />
							Unbind
						</Button>
					)
			}
		</div>
	);

	onClickBind = () => this.props.onClickBind(this.props.dataCase);

	onClickUnbind = () => this.props.onClickUnbind(this.props.dataCase);

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
				return (
					<Tag color={ label_color } key={ uuidv4() }>
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
				offset={ 11 }
			>
				<DrawerDropdown 
					onClickProcess={ this.onClickProcess }
					onClickEdit={ this.onClickEdit }
					onClickUnban={ this.onClickUnban }
					onClickBan={ this.onClickBan }
					onClickTemplates={ this.handleClickTemplates }
					onClickFlags={ this.handleClickFlags }
					onClickConversations={ this.handleClickConversations }
				/>
			</Col>
		</Row>	
	)

	render(){
		const categoryname = this.props.dataCase.categoryname;
		const last_processed_by = this.props.dataCase.last_processed_by;
		const remarks = this.props.dataCase.remarks;
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
					<Spin spinning={ this.state.spinning }>
						<Card
							style={{ marginBottom: "16px", background: "#fafafa" }}
						>
							<Descriptions 
								column={ 3 }
							>
								<Item
									label="Case ID" 
									span = { 1 } 
								> 
									{ this.props.dataCase.id }
								</Item>
								<Item
									label="Status"
									span = { 1 } 
								>
									{ this.getStatus( this.props.dataCase.status ) }
								</Item>
								<Item
									label="Category"
									span = { 1 } 
								>
									{ 
										categoryname && categoryname.length > 20 ?
										categoryname.slice(0,20) + '...' : categoryname
									}
								</Item>
								<Item
									label="Created At"
									span = { 2 } 
								>
									{ this.props.dataCase.created_at }
								</Item>
								<Item 
									label="Last Touch" 
									span = { 1 } 
								>
									{ 
										last_processed_by && last_processed_by.length > 15 ?
										last_processed_by.slice(0,15) + '...' : 
										last_processed_by
									}
								</Item>
								<Item 
									label="Labels"
									span = { 3 } 
								>
									{ this.getLabels( this.props.dataEmail.labelname ) }
								</Item>
								<Item 
									label="Remarks" 
									span = { 3 } 
								>
									{ remarks }
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
								header="Inquirer Email" 
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
								header="Account Bound" 
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
					</Spin>
				</Drawer>
				<div>
					<Template
						modalKey={ this.state.modalKeyTemplate }
						visible={ this.state.visibleTemplate }
						onCancel={ this.handleCloseTemplate }
					>
					</Template>
				</div>
				<div>
					<Flag
						dataAccount={ this.props.dataAccount }
						allRelatedAccounts={ this.props.allRelatedAccounts }
						modalKey={ this.state.modalKeyFlag }
						visible={ this.state.visibleFlag }
						onCancel={ this.handleCloseFlag }
					>
					</Flag>
				</div>
				<div>
					<Conversation
						dataAccount={ this.props.dataAccount }
						allRelatedAccounts={ this.props.allRelatedAccounts }
						modalKey={ this.state.modalKeyConversation }
						visible={ this.state.visibleConversation }
						onCancel={ this.handleCloseConversation }
					>
					</Conversation>
				</div>
			</div>
		);
	}
}

export { InspectDrawer };
