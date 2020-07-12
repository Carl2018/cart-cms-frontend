import React, { Component } from 'react';

// import styling from ant desgin
import { FileSearchOutlined } from '@ant-design/icons';
import { Input, message } from 'antd';

// import shared components
import { TableWrapper } from '_components'

class Case extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: this.props.data ? this.props.data : this.allCases,
		};
	}
	
	allCases = [
		{
			key: '1',
			casename: 'alice account unban',
			remarks: 'The user has been banned once before',
			status: 'pending',
			createdAt: new Date('2020-05-20T14:20:20').toISOString().split('.')[0].replace('T', ' '),
			relatedEmail: 'alice@gmail.com',
			relatedAccount: 'alice@facebook.com',
		},
		{
			key: '2',
			casename: 'bob membership change',
			remarks: 'The user has been a VIP for 6 months',
			status: 'approved',
			createdAt: new Date('2020-05-22T17:30:15').toISOString().split('.')[0].replace('T', ' '),
			relatedEmail: 'bob@gmail.com',
			relatedAccount: '0085212345678',
		},
		{
			key: '21',
			casename: 'bob password change failed',
			remarks: 'made more than 3 attempts',
			status: 'approved',
			createdAt: new Date('2020-05-22T17:30:15').toISOString().split('.')[0].replace('T', ' '),
			relatedEmail: 'bob@gmail.com',
			relatedAccount: '0085212345678',
		},
		{
			key: '3',
			casename: 'charlie account unban',
			remarks: 'This is the first time the user got banned',
			status: 'pending',
			createdAt: new Date('2020-05-21T10:15:45').toISOString().split('.')[0].replace('T', ' '),
			relatedEmail: 'charlie@hotmail.com',
			relatedAccount: 'charlie@facebook.com',
		},
		{
			key: '4',
			casename: 'david passowrd change',
			remarks: 'The user has made too many failed attempts',
			status: 'pending',
			createdAt: new Date('2020-05-20T16:16:20').toISOString().split('.')[0].replace('T', ' '),
			relatedEmail: 'david@gmail.com',
			relatedAccount: '0085287654321',
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
			title: 'Case Name',
			dataIndex: 'casename',
			key: 'casename',
			sorter: (a, b) => this.compare(a.casename, b.casename),
			sortDirection: ['ascend', 'descend'],
			width: '15%',
			setFilter: true
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			sorter: (a, b) => this.compare(a.status, b.status),
			sortDirection: ['ascend', 'descend'],
			width: '5%',
			setFilter: true
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			sorter: (a, b) => this.compare(a.createdAt, b.createdAt),
			sortDirection: ['ascend', 'descend'],
			defaultSortOrder: 'descend',
			width: '15%',
			setFilter: true
		},
		{
			title: 'Related Email',
			dataIndex: 'relatedEmail',
			key: 'relatedEmail',
			sorter: (a, b) => this.compare(a.relatedEmail, b.relatedEmail),
			sortDirection: ['ascend', 'descend'],
			width: '15%',
			setFilter: true
		},
		{
			title: 'Related Account',
			dataIndex: 'relatedAccount',
			key: 'relatedAccount',
			sorter: (a, b) => this.compare(a.relatedAccount, b.relatedAccount),
			sortDirection: ['ascend', 'descend'],
			width: '15%',
			setFilter: true
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Case Name',
			name: 'casename',
			rules: [
				{
					required: true,
					message: 'casename cannot be empty',
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
			label: 'Remarks',
			name: 'remarks',
			rules: [
				{
					required: true,
					message: 'remarks cannot be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Input.TextArea
					autoSize={{ minRows: 2, maxRows: 8 }}
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
					message: 'status cannot be empty',
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
			<FileSearchOutlined />
			<strong>Cases</strong>
		</>
	)

	// create api
  create = record => {
		const data = this.state.data.slice();
		record.key = Date.now();
		record.status = "pending";
		record.createdAt = new Date().toISOString().split('.')[0].replace('T', ' ');
		data.push(record);
		if (200) message.success('A record has been created');
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
		if (200) message.success('The record has been edited');
		this.setState({ data });
	}

	// delete api
  delete = keys => {
		let data = this.state.data.slice(); // do not mutate the data in state
		if (Array.isArray(keys)) {
			data = data.filter( 
				item => !keys.includes(item.key)
			);
			if (200) message.success('Multiple records have been deleted');
		} else {
			data = data.filter( 
				item => item.key !== keys
			);
			if (200) message.success('The record has been deleted');
		}
		this.setState({ data });
	}

	refreshTable = () => this.setState({ tableWrapperKey: Date.now() });
	render(){
		return (
			<div className='Case'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					data={ this.state.data }
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					drawerTitle='Create a new case'
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

export { Case };
