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
import { EmailWrapper } from './EmailWrapper'

// import services
import { 
	labelService,
} from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { list } = backend;
const { compare } = helpers;
const { Option } = Select;

class Email extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			labels: [],
			// options for profile search
			options: [],
		};
	}

	componentDidMount() {
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
			input: disabled => 
			!this.props.profile ? (<></>) :
			(
				<Select
					disabled={ disabled }
				>
					<Option value={ this.props.profile }>
						{ this.props.profile }
					</Option>
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
	listLabels = list.bind(this, labelService, 'labels');

	// refresh table
	refreshTable = () => {
		this.listLabels();
		this.setState({ tableWrapperKey: Date.now() })
	};

	render(){
		return (
			<div className='Email'>
				<EmailWrapper
					key={ this.state.tableWrapperKey }
					// data props
					data={ this.props.data }
					labels={ this.state.labels }
					// display props
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					drawerTitle='Create A New Email'
					loading={ this.props.loading }
					isSmall={ this.props.isSmall }
					showHeader={ this.props.showHeader }
					showDropdown={ this.props.showDropdown }
					// api props
					create={ this.props.create }
					edit={ this.props.edit }
					delete={ this.props.delete }
					refreshTable={ this.refreshTable }
				>
				</EmailWrapper>
			</div>
		);
	}
}

export { Email };
