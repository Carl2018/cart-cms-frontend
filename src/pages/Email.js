import React, { Component } from 'react';

// import styling from ant desgin
import { MailOutlined } from '@ant-design/icons';
import { Input } from 'antd';

// import shared components
import TableWrapper from '../_components/TableWrapper'
import { success } from '../_components/Message'

class Email extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [
				{
					key: '1',
					email: 'alice@gmail.com',
					createdAt: new Date('2020-05-20T14:20:20').toISOString().split('.')[0].replace('T', ' '),
					updatedAt: new Date('2020-05-25T11:28:25').toISOString().split('.')[0].replace('T', ' '),
				},
				{
					key: '2',
					email: 'bob@gmail.com',
					createdAt: new Date('2020-05-22T17:30:15').toISOString().split('.')[0].replace('T', ' '),
					updatedAt: new Date('2020-05-24T13:48:32').toISOString().split('.')[0].replace('T', ' '),
				},
				{
					key: '3',
					email: 'charlie@hotmail.com',
					createdAt: new Date('2020-05-21T10:15:45').toISOString().split('.')[0].replace('T', ' '),
					updatedAt: new Date('2020-05-22T18:23:28').toISOString().split('.')[0].replace('T', ' '),
				},
				{
					key: '4',
					email: 'david@gmail.com',
					createdAt: new Date('2020-05-20T16:16:20').toISOString().split('.')[0].replace('T', ' '),
					updatedAt: new Date('2020-05-25T12:33:18').toISOString().split('.')[0].replace('T', ' '),
				},
				{
					key: '5',
					email: 'cunningAliceUsedADifferentEmailAccount@gmail.com',
					createdAt: new Date('2020-05-20T17:36:20').toISOString().split('.')[0].replace('T', ' '),
					updatedAt: new Date('2020-05-21T08:40:20').toISOString().split('.')[0].replace('T', ' '),
				},
				{
					key: '6',
					email: 'davidUsedHisSecondaryEmailAccount@gmail.com',
					createdAt: new Date('2020-05-21T13:42:20').toISOString().split('.')[0].replace('T', ' '),
					updatedAt: new Date('2020-05-24T10:50:05').toISOString().split('.')[0].replace('T', ' '),
				},
			],
		};
	}
	
	// define columns for TableBody
	compare = (a, b) => {
		if (a >  b) return 1;
		if (a ===  b) return 0;
		if (a <  b) return -1;
	}

	columns = [
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			sorter: (a, b) => this.compare(a.email, b.email),
			sortDirection: ['ascend', 'descend'],
			width: '30%',
			setFilter: true
		},
		{
			title: 'Last Contacted At',
			dataIndex: 'updatedAt',
			key: 'updatedAt',
			sorter: (a, b) => this.compare(a.createdAt, b.createdAt),
			sortDirection: ['ascend', 'descend'],
			defaultSortOrder: 'descend',
			width: '40%',
			setFilter: true
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			sorter: (a, b) => this.compare(a.createdAt, b.createdAt),
			sortDirection: ['ascend', 'descend'],
			width: '40%',
			setFilter: true
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
	tableHeader = (
		<>
			<MailOutlined />
			<strong>Known Email Accounts</strong>
		</>
	)

	// create api
  create = record => {
		const data = this.state.data.slice();
		record.key = Date.now();
		record.status = "queueing";
		record.createdAt = new Date().toISOString().split('.')[0].replace('T', ' ');
		record.updatedAt = new Date().toISOString().split('.')[0].replace('T', ' ');
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
			<div className='Email'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					data={ this.state.data }
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					drawerTitle='Create a new email'
					create={ this.create }
					edit={ this.edit }
					delete={ this.delete }
					refreshTable={ this.refreshTable }
				>
				</TableWrapper>
			</div>
		);
	}
}

export default Email;
