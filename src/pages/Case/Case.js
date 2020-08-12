import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { FileSearchOutlined } from '@ant-design/icons';
import { 
	AutoComplete, 
	Input, 
	Select, 
	Spin,
	Tag, 
} from 'antd';

// import shared and child components
import { TableWrapper } from './TableWrapper'

// import services
import { 
	caseService,
	categoryService,
	emailService,
 } from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { createSync, retrieveSync, listSync, updateSync, hideSync } = backend;
const { compare } = helpers;
const { Option } = Select

class Case extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
			// for category selections
			categories: [],
			// options for profile search
			emails: [],
			options: [],
			spinning: false,
		};
	}
	
	componentDidMount() {
		this.setState({ spinning: true }, async () => {
			await this.listSync();
			await this.listCategories();
			await this.listEmails();
			this.setState({ spinning: false });
		});
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Case ID',
			dataIndex: 'id',
			key: 'id',
			sorter: (a, b) => compare(a.id, b.id),
			sortDirection: ['ascend', 'descend'],
			width: 120,
			setFilter: true
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			sorter: (a, b) => compare(a.status, b.status),
			sortDirection: ['ascend', 'descend'],
			width: 80,
			//setFilter: true
			render: status => {
				let color = 'geekblue';
				let text = 'Open';
				switch (status) {
					case 'o' :
						color = 'geekblue';
						text = 'Open';
						break;
					case 'q' :
						color = 'purple';
						text = 'Queried';
						break;
					case 'r' :
						color = 'cyan';
						text = 'Replied';
						break;
					case 'a' :
						color = 'green';
						text = 'Approved';
						break;
					case 'e' :
						color = 'red';
						text = 'Rejected';
						break;
					case 'd' :
						color = 'default';
						text = 'Deferred';
						break;
					default:
						color = 'geekblue';
						text = 'Open';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ text }
					</Tag>
				);
			},
		},
		{
			title: 'Category',
			dataIndex: 'categoryname',
			key: 'categoryname',
			sorter: (a, b) => compare(a.categoryname, b.categoryname),
			sortDirection: ['ascend', 'descend'],
			ellipsis: true,
			width: 160,
			setFilter: true
		},
		{
			title: 'Inquirer Email',
			dataIndex: 'email',
			key: 'email',
			sorter: (a, b) => compare(a.email, b.email),
			sortDirection: ['ascend', 'descend'],
			ellipsis: true,
			width: 200,
			setFilter: true
		},
		{
			title: 'Account Bound',
			dataIndex: 'accountname',
			key: 'accountname',
			sorter: (a, b) => compare(a.accountname, b.accountname),
			sortDirection: ['ascend', 'descend'],
			ellipsis: true,
			width: 200,
			setFilter: true
		},
		{
			title: 'Last Touch',
			dataIndex: 'last_processed_by',
			key: 'last_processed_by',
			sorter: (a, b) => compare(a.last_processed_by, b.last_processed_by),
			sortDirection: ['ascend', 'descend'],
			ellipsis: true,
			width: 120,
			setFilter: true
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Category',
			name: 'categoryname',
			rules: [
				{
					required: false,
					message: 'Category cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Select
					disabled={ disabled }
					placeholder={ "Category" }
					showSearch
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children.trim().toLowerCase()
							.indexOf(input.trim().toLowerCase()) >= 0
					}
				>
					{
						this.state.categories.map( item => (
							<Option
								key={ item.id }
								value={ item.categoryname }
							>
								{ item.categoryname }
							</Option>
						))
					}
				</Select>
			)
		},
		{
			label: 'Case ID',
			name: 'case_id',
			rules: [
				{
					required: true,
					message: 'case_id cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled
					placeholder={ "Case ID" }
				/>
			)
		},
		{
			label: 'Remarks',
			name: 'remarks',
			rules: [
				{
					required: false,
					message: 'remarks can be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Input.TextArea
					autoSize={{ minRows: 2, maxRows: 8 }}
					maxLength={255}
					allowClear
					disabled={ disabled }
					placeholder={ disabled ? "" : "Remarks" }
				/>
			)
		},			
		{
			label: 'Status',
			name: 'status',
			rules: [
				{
					required: true,
					message: 'status cannot be empty',
				}
			],
			editable: false,
			input: disabled => (
				<Select
					disabled={ disabled }
				>
					<Option value="o">Open</Option>
					<Option value="q">Queried</Option>
					<Option value="r">Replied</Option>
					<Option value="a">Approved</Option>
					<Option value="e">Rejected</Option>
					<Option value="d">Deferred</Option>
				</Select>
			)
		},
		{
			label: 'Inquirer Email',
			name: 'email',
			rules: [
				{
					required: true,
					message: 'Queried email cannot be empty',
				}
			],
			editable: true,
			input: (disabled, record) => 
			record.email ?
			(
				<span style={{ marginLeft: "15px" }}>
					{ record.email }
				</span>
			) : 
			(
				<AutoComplete
					onChange={ this.handleChange }
					options={ this.state.options }
				>
					<Input
						placeholder="Search an exiting email"
						size="middle"
						allowClear
					/>
				</AutoComplete>
			)
		},
	];

	// define table header
	tableHeader = this.props.tableHeader ? this.props.tableHeader : 
	(
		<>
			<FileSearchOutlined />
			<strong>Cases</strong>
		</>
	)

	// filter AutoComplete options when input field changes
	handleChange = data => {
		const options = this.state.emails
			.map( item => item.email )
			.filter( (item, index, array) => array.indexOf(item) === index )
			.filter( item => item.trim().toLowerCase()
				.includes(data.trim().toLowerCase()) 
			)
			.map( item => ({ value: item }) );
		this.setState({ options });
	}

	// bind versions of CRUD
	config = {
		service: caseService,
		create: "create",
		retrieve: "retrieve",
		list: "list",
		update: "update",
		hide: "hide",
		dataName: "data",
	};
	createSync = createSync.bind(this, this.config);
	retrieveNextId = retrieveSync.bind(this, {
		...this.config,
		retrieve: "retrieveNextId",
	});
	listSync = listSync.bind(this, this.config);
	updateSync = updateSync.bind(this, this.config);
	hideSync = hideSync.bind(this, this.config);
	bindSync = updateSync.bind(this, {...this.config, update: "bind"});
	unbindSync = updateSync.bind(this, {...this.config, update: "unbind"});

	configCategory = {
		service: categoryService,
		list: "list",
		dataName: "categories",
	};
	listCategories = listSync.bind(this, this.configCategory);

	configEmail= {
		service: emailService,
		list: "list",
		dataName: "emails",
	};
	listEmails = listSync.bind(this, this.configEmail);

	// refresh table
	refreshTable = () => {
		this.setState({ spinning: true }, async () => {
			await this.listSync();
			await this.listCategories();
			await this.listEmails();
			this.setState({ spinning: false });
			this.setState({ tableWrapperKey: Date.now() })
		});
	};

	render(){
		return (
			<div className='Case'>
				<Spin spinning={ this.state.spinning }>
					<TableWrapper
						key={ this.state.tableWrapperKey }
						// data props
						data={ this.state.data }
						// display props
						columns={ this.columns }
						formItems={ this.formItems }
						tableHeader={ this.tableHeader }
						drawerTitle='A Case'
						// api props
						create={ this.createSync }
						retrieveNextId={ this.retrieveNextId }
						list={ this.listSync }
						edit={ this.updateSync }
						bind={ this.bindSync }
						unbind={ this.unbindSync }
						delete={ this.hideSync }
						refreshTable={ this.refreshTable }
					>
					</TableWrapper>
				</Spin>
			</div>
		);
	}
}

export { Case };
