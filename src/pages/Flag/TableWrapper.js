import React, { Component } from 'react';

// import styling from ant desgin
import { 
	Button, 
	Col, 
	Dropdown, 
	InputNumber, 
	Menu, 
	Popconfirm, 
	Row, 
	Select, 
	Space, 
} from 'antd';
import { 
	ExceptionOutlined,
	EyeInvisibleOutlined, 
	FlagOutlined, 
	SearchOutlined, 
	UserDeleteOutlined, 
} from '@ant-design/icons';

// import shared components
import { TableBody } from '_components'
import { TableDrawer } from '_components'

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
		};
	}
	
	// customised menu for bind, process, process history
	getMenu = record => (
		<Menu >
			<Menu.Item 
				key='1' 
				style={{ color:'#5a9ef8' }} 
				icon={ <ExceptionOutlined /> }
				onClick={ this.handleClickBlacklist.bind(this, record) }
			>
				Blacklist
			</Menu.Item>
			<Menu.Item 
				key='2' 
				style={{ color:'#5a9ef8' }} 
				icon={ <FlagOutlined /> }
				onClick={ this.props.onClickFlag.bind(this, record) }
			>
				Flags
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
						title='Are you sure to soft ban this candidate?'
						onConfirm={ this.props.softBanSync.bind(this, record) }
						onCancel={ () => console.log('cancel') }
						okText='Confirm'
						cancelText='Cancel'
						placement='left'
					>
						<Button
							type='link'
							style={{ color:'#5a9ef8' }} 
							icon={ <EyeInvisibleOutlined /> }
						>
							Soft Ban
						</Button>
					</Popconfirm>
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
			width: 300,
			setFilter: false
		},
	];

	// handlers for actions in TableBody
	handleClickBlacklist = record => {
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
							<Space size="large">
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
									style={{ width: 100 }}
									min={ 1 }
								/>
								<span style={{ fontSize: "16px", marginLeft: "8px" }} >
									Interval(hours):
								</span>
								<InputNumber
									placeholder="Interval in Hours"
									onChange={ this.props.onChangeInterval }
									value={ this.props.interval }
									style={{ width: 100 }}
									min={ 1 }
								/>
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
						isSmall={ this.props.isSmall }
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
			</div>
		);
	}
}

export { TableWrapper };