import React, { Component } from 'react';

// import styling from ant desgin
import { 
	Button, 
	Col, 
	Dropdown, 
	Input, 
	Menu, 
	Pagination, 
	Popconfirm, 
	Row, 
	Select, 
	Space, 
	notification, 
	message, 
} from 'antd';
import { 
	CommentOutlined,
	ExceptionOutlined,
	EyeInvisibleOutlined, 
	UserDeleteOutlined, 
} from '@ant-design/icons';

// import shared components
import { TableBody } from '_components'
import { TableDrawer } from '_components'
import { Conversation } from '_components'

const { Search } = Input; 
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
				icon={ <CommentOutlined /> }
				onClick={ this.handleClickConversation.bind(this, record) }
			>
				Conversations
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
			width: 120,
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
		this.setState({
			visible: true, 
			disabled: false,
			record: {...record, blacklist_type: "E"},
		});
	}

	handleClickConversation = record => {
		this.setState({
			visibleConversation: true, 
			candidateId: record.id,
		});
	}

	// handler for search
	handleSearch = data => {
		if (data) {
			this.props.searchCandidatesSync({ keywords: data });
		} else {
			const page = 1;
			const size = 10;
			this.props.onChangePage(page, size);
		}
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
		this.props.blacklistSync(this.state.record.id, record);
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
							<Space>
								<span style={{ fontSize: "16px", marginLeft: "8px" }} >
									Cache:
								</span>
								<Select
									defaultValue="hk"
									onChange={ this.props.onChangeCache  }
									style={{ marginRight: "16px", width: 150 }}
								>
									<Option value="hk">Hong Kong</Option>
									<Option value="tw">Taiwan</Option>
									<Option value="my">Malaysia</Option>
									<Option value="ca">Canada</Option>
								</Select>
								<Search
									onSearch={ this.handleSearch }
									placeholder="Search Candidate by Message Keywords"
									style={{ width: 400 }}
									size="middle"
									allowClear
								/>
							</Space>
					</Col>
				</Row>
				<div>
					<TableBody 
						data={ this.props.data } 
						columns={ this.columns } 
						scroll={ this.props.scroll }
						isSmall={ this.props.isSmall }
						showHeader={ this.props.showHeader }
						loading={ this.props.loading }
						pagination={ this.props.pagination }
					/>
				</div>
				{ this.props.pagination ? <></> :
					<div style={{marginTop: "16px", textAlign: "right" }} >
						<Pagination
							showSizeChanger
							showQuickJumper
							current={ this.props.currentPage }
							pageSize={ this.props.pageSize }
							pageSizeOptions={ [10, 20, 50] }
							total={ this.props.total }
							onChange={ this.props.onChangePage }
							onShowSizeChange={ this.props.onChangeSize }
						/>
					</div>
				}
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
