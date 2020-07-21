import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { TeamOutlined } from '@ant-design/icons';
import { 
	Input, 
	Select, 
	Tag, 
} from 'antd';

// import shared and child components
import { AccountWrapper } from './AccountWrapper';

// import services

// import helpers
import { helpers } from '_helpers';

// destructure imported components and objects
const { compare } = helpers;
const { Option } = Select;

class Account extends Component {
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
			title: 'Candidate ID',
			dataIndex: 'candidate_id',
			key: 'candidate_id',
			sorter: (a, b) => compare(a.candidate_id, b.candidate_id),
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
			title: 'Account Name',
			dataIndex: 'accountname',
			key: 'accountname',
			sorter: (a, b) => compare(a.accountname, b.accountname),
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
	];

	// define form items for TableDrawer
	formItems = [
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
				>
					<Option value="f">facebook</Option>
					<Option value="p">phone</Option>
				</Select>
			)
		},
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
			input: disabled => 
			!this.props.profilename ? (<></>) :
			(
				<Select
					disabled={ disabled }
				>
					<Option value={ this.props.profilename }>
						{ this.props.profilename }
					</Option>
				</Select>
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

	// bind versions of CRUD

	// refresh table
	refreshTable = () => {
		this.setState({ tableWrapperKey: Date.now() })
	};

	render(){
		return (
			<div className='Account'>
				<AccountWrapper
					key={ this.state.tableWrapperKey }
					// data props
					data={ this.props.data }
					// display props
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					drawerTitle='Create A New Account'
					loading={ this.props.loading }
					isSmall={ this.props.isSmall }
					showHeader={ this.props.showHeader }
					showDropdown={ this.props.showDropdown }
					// api props
					create={ this.props.create }
					edit={ this.props.edit }
					ban={ this.props.ban }
					delete={ this.props.delete }
					refreshTable={ this.refreshTable }
				>
				</AccountWrapper>
			</div>
		);
	}
}

export { Account };
