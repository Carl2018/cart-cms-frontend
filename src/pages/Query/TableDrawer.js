import React, { Component } from 'react';

// import styling from ant design
import { 
	Button, Form, Divider, Descriptions, Row, Col, Card, 
	Drawer, Tag, Collapse, message, notification,
} from 'antd';
import { 
	NodeIndexOutlined,
} from '@ant-design/icons';

// import shared components
import TableBody from '../../_components/TableBody'
import TableDropdown from './TableDropdown'
import ActionDrawer from './ActionDrawer'
import EditDrawer from './EditDrawer'
import BindDrawer from './BindDrawer'
import Template from './Template'

const { Item } = Descriptions;
const { Panel } = Collapse;

class TableDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// populate the email table
			dataCase: [],
			// populate the email table
			dataEmail: [],
			// populate the account table body with data
			dataAccount: [],
			// populate the action table
			dataAction: [],
			// opening and closing of the action drawer
			visibleAction: false,
			formKeyAction: Date.now(),
			// opening and closing of the edit drawer
			visibleEdit: false,
			formKeyEdit: Date.now(),
			// opening and closing of the bind drawer
			visibleBind: false,
			formKeyBind: Date.now(),
			// for modal
			visibleModal: false,
			// for Collapse
			searchResults: this.allOptions,
			allOptions: this.allOptions,
			// for SearchableInput
			modalKey: Date.now(),
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ 
			dataCase: nextProps.dataCase ? [ nextProps.dataCase ] : [], 
			dataEmail: nextProps.dataEmail ? [ nextProps.dataEmail ] : [], 
			dataAccount: nextProps.dataAccount ? [ nextProps.dataAccount ] : [], 
			dataAction: nextProps.dataCase ? nextProps.dataCase.actions : [], 
		});
	}

	// layout for forms
	layout = {
		labelCol: {
			span: 8,
		},
		wrapperCol: {
			span: 12,
		},
	};
	tailLayout = {
		wrapperCol: {
			offset: 8,
			span: 16,
		},
	};

	columnsCase = [
		{
			title: 'Case Name',
			dataIndex: 'casename',
			key: 'casename',
			width: '34%',
			setFilter: false
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: '33%',
			setFilter: false
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: '33%',
			setFilter: false
		},
	];

	handleClickAction = record => {
		this.setState({
			visibleAction: true, 
		});
	}

	handleCloseAction = event => {
		console.log(event);
		this.setState({
			visibleAction: false, 
		});
	}

	handleSubmitAction = record => {
		console.log(record);
		message.success("The action has been peformed on the case successfully");
		this.setState({
			visibleAction: false, 
			formKeyAction: Date.now(),
		});
	}

	handleClickEdit = record => {
		this.setState({
			visibleEdit: true, 
		});
	}

	handleCloseEdit = event => {
		console.log(event);
		this.setState({
			visibleEdit: false, 
		});
	}

	handleSubmitEdit = record => {
		console.log(record);
		this.props.onSubmit(record);
		this.setState({
			visibleEdit: false, 
			formKeyEdit: Date.now(),
		});
	}

	handleCloseBind = event => {
		console.log(event);
		this.setState({
			visibleBind: false, 
		});
	}

	handleSubmitBind = record => {
		console.log(this.props.allRelatedAccounts);
		const dataAccount = [ this.props.allRelatedAccounts
			.find( item => item.accountName === record.relatedAccount ) ];
		this.props.onSubmit(record);
		this.setState({
			dataAccount,
			visibleBind: false, 
			formKeyBind: Date.now(),
		});
	}

	allEmails = [
		{
			key: '1',
			email: 'alice@gmail.com',
			createdAt: new Date('2020-05-20T14:20:20').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-25T11:28:25').toISOString().split('.')[0].replace('T', ' '),
			profileID: '1',
		},
	];

	columnsEmail = [
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			width: '34%',
			setFilter: false
		},
		{
			title: 'Last Contacted At',
			dataIndex: 'updatedAt',
			key: 'updatedAt',
			width: '33%',
			setFilter: false
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: '33%',
			setFilter: false
		},
	];

	handleClickTemplates = event => {
		console.log(event);
		this.setState({
			visibleModal: true,
		});
	}

	handleCancel = event => {
		this.setState({
			visibleModal: false,
			modalKey: Date.now(),
		});
	}

	allAccounts = [
		{
			key: '1',
			candidateID: 'u9876543210',
			accountName: 'alice@facebook.com',
			accountType: 'facebook',
			labels: ['banned'],
			createdAt: new Date('2020-05-20T14:20:20').toISOString().split('.')[0].replace('T', ' '),
		},
	];

	columnsAccount = [
		{
			title: 'Candidate ID',
			dataIndex: 'candidateID',
			key: 'candidateID',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Account Type',
			dataIndex: 'accountType',
			key: 'accountType',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Account Name',
			dataIndex: 'accountName',
			key: 'accountName',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Status',
			dataIndex: 'banned',
			key: 'banned',
			render: banned => ( banned ? 
				<Tag color="red">BANNED</Tag> : 
				<Tag color="blue">UNBANNED</Tag> ),
			width: '20%',
		},
	];

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

	columnsAction = [
		{
			title: 'Action',
			dataIndex: 'action',
			key: 'action',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Details',
			dataIndex: 'details',
			key: 'details',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Created By',
			dataIndex: 'createdBy',
			key: 'createdBy',
			width: '25%',
			setFilter: false
		},
	];

	allActions = [
		{
			key: '1',
			action: 'open',
			details: 'opened a case',
			createdAt: new Date('2020-05-20T14:20:20').toISOString().split('.')[0].replace('T', ' '),
			createdBy: 'root',
		},
		{
			key: '2',
			action: 'reply',
			details: 'informed the user to wait for 1 day',
			createdAt: new Date('2020-05-21T14:20:20').toISOString().split('.')[0].replace('T', ' '),
			createdBy: 'root',
		},
		{
			key: '3',
			action: 'reply',
			details: 'informed the user that his account has been unbaned',
			createdAt: new Date('2020-05-21T14:20:20').toISOString().split('.')[0].replace('T', ' '),
			createdBy: 'andy',
		},
	];

	handleClickBind = event => {
		event.stopPropagation();
		console.log(this.props.record.relatedAccount);
		if (this.props.record.relatedAccount)
			message.info("The case has been bound to an account already")
		else 
			this.setState({ visibleBind: true });
		
	}

	genExtra = () => (
		<Button
			type="ghost"
			style={{ border: "none" }}
			size="small"
			onClick={ this.handleClickBind }
		>
			<NodeIndexOutlined />
			Bind
		</Button>
	);

	title = (
		<Row>
			<Col span={ 8 }>
				Inspect A Case
			</Col>
			<Col
				span={ 2 }
				offset={ 12 }
			>
				<TableDropdown 
					onClickAction={ this.handleClickAction }
					onClickEdit={ this.handleClickEdit }
					onClickUnban={ this.onClickUnban }
					onClickBan={ this.onClickBan }
					onClickTemplates={ this.handleClickTemplates }
				/>
			</Col>
		</Row>	
	)

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
				className='TableDrawer'
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
							<Item label="Case Name"> 
								{ this.props.record.casename }
							</Item>
							<Item label="Status">
								{ this.props.record.status }
							</Item>
							<Item label="Created At">
								{ this.props.record.createdAt }
							</Item>
							<Item 
								label="Remarks" 
								span = { 2 } 
							>
								{ this.props.record.remarks }
							</Item>
							<Item 
								label="Labels"
								span = { 1 } 
							>
								{ this.state.dataEmail[0]?.labels?.map(tag => {
									let color = 'blue';
									switch (tag) {
										case 'burning' :
											color = 'magenta';
											break;
										case 'hot' :
											color = 'red';
											break;
										case 'temperate' :
											color = 'orange';
											break;
										case 'warm' :
											color = 'gold';
											break;
										case 'agreeable' :
											color = 'green';
											break;
										case 'cold' :
											color = 'blue';
											break;
										case 'icy' :
											color = 'geekblue';
											break;
										case 'freezing' :
											color = 'purple';
											break;
										default :
											color = 'lime';
											break;
									}
									return (
										<Tag color={color} key={tag}>
											{tag.toUpperCase()}
										</Tag>
									);
								})}
							</Item>
						</Descriptions>
					</Card>
					<Form
						{ ...this.layout }
						name='basic'
						initialValues={{
							remember: true,
						}}
						onFinish={ this.props.onSubmit }
						onFinishFailed={ this.onFinishFailed }
					>

					<Collapse 
						defaultActiveKey={
							this.props.disabled ? ['1', '2', '3'] : ['1']
						} 
						expandIconPosition="left"
					>
							<Panel 
								header="Action History" 
								key="4"
							>
								<TableBody
									columns={ this.columnsAction } 
									data={ this.state.dataAction ? this.state.dataAction : [] } 
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
									data={ this.state.dataEmail ? this.state.dataEmail : [] }
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
									data={ this.state.dataAccount ? this.state.dataAccount : [] } 
									isSmall={ true }
									pagination={ false }
								/>
							</Panel>
						</Collapse>
						<Divider />
						{ this.props.disabled ? <></> : 
							<div style={{ textAlign:'right' }} >
								<Button 
									onClick={ this.props.onClose } 
									style={{ marginRight: 8 }}
								>
									Cancel
								</Button>
								<Button 
									type='primary' 
									htmlType='submit'
								>
									Submit
								</Button>
							</div>
						}
					</Form>
				</Drawer>
				<div>
					<ActionDrawer
						visible={ this.state.visibleAction } 
						onClose={ this.handleCloseAction }
						formKey={ this.state.formKeyAction }
						onFinish={ this.handleSubmitAction }
					>
					</ActionDrawer>
				</div>
				<div>
					<EditDrawer
						visible={ this.state.visibleEdit } 
						onClose={ this.handleCloseEdit }
						formKey={ this.state.formKeyEdit }
						onFinish={ this.handleSubmitEdit }
						record={ this.props.record }
					>
					</EditDrawer>
				</div>
				<div>
					<BindDrawer
						visible={ this.state.visibleBind } 
						onClose={ this.handleCloseBind }
						formKey={ this.state.formKeyBind }
						onFinish={ this.handleSubmitBind }
						allRelatedAccounts={ this.props.allRelatedAccounts }
					>
					</BindDrawer>
				</div>
				<div>
					<Template
						modalKey={ this.state.modalKey }
						visible={ this.state.visibleModal }
						onCancel={ this.handleCancel }
					>
					</Template>
				</div>
			</div>
		);
	}
}

export default TableDrawer;
