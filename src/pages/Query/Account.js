import React, { Component } from 'react';

// import components from ant design
import { 
	Input, 
	Select, 
	Tag, 
} from 'antd';
import { TeamOutlined } from '@ant-design/icons';

// import shared and child components
import { TableWrapper } from '_components'

// destructure child components
const { Option } = Select

class Account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
		};
	}
	
//	componentWillReceiveProps(nextProps) {
//		this.setState({ data: nextProps.data });
//	}

//	static getDerivedStateFromProps(nextProps, prevState) {
//		return { data: nextProps.data };
//	}
	
	// define columns for TableBody
	compare = (a, b) => {
		if (a >  b) return 1;
		if (a ===  b) return 0;
		if (a <  b) return -1;
	}

	columns = [
		{
			title: 'Candidate ID',
			dataIndex: 'candidateID',
			key: 'candidateID',
			sorter: (a, b) => this.compare(a.candidateID, b.candidateID),
			sortDirection: ['ascend', 'descend'],
			width: '25%',
			setFilter: true
		},
		{
			title: 'Account Type',
			dataIndex: 'accountType',
			key: 'accountType',
			sorter: (a, b) => this.compare(a.accountType, b.accountType),
			sortDirection: ['ascend', 'descend'],
			width: '15%',
			setFilter: true
		},
		{
			title: 'Account Name',
			dataIndex: 'accountName',
			key: 'accountName',
			sorter: (a, b) => this.compare(a.accountName, b.accountName),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: true
		},
		{
			title: 'Status',
			dataIndex: 'banned',
			key: 'banned',
			render: banned => ( banned ? 
				<Tag color="red">BANNED</Tag> : 
				<Tag color="blue">UNBANNED</Tag> ),
			width: '20%',
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Candidate ID',
			name: 'candidateID',
			rules: [
				{
					required: true,
					message: 'candidateID cannot be empty',
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
			name: 'accountType',
			rules: [
				{
					required: true,
					message: 'accountType cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Select
					disabled={ disabled }
				>
					<Option value="facebook">facebook</Option>
					<Option value="phone">phone</Option>
				</Select>
			)
		},
		{
			label: 'Account Name',
			name: 'accountName',
			rules: [
				{
					required: true,
					message: 'accountName cannot be empty',
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
			label: 'Created at',
			name: 'createdAt',
			rules: [
				{
					required: true,
					message: 'createdAt cannot be empty',
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
	];

	// define table header
	tableHeader = this.props.tableHeader ? this.props.tableHeader : 
	(
		<>
			<TeamOutlined />
			<strong>Accounts</strong>
		</>
	)

	// refresh table
	refreshTable = () => this.setState({ tableWrapperKey: Date.now() });

	render(){
		return (
			<div className='Account'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					// data props
					data={ this.props.data }
					// display props
					loading={ this.props.loading }
					tableHeader={ this.tableHeader }
					columns={ this.columns }
					formItems={ this.formItems }
					isSmall={ this.props.isSmall }
					showHeader={ this.props.showHeader }
					showDropdown={ this.props.showDropdown }
					drawerTitle='Create a new account'
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

export default Account;
