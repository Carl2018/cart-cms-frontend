import React, { Component } from 'react';

// import styling from ant desgin
import { 
	Button, 
	Col, 
	Dropdown, 
	Input, 
	InputNumber, 
	Menu, 
	Popconfirm, 
	Row, 
	Select, 
	Space, 
	notification, 
	message, 
} from 'antd';
import { 
	CloseOutlined, 
	CommentOutlined,
	ExceptionOutlined,
	EyeInvisibleOutlined, 
	FlagOutlined, 
	SearchOutlined, 
	UserDeleteOutlined,
	EyeOutlined, 
} from '@ant-design/icons';

// import shared components
import { TableBody } from './TableBody'
import { TableDrawer } from '_components'
import { Conversation } from '_components'

const { Option } = Select; 

class TableWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedRowKeys: [], // for selecting rows in TableBody
			tableDrawerKey: Date.now(), // for refreshing the TableDrawer
			visible: false, // for opening or closing the TableDrawer
			record: {}, // for loading a record into the form in TableDrawer
			disabled: false, // for disabling the input fields in TableDrawer
			// for the conversation modal
			visibleConversation: false,
			modalKeyConversation: Date.now(),
		};
	}
	
	// customised menu for bind, process, process history
	getMenu = record => (
		<Menu >
			<Menu.Item 
				key='1' 
				style={{ color:'#5a9ef8' }} 
				icon={ <EyeInvisibleOutlined /> }
				onClick={ this.handleClickSoftBan.bind(this, record) }
			>
				Soft Ban
			</Menu.Item>
			<Menu.Item 
				key='2' 
				style={{ color:'#5a9ef8' }} 
				icon={ <ExceptionOutlined /> }
				onClick={ this.handleClickBlacklist.bind(this, record) }
			>
				Blacklist
			</Menu.Item>
			<Menu.Item 
				key='3' 
				style={{ color:'#5a9ef8' }} 
				icon={ <FlagOutlined /> }
				onClick={ this.props.onClickFlag.bind(this, record) }
			>
				Flags
			</Menu.Item>
			<Menu.Item 
				key='4' 
				style={{ color:'#5a9ef8' }} 
				icon={ <CommentOutlined /> }
				onClick={ this.handleClickConversation.bind(this, record) }
			>
				Conversations
			</Menu.Item>
			<Menu.Item 
				key='5' 
				style={{ color:'#5a9ef8' }} 
				icon={ <CloseOutlined /> }
				onClick={ this.onClickMislabelled.bind(this, record) }
			>
				Mislabelled
			</Menu.Item>
			<Menu.Item 
				key='6' 
				style={{ color:'#5a9ef8' }} 
				icon={ <EyeOutlined /> }
				onClick={ 
					this.handleClickDoAction.bind(this, this.getOptions('Unban', record)) }
			>
				Unban
			</Menu.Item>
			<Menu.Item 
				key='7' 
				style={{ color:'#5a9ef8' }} 
				icon={ <ExceptionOutlined /> }
				onClick={ this.handleClickDoAction.bind(this, this.getOptions('Scam', record)) }
			>
				Scam
			</Menu.Item>
			<Menu.Item 
				key='8' 
				style={{ color:'#5a9ef8' }} 
				icon={ <EyeOutlined /> }
				onClick={ this.handleClickDoAction.bind(this, this.getOptions('Unscam', record)) }
			>
				Unscam
			</Menu.Item>
			<Menu.Item 
				key='9' 
				style={{ color:'#5a9ef8' }} 
				icon={ <ExceptionOutlined /> }
				onClick={ this.handleClickDoAction.bind(this, this.getOptions('Sex', record)) }
			>
				Sex
			</Menu.Item>
			<Menu.Item 
				key='10' 
				style={{ color:'#5a9ef8' }} 
				icon={ <EyeOutlined /> }
				onClick={ this.handleClickDoAction.bind(this, this.getOptions('Unsex', record)) }
			>
				Unsex
			</Menu.Item>
		</Menu>
	);
	
	// define columns in TableBody
	columns = [
		...this.props.columns,
		{
			title: 'Actions',
			key: 'action',
			render: (text, record) => (
				<Space size='small'>
					<Popconfirm
						title='Are you sure to hard ban this candidate?'
						onConfirm={ this.props.hardBanSync.bind(this, record) }
						onCancel={ () => console.log('cancel') }
						okText='Confirm'
						cancelText='Cancel'
						placement='left'
					>
						<Dropdown.Button 
							type='link' 
							overlay={ this.getMenu(record) }
						>
							{ <div><UserDeleteOutlined />  Hard Ban</div> }
						</Dropdown.Button>
					</Popconfirm>
				</Space>
			),
			fixed: 'right',
			width: 150,
			setFilter: false
		},
	];

	// handler for notifcation of soft ban
	handleClickSoftBan = record => {
		const key = `open${Date.now()}`;
		const btn = (
			<Button 
				type='primary' 
				size='small' 
				onClick={ this.handleClickConfirmSoftBan.bind(this, notification.close, key, record) }
			>
				Confirm
			</Button>
		);
		notification.open({
			message: 'About to Soft Ban a Candidate',
			description:
				'Are you sure to soft ban this candidate?',
			btn,
			key,
			duration: 0,
			onClose: () => message.info('Soft ban has been canceled'),
		});
	};

	handleClickConfirmSoftBan = (closeNotification, notificationKey, record) => {
		this.props.softBanSync(record);
		closeNotification(notificationKey);
	};

	// handlers for actions in TableBody
	handleClickBlacklist = record => {
		console.log(record);
		this.setState({
			visible: true, 
			disabled: false,
			record: {
				...record, 
				id: record.suspect_id,
				blacklist_type: "E",
			},
		});
	}

	handleClickConversation = record => {
		this.setState({
			visibleConversation: true, 
			candidateId: record.id,
		});
	}

	onClickMislabelled = record => {
		const category = record.tag === 1 ? 0 : 1;
		this.props.onClickMislabelled({
			cache: this.props.cache,
			candidate_id: record.suspect_id,
			title: record.suspect_message,
			score: record.score,
			probability: record.probability,
			category,
		});
	}

	// handlers for actions in TableDrawer
  handleClose = () => {
    this.setState({
      visible: false,
			record: {},
			tableDrawerKey: Date.now(),
    });
  };

	handleSubmit = record => {
		this.props.blacklistSync(this.state.record.id, {
			...this.state.record,
			record,
		});
		this.setState({
			record: {},
			visible: false,
			tableDrawerKey: Date.now(),
		});
	}

	// handler for close conversation content modal
	handleCloseConversation = event => {
		this.setState({
			visibleConversation: false,
			modalKeyConversation: Date.now(),
		});
	}

	// handler for general notification of action.
	handleClickDoAction = (options) => {
		const key = `open${Date.now()}`;
		const btn = (
			<Button 
				type='primary' 
				size='small' 
				onClick={ this.handleClickConfirmAction.bind(this, notification.close, key, options.record, options.type) }
			>
				Confirm
			</Button>
		);
		notification.open({
			message: options.message,
			description: options.description,
			btn,
			key,
			duration: 0,
			onClose: () => message.info( options.onCloseMessage ),
		});
	};
	getOptions = (type, record) => {
		let options = {}
		options.record = record
		switch (type) {
			case 'Unban':
				options.type = 'Unban'
				options.message = 'About to Unban a Candidate'
				options.description = 'Are you sure to unban this candidate?'
				options.onCloseMessage = 'Unban has been canceled'
				break;
			case 'Sex':
				options.type = 'Sex'
				options.message = 'About to Sex a Candidate'
				options.description = 'Are you sure to sex this candidate?'
				options.onCloseMessage = 'Sex has been canceled'
				break;
			case 'Unsex':
				options.type = 'Unsex'
				options.message = 'About to Unsex a Candidate'
				options.description = 'Are you sure to unsex this candidate?'
				options.onCloseMessage = 'Unsex has been canceled'
				break;
			case 'Scam':
				options.type = 'Scam'
				options.message = 'About to Scam a Candidate'
				options.description = 'Are you sure to scam this candidate?'
				options.onCloseMessage = 'Scam has been canceled'
				break;
			case 'Unscam':
				options.type = 'Unscam'
				options.message = 'About to Unscam a Candidate'
				options.description = 'Are you sure to unscam this candidate?'
				options.onCloseMessage = 'Unscam has been canceled'
				break;
			default:
				break;
		}
		return options;
	}
	// handler for general notification of do/undo action.
	handleClickConfirmAction = (closeNotification, notificationKey, record, type) => {
		switch (type) {
			case 'Unban':
				this.props.unbanSync(record);
				break;
			case 'Sex':
				this.props.sexSync(record);
				break;
			case 'Unsex':
				this.props.unsexSync(record);
				break;
			case 'Scam':
				this.props.scamSync(record);
				break;
			case 'Unscam':
				this.props.unscamSync(record);
				break;
			default:
				break;
		}
		closeNotification(notificationKey);
	}

	render(){
		return (
			<div className='TableWrapper'>
				<Row style={{ margin: this.props.isSmall ? "8px" : "16px" }}>
					<Col 
						style={{ 
							fontSize: this.props.isSmall ? 
							'20px' : '24px', textAlign: 'left' 
						}}
						span={ 12 } 
					>
						<Space size="large">
							{ this.props.tableHeader }
						</Space>
					</Col>
				</Row>
				<Row style={{ marginBottom: "16px" }}>
					<Col 
						style={{ fontSize: '24px', textAlign: 'left' }}
						span={ 12 } 
					>
							<Space size="small">
								<span style={{ fontSize: "16px", marginLeft: "8px" }} >
									Cache:
								</span>
								<Select
									value={ this.props.cache }
									onChange={ this.props.onChangeCache  }
									style={{ marginRight: "16px", width: 150 }}
								>
									<Option value="hk">Hong Kong</Option>
									<Option value="tw">Taiwan</Option>
									<Option value="sg">Singapore</Option>
									<Option value="my">Malaysia</Option>
									<Option value="ca">Canada</Option>
								</Select>
								<span style={{ fontSize: "16px", marginLeft: "8px" }} >
									Order:
								</span>
								<Select
									value={ this.props.orderBy }
									onChange={ this.props.onChangeOrderBy }
									style={{ marginRight: "16px" }}
								>
									<Option value="timestamp">Created By</Option>
									<Option value="count">Total Flags</Option>
								</Select>
								<span style={{ fontSize: "16px", marginLeft: "8px" }} >
									Page:
								</span>
								<InputNumber
									placeholder="Page"
									onChange={ this.props.onChangePage }
									value={ this.props.page }
									style={{ width: 80 }}
									min={ 1 }
								/>
								<span style={{ fontSize: "16px", marginLeft: "8px" }} >
									Interval(hours):
								</span>
								<InputNumber
									placeholder="Hours"
									onChange={ this.props.onChangeInterval }
									value={ this.props.interval }
									style={{ width: 80 }}
									min={ 1 }
								/>
								<span style={{ fontSize: "16px", marginLeft: "8px" }} >
									Remarks:
								</span>
								<Input
									placeholder="Remarks"
									value={ this.props.remarks}
									onChange={ this.props.onChangeRemarks }
									style={{ marginRight: "16px", width: 180 }}
								>
								</Input>
								<Button
									size="middle"
									onClick={ this.props.onSearch }
									icon={ <SearchOutlined /> }
								>
									Search
								</Button>
							</Space>
					</Col>
				</Row>
				<div>
					<TableBody 
						data={ this.props.data } 
						columns={ this.columns } 
						scroll={ this.props.scroll }
						size={ this.props.size }
						showHeader={ this.props.showHeader }
						loading={ this.props.loading }
						pagination={ this.props.pagination }
					/>
				</div>
				<div>
					<TableDrawer 
						tableDrawerKey={ this.state.tableDrawerKey }
						visible={ this.state.visible } 
						onClose={ this.handleClose }
						record={ this.state.record }
						formItems={ this.props.formItems }
						disabled={ this.state.disabled } 
						onSubmit={ this.handleSubmit }
						drawerWidth={ this.props.drawerWidth }
						drawerTitle={ this.props.drawerTitle }
						formLayout={ this.props.formLayout }
					/>
				</div>
				<div>
					<Conversation
						candidateId={ this.state.candidateId }
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

export { TableWrapper };
