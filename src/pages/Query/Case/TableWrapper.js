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
	FileSearchOutlined, 
	HistoryOutlined, 
	NodeIndexOutlined, 
} from '@ant-design/icons';

// import shared and child components
import { TableBody } from '_components'
import { TableDropdown } from '_components'
import { TableDrawer } from '_components'
import { ProcessDrawer } from './ProcessDrawer'
import { BindDrawer } from './BindDrawer'
import { MergeDrawer } from './MergeDrawer'
import { InspectDrawer } from './InspectDrawer/InspectDrawer'

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
			processDrawerKey: Date.now(),
			// for the bind drawer
			visibleBind: false,
			bindDrawerKey: Date.now(),
			// accounts in the same profile
			accounts: [],
			// for the merge drawer
			change: false,
			bind: {},
			merge: {},
			visibleMerge: false,
			mergeModalKey: Date.now(),
			profiles: {}, //temp solution
			// for inspect drawer
			visibleInspect: false,
			disabledInspect: false,
			inspectDrawerKey: Date.now(),
			queriedEmail: {},
			accountBound: {},
		};
	}
	
	componentDidMount() {
		this.listProfiles();
	}

	// customised menu for bind, process, process history
	getMenu = record => (
		<Menu >
			<Menu.Item 
				key='1' 
				style={{ color:'#5a9ef8' }} 
				icon={ <NodeIndexOutlined /> }
				onClick={ this.handleClickBind.bind(null, record) }
			>
				Bind
			</Menu.Item>
			<Menu.Item 
				key='2' 
				style={{ color:'#5a9ef8' }} 
				icon={ <HistoryOutlined /> }
				onClick={ this.handleClickProcess.bind(null, record) }
			>
				Process
			</Menu.Item>
			<Menu.Item 
				key='3' 
				style={{ color:'#5a9ef8' }} 
				icon={ <EditOutlined /> }
				onClick={ this.handleClickEdit.bind(this, record) }
			>
				Edit
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
						onClick={ this.handleClickInspect.bind(this, record) }
						type='link' 
						overlay={ this.getMenu(record) }
					>
						<FileSearchOutlined /> Inspect
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
			width: '10%',
			setFilter: false
		},
	];

	// helpers
	// get email and account related to a specific case
	getRelatedInfo = record => {
		const email = typeof record === "string" ? record : record.email;
		const accountname = typeof record === "string" ? "" : record.accountname;
		const queriedEmail = this.props.dataEmail
			.find( item => item.email === email )
		const accountBound = this.props.dataAccount
			.find( item => item.accountname === accountname )
		return { queriedEmail, accountBound };
	}

	// handlers for actions in TableBody
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
		const email = this.props.emails
			.find( item => item.id === this.props.emailId )?.email;
    this.setState({
      visible: true,
			disabled: false,
			isCreate: true,
			record: {
				case_id,
				email,
			},
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
			tableDrawerKey: Date.now(),
    });
		this.clearRecord();
  };

	handleSubmit = async record => {
		if (this.state.record.id) { // edit the entry
			await this.props.edit(this.state.record.id, record);
		} else { // create an entry
			let response = null;
			response = await this.props.create(record);
			const id = response.entry.id;
			console.log(id);
			const newRecord = this.props.cases.find( item => item.id === id );
			this.handleClickInspect(newRecord);
		}
		
		this.setState({
			visible: false,
			tableDrawerKey: Date.now(),
		});
		this.clear();
	}

	// handers for unban and ban in inspect drawer
	onClickBan = async dataAccount => {
		await this.props.onClickBan( dataAccount.id, dataAccount );
		this.updateInspectDrawer();
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
			processDrawerKey: Date.now(), 
			visibleProcess: false, 
			dataProcess: [],
		});
		this.listSync({'case_id': this.state.record.id});
		this.clear();
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

	handleCloseBind = event => {
		this.setState({
			visibleBind: false, 
			bindDrawerKey: Date.now(), 
		});
		this.clearRecord();
	}

	handleSubmitBind = async record => {
		const bind = 
			{ case_id: this.state.record.id, accountname: record.accountname }
		this.setState({ bind });
		// check if the accountname is valid
		const accountname = record.accountname.trim().toLowerCase();
		const allAccounts = this.props.accounts
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
			await this.props.bind(this.state.record.id, bind);
			this.setState({
				visibleBind: false, 
				bindDrawerKey: Date.now(), 
			});
			this.clear();
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
					{`The account you have entered is bound to a different profile.`}
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

	handleClickConfirmMerge = async (closeNotification, notificationKey) => {
		console.log('merge completed');
		// call merge api
		const id = this.state.record.id;
		const bind = Object.assign({}, this.state.bind);
		await this.props.bind(id, bind)
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
	handleClickCheckboxA = event => this.setState({ change: false });

	handleClickCheckboxB = event => this.setState({ change: true});

	handleCloseMerge = async event => {
		this.setState({
			visibleMerge: false, 
			mergeModalKey: Date.now(), 
		});
		await this.props.refreshPage( this.state.merge.profile_to.profilename );
		this.clear();
	}

	handleSubmitMerge = async () => {
		const change = this.state.change;
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
		await this.updateMergeProfile( id, record );
		this.setState({
			visibleMerge: false, 
			change: false,
			mergeModalKey: Date.now(), 
		});
		await this.props.refreshPage( record.profilename );
		this.clear();
	}

	// helper to clear
	clear = () => {
		this.clearRecord();
		this.updateInspectDrawer();
	}

	// helper to clear record
	clearRecord = () => {
		if (!this.state.visibleInspect) // clear the record
			this.setState({ record: {} });
	}

	// helper to refresh inspect drawer
	updateInspectDrawer = () => {
		if (this.state.visibleInspect) { // update the inspect drawer
			const record = this.props.cases
				.find( item => item.id === this.state.record.id );
			const accountBound = this.props.accounts
				.find( item => item.accountname === record.accountname );
			const queriedEmail = this.props.emails
				.find( item => item.email === record.email );
			this.setState({ record, queriedEmail, accountBound });
		}
	}

	// handler for inspect drawer
	handleClickInspect = record => {
		this.listSync({'case_id': record.id});
		const { queriedEmail, accountBound } = this.getRelatedInfo(record);
		this.setState({ queriedEmail, accountBound, record }, () => 
		this.setState({
			visibleInspect: true, 
			disabledInspect: true,
		}) );
	}

  handleCloseInspect = () => {
    this.setState({
			inspectDrawerKey: Date.now(),
      visibleInspect: false,
			record: {},
    });
  };

	// bind versions of CRUD
	configProcess = {
		service: processService,
		create: "create",
		retrieve: "retrieve",
		list: "list",
		update: "update",
		dataName: "dataProcess",
	};
	create = createSync.bind(this, this.configProcess);
	createSync = async record => {
		// update process table in process drawer
		const response = await this.create(record);
		// update case table
		await this.props.list();
		this.props.updateDataCase();
		// update case info in process drawer
		if (response.code === 200) {
			const newRecord = Object.assign({}, this.state.record);
			newRecord.status = record.process;
			this.setState({ record: newRecord });
		}
	}
	listSync = listSync.bind(this, this.configProcess);
	updateSync = updateSync.bind(this, this.configProcess);

	configAccount = {
		service: accountService,
		list: "listByEmail",
		dataName: "accounts",
	};
	listAccounts = listSync.bind(this, this.configAccount);

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
						tableDrawerKey={ this.state.processDrawerKey } 
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
						accounts={ this.props.accounts } 
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
						change={ this.state.change } 
						onClose={ this.handleCloseMerge }
						record={ this.state.merge }
						onClickA={ this.handleClickCheckboxA }
						onClickB={ this.handleClickCheckboxB }
						onSubmit={ this.handleSubmitMerge }
					>
					</MergeDrawer>
				</div>
				<div>
					<InspectDrawer 
						tableDrawerKey={ this.state.inspectDrawerKey }
						// data props
						dataCase={ this.state.record }
						dataEmail={ this.state.queriedEmail }
						dataAccount={ this.state.accountBound }
						dataProcess={ this.state.dataProcess } 
						allRelatedAccounts={ this.props.dataAccount }
						labels={ this.props.labels }
						// display props
						drawerTitle={ this.props.drawerTitle } 
						formItems={ this.props.formItems }
						visible={ this.state.visibleInspect } 
						disabled={ this.state.disabledInspect } 
						// api props
						onClose={ this.handleCloseInspect }
						onClickBind={ this.handleClickBind }
						onClickProcess={ this.handleClickProcess }
						onClickEdit={ this.handleClickEdit }
						onClickBan={ this.onClickBan }
					/>
				</div>
			</div>
		);
	}
}

export { TableWrapper };
