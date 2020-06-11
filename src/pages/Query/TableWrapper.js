import React, { Component } from 'react';

// import styling from ant desgin
import { 
	Space, Button, Popconfirm, Row, Col, Input, Drawer, Form, Divider,
} from 'antd';
import { notification } from 'antd';
import { FileSearchOutlined, DeleteOutlined } from '@ant-design/icons';

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
			// for create drawer
			visibleCreate: false,
			formKeyCreate: Date.now(),
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
						onClick={ this.handleClickView.bind(this, record) }
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
      visibleCreate: true,
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
		if (this.state.record.key) { // edit the entry
			console.log(this.state.record.key);
			this.props.edit(this.state.record.key, record);
		} else { // create an entry
			record.relatedEmail = this.state.relatedEmail?.email;
			this.props.create(record);
			this.setState({
				visibleCreate: false, 
				formKeyCreate: Date.now(),
				record: {},
			});
			
		}

	}

	// define form items for create Drawer
	formItemsCreate = [
		{
			label: 'Case Name',
			name: 'casename',
			rules: [
				{
					required: true,
					message: 'casename cannot be empty',
				}
			],
			editable: true,
			input: (
				<Input
					maxLength={255}
					allowClear
				/>
			)
		},
		{
			label: 'Remarks',
			name: 'remarks',
			rules: [
				{
					required: true,
					message: 'remarks cannot be empty',
				},
			],
			editable: true,
			input: (
				<Input.TextArea
					autoSize={{ minRows: 6, maxRows: 10 }}
					maxLength={255}
					allowClear
				/>
			)
		},			
	];

	handleCloseCreate = event => {
		console.log(event);
		this.setState({
			visibleCreate: false, 
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
						onSubmit={ this.handleSubmit }
						dataEmail={ this.state.relatedEmail }
						dataCase={ this.state.record }
						dataAccount={ this.state.relatedAccount }
						allRelatedAccounts={ this.props.dataAccount }
					/>
				</div>
				<div>
					<Drawer
						title="Create A Case"
						width={ 618 }
						bodyStyle={{ paddingBottom: 80 }}
						visible={ this.state.visibleCreate } 
						onClose={ this.handleCloseCreate }
					>
						<Form
							key={ this.state.formKeyCreate }
							labelCol={ { span: 8 } }
							wrapperCol={ { span: 16 } }
							name='basic'
							initialValues={{
								remember: true,
							}}
							onFinish={ this.handleSubmit }
							onFinishFailed={ this.onFinishFailedCreate }
						>
							{ this.formItemsCreate.map( item => 
								(
									<Form.Item
										key={ item.name }
										label={ item.label }
										name={ item.name }
										rules={ item.rules }
									>
										{ item.input }
									</Form.Item>
								)
							) }
							<Divider />
							<div style={{ textAlign:'right' }} >
								<Button 
									onClick={ this.handleCloseCreate } 
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
						</Form>
					</Drawer>
				</div>
			</div>
		);
	}
}

export default TableWrapper;
