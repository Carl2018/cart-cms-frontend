import React, { Component } from 'react';

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
import ActionDrawer from './ActionDrawer'
import BindDrawer from './BindDrawer'
import DrawerDropdown from './DrawerDropdown'
import EditDrawer from './EditDrawer'
import TableBody from '../../_components/TableBody'
import Template from './Template'

// destructure child components
const { Item } = Descriptions;
const { Panel } = Collapse;

class TableDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for the case table
			dataCase: [],
			// for the email table
			dataEmail: [],
			// for the account table
			dataAccount: [],
			// for the action table
			dataAction: [],
			// for the action drawer
			visibleAction: false,
			formKeyAction: Date.now(),
			// for the edit drawer
			visibleEdit: false,
			formKeyEdit: Date.now(),
			// for the bind drawer
			visibleBind: false,
			formKeyBind: Date.now(),
			// for the template modal
			visibleTemplate: false,
			modalKeyTemplate: Date.now(),
		};
	}

	// update the corresponding state variables
	componentWillReceiveProps(nextProps) {
		this.setState({ 
			dataCase: nextProps.dataCase ? [ nextProps.dataCase ] : [], 
			dataEmail: nextProps.dataEmail ? [ nextProps.dataEmail ] : [], 
			dataAccount: nextProps.dataAccount ? [ nextProps.dataAccount ] : [], 
			dataAction: nextProps.dataCase ? nextProps.dataCase.actions : [], 
		});
	}

	// for action history panel
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

	// for related account panel
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

	// handlers for action button and action drawer
	handleClickAction = record => {
		this.setState({
			visibleAction: true, 
		});
	}

	handleCloseAction = event => {
		this.setState({
			visibleAction: false, 
		});
	}

	handleSubmitAction = record => {
		message.success("The action has been peformed successfully");
		this.setState({
			visibleAction: false, 
			formKeyAction: Date.now(),
		});
	}

	// handlers for edit button and edit drawer
	handleClickEdit = record => {
		this.setState({
			visibleEdit: true, 
		});
	}

	handleCloseEdit = event => {
		this.setState({
			visibleEdit: false, 
		});
	}

	handleSubmitEdit = record => {
		this.props.onSubmit(record);
		this.setState({
			visibleEdit: false, 
			formKeyEdit: Date.now(),
		});
	}

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
			onClick={ this.handleClickBind }
		>
			<NodeIndexOutlined />
			Bind
		</Button>
	);

	// handlers for bind
	handleClickBind = event => {
		event.stopPropagation();
		if (this.props.dataCase.relatedAccount)
			message.info("The case has been bound to an account already")
		else 
			this.setState({ visibleBind: true });
	}

	handleCloseBind = event => {
		this.setState({
			visibleBind: false, 
		});
	}

	handleSubmitBind = record => {
		const dataAccount = [ this.props.allRelatedAccounts
			.find( item => item.accountName === record.relatedAccount ) ];
		this.props.onSubmit(record);
		this.setState({
			dataAccount,
			visibleBind: false, 
			formKeyBind: Date.now(),
		});
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
								{ this.props.dataCase.casename }
							</Item>
							<Item label="Status">
								{ this.props.dataCase.status }
							</Item>
							<Item label="Created At">
								{ this.props.dataCase.createdAt }
							</Item>
							<Item 
								label="Remarks" 
								span = { 2 } 
							>
								{ this.props.dataCase.remarks }
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
						record={ this.props.dataCase }
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

export default TableDrawer;
