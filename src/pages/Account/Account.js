import React, { Component } from 'react';

// import styling from ant desgin
import { TeamOutlined } from '@ant-design/icons';
import { Input, Select, Tag } from 'antd';

// import shared components
import TableWrapper from '../../_components/TableWrapper'
import { success } from '../../_components/Message'

const { Option } = Select

class Account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: this.allAccounts,
		};
	}
	
	allAccounts = [
		{
			key: '1',
			candidateID: 'u9876543210',
			accountName: 'alice@facebook.com',
			accountType: 'facebook',
			labels: ['banned'],
			createdAt: new Date('2020-05-20T14:20:20').toISOString().split('.')[0].replace('T', ' '),
		},
		{
			key: '2',
			candidateID: 'u9876543212',
			accountName: '0085212345678',
			accountType: 'phone',
			labels: ['normal'],
			createdAt: new Date('2020-05-22T17:30:15').toISOString().split('.')[0].replace('T', ' '),
		},
		{
			key: '3',
			candidateID: 'u9876543213',
			accountName: 'charlie@facebook',
			accountType: 'facebook',
			labels: ['spammer', 'banned'],
			createdAt: new Date('2020-05-21T10:15:45').toISOString().split('.')[0].replace('T', ' '),
		},
		{
			key: '4',
			candidateID: 'u9876543214',
			accountName: '0085287654321',
			accountType: 'phone',
			labels: ['VIP'],
			createdAt: new Date('2020-05-20T16:16:20').toISOString().split('.')[0].replace('T', ' '),
		},
	];

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
			title: 'Labels',
			key: 'labels',
			dataIndex: 'labels',
			render: labels => !labels ? <></> : (
				<>
					{labels.map(tag => {
						let color = 'blue';
						switch (tag) {
							case 'normal' :
								color = 'blue';
								break;
							case 'banned' :
								color = 'red';
								break;
							case 'spammer' :
								color = 'purple';
								break;
							case 'VIP' :
								color = 'gold';
								break;
							default :
								color = 'blue';
								break;
						}
						return (
							<Tag color={color} key={tag}>
								{tag.toUpperCase()}
							</Tag>
						);
					})}
				</>
			),
			width: '20%',
		},
//		{
//			title: 'Created At',
//			dataIndex: 'createdAt',
//			key: 'createdAt',
//			sorter: (a, b) => this.compare(a.createdAt, b.createdAt),
//			sortDirection: ['ascend', 'descend'],
//			defaultSortOrder: 'descend',
//			width: '15%',
//			setFilter: true
//		},
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
			label: 'Labels',
			name: 'labels',
			rules: [
				{
					required: true,
					message: 'labels cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Select
					mode='multiple'
					disabled={ disabled }
				>
					<Option value="normal">normal</Option>
					<Option value="banned">banned</Option>
					<Option value="spammer">spammer</Option>
					<Option value="VIP">VIP</Option>
				</Select>
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

	// create api
  create = record => {
		const data = this.state.data.slice();
		record.key = Date.now();
		record.accountType = "queueing";
		record.createdAt = new Date().toISOString().split('.')[0].replace('T', ' ');
		data.push(record);
		if (200) success('create_success');
		console.log(data);
		this.setState({ data });
	}

	// edit api
  edit = (key, record) => {
		let data = this.state.data.slice();

		let originalRecord = data.find( item => item.key === key);
		let index = data.findIndex( item => item.key === key);
		Object.keys(record).forEach(item => originalRecord[item] = record[item])
		console.log(originalRecord);
		data[index] = originalRecord;
		if (200) success('edit_success');
		this.setState({ data });
	}

	// delete api
  delete = keys => {
		let data = this.state.data.slice(); // do not mutate the data in state
		if (Array.isArray(keys)) {
			data = data.filter( 
				item => !keys.includes(item.key)
			);
			if (200) success('batch_delete_success');
		} else {
			data = data.filter( 
				item => item.key !== keys
			);
			if (200) success('delete_success');
		}
		this.setState({ data });
	}

	refreshTable = () => this.setState({ tableWrapperKey: Date.now() });
	render(){
		return (
			<div className='Account'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					data={ this.state.data }
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					drawerTitle='Create a new account'
					create={ this.create }
					edit={ this.edit }
					delete={ this.delete }
					refreshTable={ this.refreshTable }
					isSmall={ this.props.isSmall }
				>
				</TableWrapper>
			</div>
		);
	}
}

export default Account;
