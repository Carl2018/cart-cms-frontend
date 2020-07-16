import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { MailOutlined } from '@ant-design/icons';
import { 
	Input, 
	Select, 
	Tag, 
} from 'antd';

// import shared and child components
import { TableWrapper } from '_components'

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
const { Option } = Select

class Email extends Component {
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
		this.list();
		this.listLabels();
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
			title: 'Last Updated At',
			dataIndex: 'updated_at',
			key: 'updated_at',
			sorter: (a, b) => compare(a.updated_at, b.updated_at),
			sortDirection: ['ascend', 'descend'],
			defaultSortOrder: 'descend',
			width: '20%',
			setFilter: true
		},
		{
			title: 'Profile ID',
			dataIndex: 'profile_id',
			key: 'profile_id',
			sorter: (a, b) => compare(a.profile_id, b.profile_id),
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
				/>
			)
		},
		{
			label: 'Last Contacted At',
			name: 'updated_at',
			rules: [
				{
					required: true,
					message: 'updated_at cannot be empty',
				}
			],
			editable: false,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
				/>
			)
		},
		{
			label: 'Profile ID',
			name: 'profile_id',
			rules: [
				{
					required: true,
					message: 'Profile ID description cannot be empty',
				}
			],
			editable: false,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
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
	tableHeader = this.props.tableHeader ? this.props.tableHeader : 
	(
		<>
			<MailOutlined />
			<strong>Known Emails</strong>
		</>
	)

	// bind versions of CRUD
	create = create.bind(this, profileService, 'data');
	createRefresh = record => this.create(record).then( res => this.list() );
	list = listCombined.bind(this, emailService, 'data', ['labelname', 'label_color']);
	update = update.bind(this, emailService, 'data');
	updateRefresh = (id, record) => this.update(id, record).then( res => this.list() );
	hide = hide.bind(this, emailService, 'data');
	listLabels = list.bind(this, labelService, 'labels');

	// refresh table
	refreshTable = () => {
		this.list();
		this.listLabels();
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
					drawerTitle='Create an Email with a NEW profile'
					dropdownName='Create Profile'
					create={ this.createRefresh }
					edit={ this.updateRefresh }
					delete={ this.hide }
					refreshTable={ this.refreshTable }
					isSmall={ this.props.isSmall }
				>
				</TableWrapper>
			</div>
		);
	}
}

export { Email };
