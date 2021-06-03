import React, { Component } from 'react';

// import components from ant design
import { 
	Button, 
	Col, 
	Input, 
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
} from '@ant-design/icons';

// import shared and child components
import { TableBody } from '_components'
import { TableDropdown } from '_components'
import { TableDrawer } from '_components'
import { TablePagination } from '_components'

class TableWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedRowKeys: [], // for selecting rows in TableBody
			tableDrawerKey: Date.now(), // for refreshing the TableDrawer
			visible: false, // for opening or closing the TableDrawer
			isCreate: false,
			record: {}, // for loading a record into the form in TableDrawer
			disabled: false, // for disabling the input fields in TableDrawer
			formItems: this.props.formItems,
		};
	}

	// define formItems in TableDrawer when add is clicked
	formItems = [
		...this.props.formItems,
		{
			label: 'Email',
			name: 'email',
			rules: [
				{
					required: true,
					message: 'email cannot be empty',
				}
			],
			editable: true,
			input: disabled => 
			(
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
					placeholder={ "Email must be unique" }
				/>
			)
		},
	]
	
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
			width: '25%',
			setFilter: false
		},
	];

	// handlers for actions in TableBody
	handleClickView = record => {
		this.setState({formItems: this.props.formItems}, () =>
			this.setState({
				visible: true, 
				disabled: true,
				record: {...record, profile_id: record.id},
			})
		);
	}

	handleClickEdit = record => {
		this.setState({formItems: this.props.formItems,}, () =>
			this.setState({
				visible: true, 
				disabled: false,
				record: {...record, profile_id: record.id},
			})
		);
	}

	handleClickDelete = record => this.props.delete(record.id);

	handleSelectChange = selectedRowKeys => this.setState({ selectedRowKeys });

	// handlers for actions in TableDropdown
  handleClickAdd = async event => {
		const response = await this.props.retrieveNextId()
		const profile_id = response?.entry?.AUTO_INCREMENT;
		this.setState({formItems: this.formItems}, () =>
			this.setState({
				visible: true,
				disabled: false,
				isCreate: true,
				record: {profile_id},
			})
		);
  }

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

		console.log(record);
		if (this.state.record.id) // edit the entry
			this.props.edit(this.state.record.id, record);
		else // create an entry
			this.props.create(record);

		this.setState({
			record: {},
			visible: false,
			isCreate: false,
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
						size={ this.props.size }
						showHeader={ this.props.showHeader }
						loading={ this.props.loading }
						pagination={ this.props.pagination }
					/>
				</div>
				<div style={ {textAlign: 'right'} }>
					{ this.props.pagination === false ? 
						<TablePagination 
							rowCount={ this.props.rowCount }
							defaultPageSize={ this.props.defaultPageSize }
							defaultPage={ this.props.defaultPage }
							list={ this.props.list }
							size={ this.props.size }
						/> 
						: <></> 
					}
				</div>
				<div>
					<TableDrawer 
						tableDrawerKey={ this.state.tableDrawerKey }
						drawerTitle={ this.props.drawerTitle } 
						visible={ this.state.visible } 
						isCreate={ this.state.isCreate } 
						onClose={ this.handleClose }
						record={ this.state.record }
						formItems={ this.state.formItems }
						disabled={ this.state.disabled } 
						onSubmit={ this.handleSubmit }
						drawerWidth={ this.props.drawerWidth }
						formLayout={ this.props.formLayout }
					/>
				</div>
			</div>
		);
	}
}

export { TableWrapper };
