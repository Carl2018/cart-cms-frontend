import React, { Component } from 'react';

// import styling from ant desgin
import { TagOutlined } from '@ant-design/icons';
import { Input, Tag, Select } from 'antd';

// import shared components
import TableWrapper from '../_components/TableWrapper'
import { success } from '../_components/Message'

const { Option } = Select;

class Label extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [
				{
					key: '1',
					labelName: 'normal',
					labelType: 'Information',
					labels: [['Information', 'normal']],
				},
				{
					key: '2',
					labelName: 'frequent user',
					labelType: 'Information',
					labels: [['Information', 'frequent user']],
				},
				{
					key: '3',
					labelName: 'VIP',
					labelType: 'Warning',
					labels: [['Warning', 'VIP']],
				},
				{
					key: '4',
					labelName: 'banned',
					labelType: 'Danger',
					labels: [['Danger', 'banned']],
				},
				{
					key: '5',
					labelName: 'spammer',
					labelType: 'Danger',
					labels: [['Danger', 'spammer']],
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
			title: 'Label Name',
			dataIndex: 'labelName',
			key: 'labelName',
			sorter: (a, b) => this.compare(a.labelName, b.labelName),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: true
		},
		{
			title: 'Label Type',
			dataIndex: 'labelType',
			key: 'labelType',
			sorter: (a, b) => this.compare(a.labelType, b.labelType),
			sortDirection: ['ascend', 'descend'],
			width: '30%',
			setFilter: true
		},
		{
			title: 'Label',
			key: 'labels',
			dataIndex: 'labels',
			render: labels => !labels ? <></> : (
				<>
					{labels.map(tag => {
						let color = 'blue';
						switch (tag[0]) {
							case 'Information' :
								color = 'blue';
								break;
							case 'Warning' :
								color = 'gold';
								break;
							case 'Danger' :
								color = 'red';
								break;
							default :
								color = 'blue';
								break;
						}
						return (
							<Tag color={color} key={tag[1]}>
								{tag[1].toUpperCase()}
							</Tag>
						);
					})}
				</>
			),
			width: '20%',
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Label Name',
			name: 'labelName',
			rules: [
				{
					required: true,
					message: 'labelName cannot be empty',
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
			label: 'Label Type',
			name: 'labelType',
			rules: [
				{
					required: true,
					message: 'labelType cannot be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Select
					disabled={ disabled }
				>
					<Option value="Information">Information</Option>
					<Option value="Warning">Warning</Option>
					<Option value="Danger">Danger</Option>
				</Select>
			)
		},			
	];

	// define table header
	tableHeader = (
		<>
			<TagOutlined />
			<strong>Labels</strong>
		</>
	)

	// create api
  create = record => {
		const data = this.state.data.slice();
		record.key = Date.now();
		record.labels = [[record.labelType, record.labelName]];
		console.log(record.labels);
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
		originalRecord.labels = [[originalRecord.labelType, originalRecord.labelName]];
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
			<div className='Label'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					data={ this.state.data }
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					drawerTitle='Create a new tag'
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

export default Label;
