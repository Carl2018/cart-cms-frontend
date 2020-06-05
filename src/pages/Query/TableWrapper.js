import React, { Component } from 'react';

// import styling from ant desgin
import { Space, Button, Popconfirm, Row, Col } from 'antd';
import { notification } from 'antd';
import { FileTextOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

// import shared components
import TableBody from '../../_components/TableBody'
import TableDropdown from '../../_components/TableDropdown'
import TableDrawer from './TableDrawer'
import { cancel, refresh } from '../../_components/Message'

class TableWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedRowKeys: [], // for selecting rows in TableBody
			tableDrawerKey: Date.now(), // for refreshing the TableDrawer
			visible: false, // for opening or closing the TableDrawer
			record: {}, // for loading a record into the form in TableDrawer
			disabled: false, // for disabling the input fields in TableDrawer
			//related info
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
						icon={ <FileTextOutlined /> }
						onClick={ this.handleClickView.bind(this, record) }
					>
						View
					</Button>
					<Button 
						type='link' 
						icon={ <EditOutlined /> }
						onClick={ this.handleClickEdit.bind(this, record) }
					>
						Edit
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

	// pass down related email and account
	getRelatedInfo = data => {
		const email = typeof data === "string" ? data : data.relatedEmail;
		const account = typeof data === "string" ? "" : data.relatedAccount;
		const relatedEmail = this.props.dataEmail.find( item => item.email === email )
		const relatedAccount = this.props.dataAccount.find( item => item.accountName === account )
		console.log(relatedEmail);
		console.log(relatedAccount);
		return { relatedEmail, relatedAccount };
	}

	// handlers for actions in TableBody
	handleClickView = record => {
		const { relatedEmail, relatedAccount } = this.getRelatedInfo(record);
		this.setState({ relatedEmail, relatedAccount, record }, () => 
		this.setState({
			visible: true, 
			disabled: true,
		}) );
	}

	handleClickEdit = record => {
		const { relatedEmail, relatedAccount } = this.getRelatedInfo(record);
		this.setState({ relatedEmail, relatedAccount, record }, () => 
		this.setState({
			visible: true, 
			disabled: false,
		}) );
	}

	handleClickDelete = record => this.props.delete(record.key);

	handleSelectChange = selectedRowKeys => this.setState({ selectedRowKeys });

	// handlers for actions in TableDropdown
  handleClickAdd = event => {
		console.log(this.props.email);
		const { relatedEmail, relatedAccount } = this.getRelatedInfo(this.props.email);
		this.setState({ relatedEmail, relatedAccount }, () => 
    this.setState({
      visible: true,
			disabled: false,
			record: {},
    }) );
  };

	handleClickRefreshTable = () => {
		this.props.refreshTable();
		refresh('table_refresh');
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
			onClose: () => cancel('batch_delete_cancel'),
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
			record: {},
			tableDrawerKey: Date.now(),
    });
  };

	handleSubmit = record => {

		if (this.state.record.key) // edit the entry
			this.props.edit(this.state.record.key, record);
		else // create an entry
			this.props.create(record);

		this.setState({
			record: {},
			visible: false,
			tableDrawerKey: Date.now(),
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
					<Col 
						style={{ 
							fontSize: this.props.isSmall ? 
							'20px' : '24px', textAlign: 'right' 
						}}
						span={ 12 } 
					>
						<TableDropdown 
							onClickAdd={ this.handleClickAdd }
							onClickRefreshTable={ this.handleClickRefreshTable }
							onClickBatchDelete={ this.handleClickBatchDelete }
						/>
					</Col>
				</Row>
				<div>
					<TableBody 
						data={ this.props.data } 
						columns={ this.columns } 
						selectedRowKeys={ this.state.selectedRowKeys }
						onSelectChange={ this.handleSelectChange }
						isSmall={ this.props.isSmall }
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
						onSubmit={ this.handleSubmit }
						dataEmail={ this.state.relatedEmail }
						dataCase={ this.state.record }
						dataAccount={ this.state.relatedAccount }
					/>
				</div>
			</div>
		);
	}
}

export default TableWrapper;
