import React, { Component } from 'react';

// import components from ant design
import { 
	Button, 
	Col, 
	Popconfirm, 
	Row, 
	Space, 
	message,
	notification,
} from 'antd';
import { 
	DeleteOutlined, 
	FileSearchOutlined, 
} from '@ant-design/icons';

// import shared and child components
import TableBody from '../../_components/TableBody'
import TableDropdown from '../../_components/TableDropdown'
import TableDrawer from '../../_components/TableDrawer'
import InspectDrawer from './InspectDrawer'

// destructure child components

class TableWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for TableBody
			selectedRowKeys: [], 
			// for create drawer
			visibleCreate: false,
			createDrawerKey: Date.now(),
			// for inspect drawer
			inspectDrawerKey: Date.now(), 
			visible: false, 
			record: {}, 
			disabled: false, 
			relatedEmail: {},
			relatedAccount: {},
		};
	}
	
	// define columns in TableBody
	columns = [
		...this.props.columns,
		{
			title: 'Actions',
			key: 'action',
			render: (text, record) => (
				<Space size='small'>
					<Button 
						type='link' 
						icon={ <FileSearchOutlined /> }
						onClick={ this.handleClickInspect.bind(this, record) }
					>
						Inspect
					</Button>
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

	// handler for row selections
	handleSelectChange = selectedRowKeys => this.setState({ selectedRowKeys });

	// handlers for actions in TableDropdown
	// handler for add
  handleClickAdd = event => {
		const { relatedEmail, relatedAccount } = this.getRelatedInfo(this.props.email);
		this.setState({ relatedEmail, relatedAccount }, () => 
    this.setState({
      visibleCreate: true,
			record: {},
    }) );
  };

	// get email and account related to a specific case
	getRelatedInfo = record => {
		const email = typeof record === "string" ? record : record.relatedEmail;
		const account = typeof record === "string" ? "" : record.relatedAccount;
		const relatedEmail = this.props.dataEmail
			.find( item => item.email === email )
		const relatedAccount = this.props.dataAccount
			.find( item => item.accountName === account )
		return { relatedEmail, relatedAccount };
	}

	// handler for refresh table
	handleClickRefreshTable = () => {
		this.props.refreshTable();
		message.info('the table has been refreshed');
	}

	// handler for batch delete
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

	// handler for batch delete confirmation
  handleClickConfirm = (closeNotification, notificationKey) => {
		this.props.delete(this.state.selectedRowKeys);
		closeNotification(notificationKey);
  };

	// handlers for actions in TableBody
	// handler for inspect
	handleClickInspect = record => {
		const { relatedEmail, relatedAccount } = this.getRelatedInfo(record);
		this.setState({ relatedEmail, relatedAccount, record }, () => 
		this.setState({
			visible: true, 
			disabled: true,
		}) );
	}

	// handler for delete
	handleClickDelete = record => this.props.delete(record.key);

	// handlers for actions in create drawer
	// handler for closing create drawer
	handleCloseCreate = event => {
		this.setState({
			visibleCreate: false, 
		});
	}

	// handler for create 
	handleSubmitCreate = record => {
		record.relatedEmail = this.state.relatedEmail?.email;
		this.props.create(record);
		this.setState({
			visibleCreate: false, 
			createDrawerKey: Date.now(),
			record: {},
		});
	}

	// handlers for actions in inspect drawer
	// handler for closing inspect drawer
  handleClose = () => {
    this.setState({
      visible: false,
			record: {},
			inspectDrawerKey: Date.now(),
    });
  };

	// handler for edit and bind actions
	handleSubmitEdit = record => {
		this.props.edit(this.state.record.key, record);
		// update the related info
		const { relatedEmail, relatedAccount } = this.getRelatedInfo(record);
		this.setState({ relatedEmail, relatedAccount });
	}

	// handler for click ban
	onClickBan = record => 
		this.props.onClickBan(this.state.record.relatedAccount);

	// handler for click unban
	onClickUnban = record => 
		this.props.onClickUnban(this.state.record.relatedAccount);

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
						{ !this.props.showDropdown ? (<></>) : (<>
								<TableDropdown 
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
						// data props
						data={ this.props.data } 
						selectedRowKeys={ this.state.selectedRowKeys }
						// display props
						loading={ this.props.loading }
						columns={ this.columns } 
						isSmall={ this.props.isSmall }
						showHeader={ this.props.showHeader }
						// api props
						onSelectChange={ this.handleSelectChange }
					/>
				</div>
				<div>
					<InspectDrawer 
						tableDrawerKey={ this.state.inspectDrawerKey }
						// data props
						dataCase={ this.state.record }
						dataEmail={ this.state.relatedEmail }
						dataAccount={ this.state.relatedAccount }
						allRelatedAccounts={ this.props.dataAccount }
						// display props
						drawerTitle={ this.props.drawerTitle } 
						visible={ this.state.visible } 
						formItems={ this.props.formItems }
						disabled={ this.state.disabled } 
						// api props
						onClose={ this.handleClose }
						onSubmit={ this.handleSubmitEdit }
						onClickBan={ this.onClickBan }
						onClickUnban={ this.onClickUnban }
					/>
				</div>
				<div>
					<TableDrawer 
						tableDrawerKey={ this.state.createDrawerKey }
						// data props
						record={ this.state.record }
						// display props
						visible={ this.state.visibleCreate } 
						drawerTitle={ this.props.drawerTitle } 
						formItems={ this.props.formItems }
						drawerWidth={ 618 }
						//disabled={ this.state.disabled } 
						//formLayout={ this.props.formLayout }
						// api props
						onClose={ this.handleCloseCreate }
						onSubmit={ this.handleSubmitCreate }
					/>
				</div>
			</div>
		);
	}
}

export default TableWrapper;
					// data props
					// display props
					// api props
