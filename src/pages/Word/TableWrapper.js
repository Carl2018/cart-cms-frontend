import React, { Component } from 'react';

// import styling from ant desgin
import { 
	Button, 
	Col, 
	Row, 
	Select, 
	Space, 
	message, 
} from 'antd';
import { EditOutlined } from '@ant-design/icons';

// import shared components
import { TableBody } from '_components'
import { TableDropdown } from './TableDropdown'
import { TableDrawer } from '_components'

const { Option } = Select; 

class TableWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableDrawerKey: Date.now(), // for refreshing the TableDrawer
			visible: false, // for opening or closing the TableDrawer
			record: {}, // for loading a record into the form in TableDrawer
			disabled: false, // for disabling the input fields in TableDrawer
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
						icon={ <EditOutlined /> }
						onClick={ this.handleClickEdit.bind(this, record) }
					>
						Edit
					</Button>
				</Space>
			),
			width: 200,
			setFilter: false
		},
	];

	// handler for actions in TableBody
	handleClickEdit = record => {
		this.setState({
			visible: true, 
			disabled: false,
			record,
		});
	}

	// handlers for actions in TableDropdown
  handleClickAdd = event => {
    this.setState({
      visible: true,
			disabled: false,
			record: {region: 1, is_active: 1, in_word: 1},
    });
  };

	handleClickRefreshTable = () => {
		this.props.refreshTable();
		message.info('the table has been refreshed');
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
		record = {...record, db: this.props.db};
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
									Database:
								</span>
								<Select
									defaultValue="ea"
									onChange={ this.props.onChangeDb }
									style={{ marginRight: "16px", width: 150 }}
								>
									<Option value="ea">East Asia</Option>
									<Option value="na">North America</Option>
								</Select>
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
							dropdownName={ this.props.dropdownName }
							onClickAdd={ this.handleClickAdd }
							onClickRefreshTable={ this.handleClickRefreshTable }
						/>
					</Col>
				</Row>
				<div>
					<TableBody 
						data={ this.props.data } 
						columns={ this.columns } 
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
