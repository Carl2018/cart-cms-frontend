import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { TeamOutlined } from '@ant-design/icons';
import { 
	AutoComplete, 
	Input, 
	Select, 
	Tag, 
} from 'antd';

// import shared and child components
import { TableWrapper } from './TableWrapper';

// import services
import { 
	accountService, 
	profileService, 
} from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { createSync, listSync, updateSync, hideSync } = backend;
const { compare } = helpers;
const { Search } = Input;
const { Option } = Select;

class Account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
			// options for profile search
			profiles: [],
			options: [],
		};
	}
	
	componentDidMount() {
		this.listSync();
		this.listProfiles();
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Account Name',
			dataIndex: 'accountname',
			key: 'accountname',
			sorter: (a, b) => compare(a.accountname, b.accountname),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: true
		},
		{
			title: 'Account Type',
			key: 'account_type',
			dataIndex: 'account_type',
			sorter: (a, b) => compare(a.account_type, b.account_type),
			sortDirection: ['ascend', 'descend'],
			render: account_type => {
				let color = 'gold';
				let text = 'Phone';
				switch (account_type) {
					case 'f' :
						color = 'blue';
						text = 'Facebook';
						break;
					case 'p' :
						color = 'gold';
						text = 'Phone';
						break;
					default:
						color = 'gold';
						text = 'Phone';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ text }
					</Tag>
				);
			},
			width: '20%',
		},
		{
			title: 'Candidate ID',
			dataIndex: 'candidate_id',
			key: 'candidate_id',
			sorter: (a, b) => compare(a.candidate_id, b.candidate_id),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: true
		},
		{
			title: 'Status',
			key: 'status',
			dataIndex: 'status',
			sorter: (a, b) => compare(a.status, b.status),
			sortDirection: ['ascend', 'descend'],
			render: status => {
				let color = 'green';
				let text = 'Unbanned';
				switch (status) {
					case 'b' :
						color = 'red';
						text = 'Banned';
						break;
					case 'u' :
						color = 'green';
						text = 'Unbanned';
						break;
					default:
						color = 'green';
						text = 'Unbanned';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ text }
					</Tag>
				);
			},
			width: '10%',
		},
		{
			title: 'Profile',
			dataIndex: 'profilename',
			key: 'profilename',
			sorter: (a, b) => compare(a.profilename, b.profilename),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: true
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Account Name',
			name: 'accountname',
			rules: [
				{
					required: true,
					message: 'accountname cannot be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
					placeholder={ "Account name must be unique" }
				/>
			)
		},			
		{
			label: 'Account Type',
			name: 'account_type',
			rules: [
				{
					required: true,
					message: 'account_type cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Select
					disabled={ disabled }
					placeholder={ "Account type" }
				>
					<Option value="f">facebook</Option>
					<Option value="p">phone</Option>
				</Select>
			)
		},
		{
			label: 'Candidate ID',
			name: 'candidate_id',
			rules: [
				{
					required: true,
					message: 'candidate_id cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
					placeholder={ "Candidate ID must be unique" }
				/>
			)
		},
		{
			label: 'Status',
			name: 'status',
			rules: [
				{
					required: true,
					message: 'Status cannot be empty',
				},
			],
			editable: false,
			input: disabled => (
				<Select
					disabled={ disabled }
				>
					<Option value="u">Unbanned</Option>
					<Option value="b">Banned</Option>
				</Select>
			)
		},			
		{
			label: 'Profile',
			name: 'profilename',
			rules: [
				{
					required: true,
					message: 'Profile cannot be empty',
				}
			],
			editable: true,
			input: (disabled, record) => 
			record.profilename ?
			(
				<span style={{ marginLeft: "15px" }}>
					{ record.profilename }
				</span>
			) : 
			(
				<AutoComplete
					onChange={ this.handleChange }
					onSelect={ this.handleSearch }
					options={ this.state.options }
				>
					<Search
						onSearch={ this.handleSearch }
						placeholder="Search an existing profile"
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
			<TeamOutlined />
			<strong>Accounts</strong>
		</>
	)

	// filter AutoComplete options when input field changes
	handleChange = data => {
		const options = this.state.profiles
			.map( item => item.profilename )
			.filter( (item, index, array) => array.indexOf(item) === index )
			.filter( item => item.includes(data) )
			.map( item => ({ value: item }) );
		this.setState({ options });
	}

	// perform a search when the search button is pressed
	handleSearch = data => {
		console.log("search");
	}

	// bind versions of CRUD
	config = {
		service: accountService,
		create: "create",
		retrieve: "retrieve",
		list: "list",
		update: "update",
		hide: "hide",
		dataName: "data",
	};
	createSync = createSync.bind(this, this.config);
	listSync = listSync.bind(this, this.config);
	updateSync = updateSync.bind(this, this.config);
	hideSync = hideSync.bind(this, this.config);
	ban = updateSync.bind(this, {...this.config, update: "ban"});

	configProfile = {
		service: profileService,
		list: "list",
		dataName: "profiles",
	};
	listProfiles = listSync.bind(this, this.configProfile);

	// refresh table
	refreshTable = () => {
		this.listSync();
		this.listProfiles();
		this.setState({ tableWrapperKey: Date.now() })
	};

	render(){
		return (
			<div className='Account'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					// data props
					data={ this.state.data }
					// display props
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					drawerTitle='An Account'
					isSmall={ this.props.isSmall }
					// api props
					create={ this.createSync }
					edit={ this.updateSync }
					delete={ this.hideSync }
					ban={ this.ban }
					refreshTable={ this.refreshTable }
				>
				</TableWrapper>
			</div>
		);
	}
}

export { Account };
