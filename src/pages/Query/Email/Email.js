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
import { TableWrapper } from './TableWrapper'

// import services

// import helpers
import { helpers } from '_helpers';

// destructure imported components and objects
const { compare } = helpers;
const { Option } = Select;

class Email extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
		};
	}

	componentDidMount() {
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
				const labels = this.props.labels.slice();
				const elements = labelname === undefined 
					|| labelname[0] === null 
					|| labels.length === 0 
					? <></> : 
					labelname.map( (item, index) => {
						const label_color = labels
							.find( label => label.labelname === item ).label_color;
						return (
							<Tag color={ label_color } key={ uuidv4() }>
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
			!this.props.profilename ? (<></>) :
			(
				record.id ?
				(
					<span style={{ marginLeft: "15px" }}>
						{ record.profilename }
					</span>
				) : 
				( 
					<Select
						disabled={ disabled }
						placeholder={ "Profile must be the current searched profile" }
						showSearch
						optionFilterProp="children"
						filterOption={(input, option) =>
							option.children.trim().toLowerCase()
								.indexOf(input.trim().toLowerCase()) >= 0
						}
					>
						<Option value={ this.props.profilename }>
							{ this.props.profilename }
						</Option>
					</Select>
				) 
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

	// refresh table
	refreshTable = () => {
		this.setState({ tableWrapperKey: Date.now() })
	};

	render(){
		return (
			<div className='Email'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					// data props
					data={ this.props.data }
					labels={ this.props.labels }
					profilename={ this.props.profilename }
					// display props
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					drawerTitle='An Email'
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
				</TableWrapper>
			</div>
		);
	}
}

export { Email };
