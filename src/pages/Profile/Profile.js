import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	Input,
	Select, 
	Tag, 
} from 'antd';
import { ContactsOutlined } from '@ant-design/icons';

// import shared and child components
import { TableWrapper } from './TableWrapper'

// import services
import { 
	labelService,
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
const { Option } = Select

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
			labels: [],
		};
	}
	
	componentDidMount() {
		this.listSync();
		this.listLabels();
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Profile Name',
			dataIndex: 'profilename',
			key: 'profilename',
			sorter: (a, b) => compare(a.profilename, b.profilename),
			sortDirection: ['ascend', 'descend'],
			width: '30%',
			setFilter: true
		},
		{
			title: 'Profile Description',
			dataIndex: 'description',
			key: 'description',
			sorter: (a, b) => compare(a.description, b.description),
			sortDirection: ['ascend', 'descend'],
			width: '30%',
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
			label: 'Profile Name',
			name: 'profilename',
			rules: [
				{
					required: true,
					message: 'Profile name cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
					placeholder={ "Profile name must be unique" }
				/>
			)
		},
		{
			label: 'Profile Description',
			name: 'description',
			rules: [
				{
					required: true,
					message: 'Profile description cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
					placeholder={ "Profile description" }
				/>
			)
		},
		{
			label: 'Labels',
			name: 'labelname',
			rules: [
				{
					required: false,
					message: 'Labels cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Select
					disabled={ disabled }
					mode="multiple"
					placeholder={ "Labels" }
				>
					{
						this.state.labels.map( item => (
							<Option
								key={ item.id }
								value={ item.labelname }
							>
								{ item.labelname }
							</Option>
						))
					}
				</Select>
			)
		},
	];

	// define table header
	tableHeader = (
		<>
			<ContactsOutlined />
			<strong>Profiles</strong>
		</>
	)

	// bind versions of CRUD
	config = {
		service: profileService,
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

	configLabel = {
		service: labelService,
		list: "list",
		dataName: "labels",
	};
	listLabels = listSync.bind(this, this.configLabel);

	// refresh table
	refreshTable = () => {
		this.listSync();
		this.listLabels();
		this.setState({ tableWrapperKey: Date.now() })
	};

	render(){
		return (
			<div className='Profile'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					// data props
					data={ this.state.data }
					// display props
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					drawerTitle='A Profile'
					// api props
					create={ this.createSync }
					edit={ this.updateSync }
					delete={ this.hideSync }
					refreshTable={ this.refreshTable }
				>
				</TableWrapper>
			</div>
		);
	}
}

export { Profile };
