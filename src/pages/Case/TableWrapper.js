import React, { Component } from 'react';

// import components from ant design
import { 
	Button, 
	Col, 
	Dropdown, 
	Menu, 
	Popconfirm, 
	Row, 
	Space, 
	message, 
	notification, 
} from 'antd';
import { 
	DeleteOutlined,
	EditOutlined, 
	FileTextOutlined, 
	HistoryOutlined, 
	NodeIndexOutlined, 
	ApiOutlined, 
} from '@ant-design/icons';

// import shared and child components
import { TableBody } from '_components'
import { TableDropdown } from '_components'
import { TableDrawer } from '_components'
import { ProcessDrawer } from './ProcessDrawer'
import { BindDrawer } from './BindDrawer'
import { MergeDrawer } from './MergeDrawer'

// import services
import { 
	accountService,
	processService, 
	profileService, 
} from '_services';

// import helpers
import { backend } from '_helpers';

// destructure imported components and objects
const { createSync, listSync, updateSync } = backend;

class TableWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedRowKeys: [], // for selecting rows in TableBody
			tableDrawerKey: Date.now(), // for refreshing the TableDrawer
			visible: false, // for opening or closing the TableDrawer
			record: {}, // for loading a record into the form in TableDrawer
			disabled: false, // for disabling the input fields in TableDrawer
			isCreate: false, 
			// for the process drawer
			visibleProcess: false,
			dataProcess: [],
			// for the bind drawer
			visibleBind: false,
			bindDrawerKey: Date.now(),
			// accounts in the same profile
			accounts: [],
			allAccounts: [],
			// for the merge modal
			bind: {},
			merge: {},
			visibleMerge: false,
			mergeModalKey: Date.now(),
			profiles: {}, //temp solution
		};
	}
	
	componentDidMount() {
		this.listProfiles();
		this.listAllAccounts();
	}

	// customised menu for bind, process, process history
	getMenu = record => (
		<Menu >
			{
				record.accountname === "Unbound" ?
					(
						<Menu.Item 
							key='1' 
							style={{ color:'#5a9ef8' }} 
							icon={ <NodeIndexOutlined /> }
							onClick={ this.handleClickBind.bind(null, record) }
						>
							Bind
						</Menu.Item>
					)
				:
					(
						<Menu.Item 
							key='2' 
							style={{ color:'#5a9ef8' }} 
							icon={ <ApiOutlined /> }
							onClick={ this.onClickUnbind.bind(null, record) }
						>
							Unbind
						</Menu.Item>
					)
			}
			<Menu.Item 
				key='3' 
				style={{ color:'#5a9ef8' }} 
				icon={ <HistoryOutlined /> }
				onClick={ this.handleClickProcess.bind(null, record) }
			>
				Process
			</Menu.Item>
			<Menu.Item 
				key='4' 
				style={{ color:'#5a9ef8' }} 
				icon={ <FileTextOutlined /> }
				onClick={ this.handleClickView.bind(this, record) }
			>
				View
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
					<Dropdown.Button 
						onClick={ this.handleClickEdit.bind(this, record) }
						type='link' 
						overlay={ this.getMenu(record) }
					>
						<EditOutlined /> Edit
					</Dropdown.Button>
					<Popconfirm
						title='Are you sure to delete this record?'
						onConfirm={ this.handleClickDelete.bind(this, record) }
						onCancel={ () => console.log('cancel') }
						okText='Confirm'
						cancelText='Cancel'
						placement='left'
					>
					<Button 
						type='link' 
						danger 
						icon={ <DeleteOutlined /> }
						//onClick={ this.handleClickDelete.bind(this, record) }
					>
						Delete
					</Button>
					</Popconfirm>
				</Space>
			),
			width: '20%',
			setFilter: false
		},
	];

	// handlers for actions in TableBody
	handleClickView = record => {
		this.setState({
			visible: true, 
			disabled: true,
			record: {...record, case_id: record.id},
		});
	}

	handleClickEdit = record => {
		this.setState({
			visible: true, 
			disabled: false,
			record: {...record, case_id: record.id},
		});
	}

	handleClickDelete = record => this.props.delete(record.id);

	handleSelectChange = selectedRowKeys => this.setState({ selectedRowKeys });

	// handlers for actions in TableDropdown
  handleClickAdd = async event => {
		const response = await this.props.retrieveNextId()
		const case_id = response?.entry?.AUTO_INCREMENT;
    this.setState({
      visible: true,
			disabled: false,
			isCreate: true,
			record: {case_id},
    });
  };

	handleClickRefreshTable = () => {
		this.props.refreshTable();
		message.info('the table has been refreshed');
	}

	handleClickBatchDelete = () => {
		const key = `open${Date.now()}`;
		const btn = (
			<Button 
				type='primary' 
				size='small' 
				onClick={ this.handleClickConfirm.bind(this, notification.close, key) }
			>
				Confirm
			</Button>
		);
		notification.open({
			message: 'About to delete multiple records',
			description:
				'Are you sure to delete these records?',
			btn,
			key,
			duration: 0,
			onClose: () => message.info('batch delete has been canceled'),
		});
	};

  handleClickConfirm = (closeNotification, notificationKey) => {
		this.props.delete(this.state.selectedRowKeys);
		closeNotification(notificationKey);
  };

	// handlers for actions in TableDrawer
  handleClose = () => {
    this.setState({
      visible: false,
			isCreate: false,
			record: {},
			tableDrawerKey: Date.now(),
    });
  };

	handleSubmit = record => {

		if (this.state.record.id) // edit the entry
			this.props.edit(this.state.record.id, record);
		else // create an entry
			this.props.create(record);

		this.setState({
			record: {},
			visible: false,
			tableDrawerKey: Date.now(),
		});
	}

	// handlers for process button and process drawer
	handleClickProcess = record => {
		// get process history
		this.listSync({'case_id': record.id});
		this.setState({
			visibleProcess: true, 
			record, 
		});
	}

	handleCloseProcess = event => {
		this.setState({
			visibleProcess: false, 
			record: {},
			dataProcess: [],
		});
	}

	// handlers for bind button and bind drawer
	handleClickBind = record => {
		// get all accounts in the same profile
		this.listAccounts({email: record.email});
		this.setState({
			visibleBind: true, 
			record, 
		});
	}

	onClickUnbind = record => {
		if (record.accountname !== "Unbound")
			this.props.unbind(record.id, { case_id: record.id });
		else
			message.info("The case is not bound to any account");
	}

	handleCloseBind = event => {
		this.setState({
			visibleBind: false, 
			record: {},
			bindDrawerKey: Date.now(), 
		});
	}

	handleSubmitBind = record => {
		// save the bind for a merge
		const bind = 
			{ case_id: this.state.record.id, accountname: record.accountname }
		this.setState({ bind });
		// check if the accountname is valid
		const accountname = record.accountname.trim().toLowerCase();
		const allAccounts = this.state.allAccounts
			.map( item => item.accountname.trim().toLowerCase() );
		if (!allAccounts.includes( accountname )) {
			this.setState({
				visibleBind: false, 
				record: {},
				bindDrawerKey: Date.now(), 
			});
			message.error(`Account name #${record.accountname}# does not exist`);
			return;
		}
		// check if there is a merge
		const accounts = this.state.accounts
			.map( item => item.accountname.trim().toLowerCase() );
		if (accounts.includes( accountname )) {
			// bind
			this.props.bind(this.state.record.id, bind);
			// close drawer
			this.setState({
				visibleBind: false, 
				record: {},
				bindDrawerKey: Date.now(), 
			});
		} else {
			this.handleClickMerge();
		}
	}

	handleClickMerge = () => {
		const key = `open${Date.now()}Merge`;
		const btn = (
			<Button 
				type='primary' 
				size='small' 
				onClick={ this.handleClickConfirmMerge.bind(this, notification.close, key) }
			>
				Merge
			</Button>
		);
		notification.open({
			message: 'About to Merge 2 Profiles',
			description:
			(<>
				<div>
					{`The account you have entered is bound to a different profile 
					from the one that the queried email is bound to.`}
				</div>
				<div>
					{`If you proceed to bind the case to this account, 
					a merge will occur and the action is ` }
					<strong
						style={{ color: 'red' }}
					> 
						{ `irreversible.` }
					</strong>
				</div>
				<br />
				<div>
					{`Are you sure you want to merge the 2 profiles?`}
				</div>
			</>),
			btn,
			key,
			duration: 0,
			onClose: () => message.info('Merge Aborted'),
		});
	};

	handleClickConfirmMerge = (closeNotification, notificationKey) => {
		// call merge api
		const id = this.state.record.id;
		const bind = Object.assign({}, this.state.bind);
		this.props.bind(id, bind)
			.then( entry => this.setState({ merge: entry }) );
		// set state
		this.setState({ 
			visibleBind: false,
			bindDrawerKey: Date.now(), 
		}, () => this.setState({
			visibleMerge: true,
		}) );
		closeNotification(notificationKey);
	};

	// handlers for merge modal
	handleCloseMerge = event => {
		this.setState({
			visibleMerge: false, 
			record: {},
			mergeModalKey: Date.now(), 
		});
	}

	handleSubmitMerge = change => {
		const merge = Object.assign( {}, this.state.merge );
		const id = merge.profile_id_to;
		const record = { };
		if (change) {
			record.profilename = merge.profile_from.profilename;
			record.description = merge.profile_from.description;
		} else {
			record.profilename = merge.profile_to.profilename;
			record.description = merge.profile_to.description;
		}
		this.updateMergeProfile( id, record );
		this.setState({
			visibleMerge: false, 
			record: {},
			mergeModalKey: Date.now(), 
		});
	}

	// bind versions of CRUD
	config = {
		service: processService,
		create: "create",
		retrieve: "retrieve",
		list: "list",
		update: "update",
		dataName: "dataProcess",
	};
	create = createSync.bind(this, this.config);
	createSync = async record => {
		// update process table in process drawer
		const response = await this.create(record);
		// update case table
		await this.props.list();
		// update case info in process drawer
		if (response.code === 200) {
			const newRecord = this.props.data
				.find( item => item.id === this.state.record.id );
			this.setState({ record: newRecord });
		}
	}
	listSync = listSync.bind(this, this.config);
	updateSync = updateSync.bind(this, this.config);

	configAccount = {
		service: accountService,
		list: "listByEmail",
		dataName: "accounts",
	};
	listAccounts = listSync.bind(this, this.configAccount);
	listAllAccounts = listSync.bind(this, {
		...this.configAccount, 
		list: "list",
		dataName: "allAccounts",
	});

	configProfile = {
		service: profileService,
		retrieve: "retrieve",
		list: "list",
		update: "updateMerge",
		dataName: "profiles",
	};
	listProfiles = listSync.bind(this, this.configProfile);
	updateMergeProfile = updateSync.bind(this, this.configProfile);

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
					<Col 
						style={{ 
							fontSize: this.props.isSmall ? 
							'20px' : '24px', textAlign: 'right' 
						}}
						span={ 12 } 
					>
						{ this.props.showDropdown === false ? (<></>) : (<>
								<TableDropdown 
									dropdownName={ this.props.dropdownName }
									onClickAdd={ this.handleClickAdd }
									onClickRefreshTable={ this.handleClickRefreshTable }
									onClickBatchDelete={ this.handleClickBatchDelete }
								/>
							</>)
						}
					</Col>
				</Row>
				<div>
					<TableBody 
						data={ this.props.data } 
						columns={ this.columns } 
						selectedRowKeys={ this.state.selectedRowKeys }
						onSelectChange={ this.handleSelectChange }
						isSmall={ this.props.isSmall }
						showHeader={ this.props.showHeader }
						loading={ this.props.loading }
					/>
				</div>
				<div>
					<TableDrawer 
						tableDrawerKey={ this.state.tableDrawerKey }
						drawerTitle={ this.props.drawerTitle } 
						visible={ this.state.visible } 
						onClose={ this.handleClose }
						record={ this.state.record }
						formItems={ this.props.formItems }
						disabled={ this.state.disabled } 
						isCreate={ this.state.isCreate } 
						onSubmit={ this.handleSubmit }
						drawerWidth={ this.props.drawerWidth }
						formLayout={ this.props.formLayout }
					/>
				</div>
				<div>
					<ProcessDrawer
						data={ this.state.dataProcess } 
						visible={ this.state.visibleProcess } 
						onClose={ this.handleCloseProcess }
						record={ this.state.record }
						create={ this.createSync }
						edit={ this.updateSync }
					>
					</ProcessDrawer>
				</div>
				<div>
					<BindDrawer
						tableDrawerKey={ this.state.bindDrawerKey } 
						visible={ this.state.visibleBind } 
						onClose={ this.handleCloseBind }
						record={ this.state.record }
						onSubmit={ this.handleSubmitBind }
					>
					</BindDrawer>
				</div>
				<div>
					<MergeDrawer
						mergeModalKey ={ this.state.mergeModalKey } 
						visible={ this.state.visibleMerge } 
						onClose={ this.handleCloseMerge }
						record={ this.state.merge }
						onSubmit={ this.handleSubmitMerge }
					>
					</MergeDrawer>
				</div>
			</div>
		);
	}
}

export { TableWrapper };
