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
	UserAddOutlined,
	UserDeleteOutlined,
} from '@ant-design/icons';

// import shared and child components
import { TableBody } from '_components'
import { TableDropdown } from '_components'
import { TableDrawer } from './TableDrawer'

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
		};
	}
	
	// customised menu for bind, process, process history
	getMenu = record => (
		<Menu >
			<Menu.Item 
				key='1' 
				style={{ color:'#5a9ef8' }} 
				icon={ <FileTextOutlined /> }
				onClick={ this.handleClickView.bind(this, record) }
			>
				View
			</Menu.Item>
			<Menu.Item 
				key='2' 
				style={{ color:'#5a9ef8' }} 
				icon={ <EditOutlined /> }
				onClick={ this.handleClickEdit.bind(this, record) }
			>
				Edit
			</Menu.Item>
		</Menu>
	);
	
	getBanButton(status) {
		if (status !== 'u')
			return (<div><UserAddOutlined /> Unban</div>);
		else
			return (<div><UserDeleteOutlined /> Ban</div>);
		
	}

	// define columns in TableBody
	columns = [
		...this.props.columns,
		{
			title: 'Actions',
			key: 'action',
			render: (text, record) => (
				<Space size='small'>
					<Popconfirm
						title={ record.status !== 'u' ?
							'Are you sure to Unban this account ?'
							: 'Are you sure to Ban this account ?'
						}
						onConfirm={ this.handleClickBan.bind(this, record) }
						onCancel={ () => console.log('cancel') }
						okText='Confirm'
						cancelText='Cancel'
						placement='left'
					>
						<Dropdown.Button 
							type='link' 
							// danger={ record.status !== 'u' ? false : true }
							overlay={ this.getMenu(record) }
							//onClick={ this.handleClickBan.bind(this, record) }
						>
							{ this.getBanButton(record.status) }
						</Dropdown.Button>
					</Popconfirm>
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
			fixed: 'right',
			width: 200,
			setFilter: false
		},
	];

	// handlers for actions in TableBody
	handleClickView = record => {
		this.setState({
			visible: true, 
			disabled: true,
			record,
		});
	}

	handleClickEdit = record => {
		this.setState({
			visible: true, 
			disabled: false,
			record,
		});
	}

	handleClickBan = record => this.props.ban(record.id, record);

	handleClickDelete = record => this.props.delete(record.id);

	handleSelectChange = selectedRowKeys => this.setState({ selectedRowKeys });

	// handlers for actions in TableDropdown
  handleClickAdd = event => {
		const profilename = this.props.profilename;
    this.setState({
      visible: true,
			disabled: false,
			isCreate: true,
			record: { profilename },
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
						scroll={ this.props.scroll }
						showHeader={ this.props.showHeader }
						loading={ this.props.loading }
					/>
				</div>
				<div>
					<TableDrawer 
						tableDrawerKey={ this.state.tableDrawerKey }
						drawerTitle={ this.props.drawerTitle } 
						visible={ this.state.visible } 
						isCreate={ this.state.isCreate } 
						onClose={ this.handleClose }
						record={ this.state.record }
						formItems={ this.props.formItems }
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
