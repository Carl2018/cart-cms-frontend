import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { TeamOutlined } from '@ant-design/icons';
import { 
	AutoComplete, 
	Input, 
	Spin, 
	Tag, 
	message,
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
			spinning: false,
		};
	}
	
	componentDidMount() {
		this.setState({ spinning: true }, async () => {
			await this.listSync();
			await this.listProfiles();
			this.setState({ spinning: false });
		});
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Account Name',
			dataIndex: 'accountname',
			key: 'accountname',
			sorter: (a, b) => compare(a.accountname, b.accountname),
			sortDirection: ['ascend', 'descend'],
			width: '10%',
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
					case 'a' :
						color = 'red';
						text = 'Apple';
						break;
					case 'g' :
						color = 'green';
						text = 'Google';
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
			width: '10%',
		},
		{
			title: 'Candidate ID',
			dataIndex: 'candidate_id',
			key: 'candidate_id',
			sorter: (a, b) => compare(a.candidate_id, b.candidate_id),
			sortDirection: ['ascend', 'descend'],
			width: '10%',
			setFilter: true
		},
		{
			title: 'Status',
			key: 'status',
			dataIndex: 'status',
			sorter: (a, b) => compare(a.status, b.status),
			sortDirection: ['ascend', 'descend'],
			render: status => {
				let color = 'default';
				let text = 'Unknown';
				switch (status) {
					case 'h' :
						color = 'red';
						text = 'Hard Banned';
						break;
					case 's' :
						color = 'orange';
						text = 'Soft Banned';
						break;
					case 'u' :
						color = 'green';
						text = 'Unbanned';
						break;
					default:
						color = 'default';
						text = 'Unknown';
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
			title: 'Region',
			dataIndex: 'region',
			key: 'region',
			sorter: (a, b) => compare(a.region, b.region),
			sortDirection: ['ascend', 'descend'],
			width: '10%',
			setFilter: true
		},
		{
			title: 'Physical Region',
			dataIndex: 'physical_region',
			key: 'physical_region',
			sorter: (a, b) => compare(a.physical_region, b.physical_region),
			sortDirection: ['ascend', 'descend'],
			width: '10%',
			setFilter: true
		},
		{
			title: 'DB',
			dataIndex: 'db',
			key: 'db',
			sorter: (a, b) => compare(a.db, b.db),
			sortDirection: ['ascend', 'descend'],
			width: '10%',
			render: db => {
				return (
					<span>
						{ db === 'ea' ? "Asia" : "NA" }
					</span>
				);
			},
		},
		{
			title: 'Profile ID',
			dataIndex: 'profilename',
			key: 'profilename',
			sorter: (a, b) => compare(a.profilename, b.profilename),
			sortDirection: ['ascend', 'descend'],
			width: '10%',
			setFilter: true
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Profile ID',
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
					options={ this.state.options }
				>
					<Input
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
			.filter( item => item.trim().toLowerCase()
				.includes(data.trim().toLowerCase()) 
			)
			.map( item => ({ value: item }) );
		this.setState({ options });
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
	banSync = async (id, record) => {
		this.setState({ spinning: true });
		if (record.status !== "u")
			await this.ban(id, record);
		else
			message.info("The ban button has been temporarily disabled");

		this.setState({ spinning: false });
	}

	configProfile = {
		service: profileService,
		list: "list",
		dataName: "profiles",
	};
	listProfiles = listSync.bind(this, this.configProfile);

	// refresh table
	refreshTable = () => {
		this.setState({ spinning: true }, async () => {
			await this.listSync();
			await this.listProfiles();
			this.setState({ spinning: false });
			this.setState({ tableWrapperKey: Date.now() })
		});
	};

	render(){
		return (
			<div className='Account'>
				<Spin spinning={ this.state.spinning }>
					<TableWrapper
						key={ this.state.tableWrapperKey }
						// data props
						data={ this.state.data }
						// display props
						columns={ this.columns }
						formItems={ this.formItems }
						tableHeader={ this.tableHeader }
						drawerTitle='An Account'
						isSmall={ true }
						// api props
						create={ this.createSync }
						edit={ this.updateSync }
						delete={ this.hideSync }
						ban={ this.banSync }
						refreshTable={ this.refreshTable }
					>
					</TableWrapper>
				</Spin>
			</div>
		);
	}
}

export { Account };
