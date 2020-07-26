import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { MailOutlined } from '@ant-design/icons';
import { 
	AutoComplete, 
	Input, 
	Tag, 
} from 'antd';

// import shared and child components
import { TableWrapper } from './TableWrapper'

// import services
import { 
	emailService,
	labelService,
	profileService,
} from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { create, list, listCombined, update, hide } = backend;
const { compare } = helpers;
const { Search } = Input;

class Email extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
			labels: [],
			// options for profile search
			profiles: [],
			options: [],
		};
	}

	componentDidMount() {
		this.list();
		this.listLabels();
		this.listProfiles();
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			sorter: (a, b) => compare(a.email, b.email),
			sortDirection: ['ascend', 'descend'],
			width: '10%',
			setFilter: true
		},
		{
			title: 'Profile Name',
			dataIndex: 'profilename',
			key: 'profilename',
			sorter: (a, b) => compare(a.profilename, b.profilename),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: true
		},
		{
			title: 'Profile Description',
			dataIndex: 'description',
			key: 'description',
			sorter: (a, b) => compare(a.description, b.description),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: true
		},
		{
			title: 'Label',
			key: 'labelname',
			dataIndex: 'labelname',
			sorter: (a, b) => compare(a.labelname, b.labelname),
			sortDirection: ['ascend', 'descend'],
			render: labelname => {
				const labels = this.state.labels.slice();
				const elements = labelname === undefined 
					|| labelname[0] === null 
					|| labels.length === 0 
					? <></> : 
					labelname.map( (item, index) => {
						const label_color = labels
							.find( label => label.labelname === item ).label_color;
						let color = 'default';
						switch (label_color) {
							case 'l' :
								color = 'success';
								break;
							case 'b' :
								color = 'processing';
								break;
							case 'r' :
								color = 'error';
								break;
							case 'y' :
								color = 'warning';
								break;
							case 'g' :
								color = 'default';
								break;
							default :
								color = 'default';
								break;
						};	
						return (
							<Tag color={ color } key={ uuidv4() }>
								{ item }
							</Tag>
						);
					});
				return elements;
			},
			width: '20%',
		},
	];

	// define form items for TableDrawer
	formItems = [
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
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
					placeholder={ "Email must be unique" }
				/>
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
			<MailOutlined />
			<strong>Known Emails</strong>
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
	create = create.bind(this, emailService, 'data');
	createSync = record => this.create(record).then( res => this.list() );
	list = listCombined.bind(this, emailService, 'data', ['labelname', 'label_color']);
	update = update.bind(this, emailService, 'data');
	updateSync = (id, record) => this.update(id, record).then( res => this.list() );
	hide = hide.bind(this, emailService, 'data');
	listLabels = list.bind(this, labelService, 'labels');
	listProfiles = list.bind(this, profileService, 'profiles');

	// refresh table
	refreshTable = () => {
		this.list();
		this.listLabels();
		this.listProfiles();
		this.setState({ tableWrapperKey: Date.now() })
	};

	render(){
		return (
			<div className='Email'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					data={ this.state.data }
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					dropdownName='Create Profile'
					drawerTitle='An Email'
					create={ this.createSync }
					edit={ this.updateSync }
					delete={ this.hide }
					refreshTable={ this.refreshTable }
					isSmall={ this.props.isSmall }
					labels={ this.state.labels }
				>
				</TableWrapper>
			</div>
		);
	}
}

export { Email };
