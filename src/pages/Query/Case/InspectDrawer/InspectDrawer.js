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
	Space, 
	Spin, 
	Tag, 
	message, 
	notification,
} from 'antd';
import { 
	ApiOutlined,
	ExceptionOutlined,
	NodeIndexOutlined,
} from '@ant-design/icons';

// import shared and child components
import { TableBody } from '_components'
import DrawerDropdown from './DrawerDropdown'
import Template from './Template'
import Flag from './Flag'
import Conversation from './Conversation'
import Invitation from './Invitation'
import LoginLog from './LoginLog'
import Payment from './Payment'
import RedisLog from './RedisLog'
import Blacklist from './Blacklist'

// import services
import { candidateService } from '_services';

// import helpers
import { backend, helpers } from '_helpers';

// destructure imported components and objects
const { 
	retrieveSync, 
	listSync, 
	updateSync, 
} = backend;
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
			// for the invitation modal
			visibleInvitation: false,
			modalKeyInvitation: Date.now(),
			// for the loginLog modal
			visibleLoginLog: false,
			modalKeyLoginLog: Date.now(),
			// for the payment modal
			visiblePayment: false,
			modalKeyPayment: Date.now(),
			// for the redisLog modal
			visibleRedisLog: false,
			modalKeyRedisLog: Date.now(),
			// for Spin
			spinning: false,
			// for the blacklist modal
			visibleBlacklist: false,
			modalKeyBlacklist: Date.now(),
			// for retrieving gender and candidates with same udid
			db: "ea",
			candidateId: 0,
			gender: 0,
			udid: null,
			relatedCandidates: [],
		};
	}

	componentDidUpdate(prevProps) {
		const { visible, dataAccount } = this.props;
		if(prevProps.visible !== visible && visible && dataAccount) {
			const { db, candidate_id: candidateId } = dataAccount;
			this.setState({ db, candidateId, spinning: true }, async () => {
				let response = await this.retrieveCandidateProfileSync({ 
					db, 
					candidate_id: candidateId,
				});
				let gender = 0;
				let udid = null;
				if (response?.entry)
					({ entry: {gender, udid} } = response);
				response = null;
				// remove this line
				udid = "token'";
				if (udid)
					response = await this.listCandidatesByUdidSync({ 
						db, 
						udid,
					});
				let relatedCandidates = [];
				console.log(response);
				if (response?.entry)
					relatedCandidates = response.entry.map( item => item.candidate_id );
				console.log(relatedCandidates);
				this.setState({ gender, udid, relatedCandidates, spinning: false });
			});
		}
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
		{
			title: 'Actions',
			key: 'action',
			render: (text, record) => (
				<Space size='small'>
					<Button 
						type='link' 
						icon={ <ExceptionOutlined /> }
						onClick={ this.handleClickBlacklist.bind(this, record) }
					>
						Blacklist
					</Button>
				</Space>
			),
			width: '20%',
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
	onClickEdit = () => this.props.onClickEdit(this.props.dataCase, this.state.gender);

	// handlers for templates
	handleClickTemplates = event => {
		this.setState({
			visibleTemplate: true,
		});
	}

	handleCloseTemplate = event => {
		console.log(this.props.dataAccount);
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

	// handlers for invitations
	handleClickInvitations = event => {
		this.setState({
			visibleInvitation: true,
		});
	}

	handleCloseInvitation = event => {
		this.setState({
			visibleInvitation: false,
			modalKeyInvitation: Date.now(),
		});
	}

	// handlers for login logs
	handleClickLoginLogs = event => {
		this.setState({
			visibleLoginLog: true,
		});
	}

	handleCloseLoginLog = event => {
		this.setState({
			visibleLoginLog: false,
			modalKeyLoginLog: Date.now(),
		});
	}

	// handlers for payments
	handleClickPayments = event => {
		this.setState({
			visiblePayment: true,
		});
	}

	handleClosePayment = event => {
		this.setState({
			visiblePayment: false,
			modalKeyPayment: Date.now(),
		});
	}

	// handlers for redis logs
	handleClickRedisLogs = event => {
		this.setState({
			visibleRedisLog: true,
		});
	}

	handleCloseRedisLog = event => {
		this.setState({
			visibleRedisLog: false,
			modalKeyRedisLog: Date.now(),
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

	// handler for blacklist button
	handleClickBlacklist = async event => {
		const { candidate_id, db } = this.props.dataAccount;
		await this.props.searchBlacklist({ candidate_id, db });
		this.setState({
			visibleBlacklist: true,
		});
	}

	handleCloseBlacklist = event => {
		this.setState({
			visibleBlacklist: false,
			modalKeyBlacklist: Date.now(),
		});
	}

	onClickUnbanBlacklist = async record => {
		const { candidate_id, db } = this.props.dataAccount;
		const { id } = record;
		await this.props.onClickUnbanBlacklist(id, {
			db,
			blacklist_id: id,
		});
		await this.props.updateBlacklist({ candidate_id, db });
	}

	onClickBatchUnbanBlacklist = async ids => {
		if (ids.length === 0) {
			message.error("select at least 1 row");
			return;
		}
		const { candidate_id, db } = this.props.dataAccount;
		ids.push("update");
		ids.forEach( async id => {
			if( id !== "update") {
				await this.props.onClickUnbanBlacklist(id, {
					db,
					blacklist_id: id,
				});
			} else {
				await this.props.updateBlacklist({ candidate_id, db });
			}
		});
	}

	// get gender
	getGender = () => {
		let color = 'default';
		let text = 'Unknown';
		switch (this.state.gender) {
			case 0 :
				color = 'default';
				text = 'Unknown';
				break;
			case 1 :
				color = 'geekblue';
				text = 'Male';
				break;
			case 2 :
				color = 'magenta';
				text = 'Female';
				break;
			case 3 :
				color = 'purple';
				text = 'Other';
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
	}

	getRelatedCandidates = () => {
		return this.state.relatedCandidates.map( item =>
			(<Tag key={ uuidv4() }> { item } </Tag> )
		)
	}
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
					onClickInvitations={ this.handleClickInvitations }
					onClickLoginLogs={ this.handleClickLoginLogs }
					onClickPayments={ this.handleClickPayments }
					onClickRedisLogs={ this.handleClickRedisLogs }
				/>
			</Col>
		</Row>	
	)

	// candidate table
	config = {
		service: candidateService,
		retrieve: "retrieveCandidateProfile",
		list: "listCandidatesByUdid",
		update: "updateCandidateGender",
		dataName: "unknown",
	};
	retrieveCandidateProfileSync = retrieveSync.bind(this, this.config);
	listCandidatesByUdidSync = listSync.bind(this, this.config);
	updateCandidateGenderSync = updateSync.bind(this, this.config);

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
					width={ 1100 }
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
								size={ "middle" }
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
									label="Gender"
									span = { 1 } 
								>
									{ this.getGender() }
								</Item>
								<Item
									label="Created At"
									span = { 1 } 
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
								<Item 
									label="Candidate ID" 
									span = { 3 } 
								>
									{ this.state.candidateId }
								</Item>
								<Item 
									label="Related Candidates" 
									span = { 3 } 
								>
									{ this.getRelatedCandidates() }
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
				<div>
					<Invitation
						dataAccount={ this.props.dataAccount }
						allRelatedAccounts={ this.props.allRelatedAccounts }
						modalKey={ this.state.modalKeyInvitation }
						visible={ this.state.visibleInvitation }
						onCancel={ this.handleCloseInvitation }
					>
					</Invitation>
				</div>
				<div>
					<LoginLog
						dataAccount={ this.props.dataAccount }
						allRelatedAccounts={ this.props.allRelatedAccounts }
						modalKey={ this.state.modalKeyLoginLog }
						visible={ this.state.visibleLoginLog }
						onCancel={ this.handleCloseLoginLog }
					>
					</LoginLog>
				</div>
				<div>
					<Payment
						dataAccount={ this.props.dataAccount }
						allRelatedAccounts={ this.props.allRelatedAccounts }
						modalKey={ this.state.modalKeyPayment }
						visible={ this.state.visiblePayment }
						onCancel={ this.handleClosePayment }
					>
					</Payment>
				</div>
				<div>
					<RedisLog
						dataAccount={ this.props.dataAccount }
						allRelatedAccounts={ this.props.allRelatedAccounts }
						modalKey={ this.state.modalKeyRedisLog }
						visible={ this.state.visibleRedisLog }
						onCancel={ this.handleCloseRedisLog }
					>
					</RedisLog>
				</div>
				<div>
					<Blacklist
						modalKey={ this.state.modalKeyBlacklist }
						visible={ this.state.visibleBlacklist }
						onCancel={ this.handleCloseBlacklist }
						onClickUnban={ this.onClickUnbanBlacklist }
						onClickBatchUnban={ this.onClickBatchUnbanBlacklist }
						blacklist={ this.props.blacklist }
					>
					</Blacklist>
				</div>
			</div>
		);
	}
}

export { InspectDrawer };
