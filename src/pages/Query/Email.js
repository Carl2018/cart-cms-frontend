import React, { Component } from 'react';

// import components from ant design
import { MailOutlined } from '@ant-design/icons';
import { Input, Tag, Select } from 'antd';

// import shared and child components
import TableWrapper from '../../_components/TableWrapper'
import { success } from '../../_components/Message'

// destructure child components

const { Option } = Select;
class Email extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ data: nextProps.data });
	}

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
			title: 'Labels',
			key: 'labels',
			dataIndex: 'labels',
			render: labels => !labels ? <></> : (
				<>
					{labels.map(tag => {
						let color = 'blue';
						switch (tag) {
							case 'burning' :
								color = 'magenta';
								break;
							case 'hot' :
								color = 'red';
								break;
							case 'temperate' :
								color = 'orange';
								break;
							case 'warm' :
								color = 'gold';
								break;
							case 'agreeable' :
								color = 'green';
								break;
							case 'cold' :
								color = 'blue';
								break;
							case 'icy' :
								color = 'geekblue';
								break;
							case 'freezing' :
								color = 'purple';
								break;
							default :
								color = 'lime';
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
					<Option value="burning">burning</Option>
					<Option value="hot">hot</Option>
					<Option value="temperate">temperate</Option>
					<Option value="warm">warm</Option>
					<Option value="agreeable">agreeable</Option>
					<Option value="cold">cold</Option>
					<Option value="icy">icy</Option>
					<Option value="freezing">freezing</Option>
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
			<MailOutlined />
			<strong>Known Email Accounts</strong>
		</>
	)

	// create api
  create = record => {
		const data = this.state.data.slice();
		record.key = Date.now();
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
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					drawerTitle='Create a new email'
					create={ this.create }
					edit={ this.edit }
					delete={ this.delete }
					refreshTable={ this.refreshTable }
					isSmall={ this.props.isSmall }
					data={ this.state.data }
					loading={ this.props.loading }
					showHeader={ this.props.showHeader }
					showDropdown={ this.props.showDropdown }
				>
				</TableWrapper>
			</div>
		);
	}
}

export default Email;
