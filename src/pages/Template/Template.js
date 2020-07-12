import React, { Component } from 'react';

// import styling from ant desgin
import { CopyOutlined } from '@ant-design/icons';
import { Input, message } from 'antd';

// import shared components
import {
	RichTextInput,
	TableWrapper,
} from '_components'

class Template extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [
				{
					key: '1',
					title: 'change of membership response',
					body: '<strong>By doing so, you will lose your privilge as abcdf</strong>',
				},
				{
					key: '2',
					title: 'unban response',
					body: `<ol><li>please behave yourself
								or you will be banned permanetly
								I am not kidding
								seriously
								I mean it
								stop laughing</li></ol>
								`,
				},
				{
					key: '3',
					title: 'change of password response',
					body: `<h1>please provide your credentials
								please please please
								please please please
								please please please</h1>
								`,
				},
				{
					key: '4',
					title: 'terms and conditions',
					body: `<h1>terms and conditions</h1>
								<ul>
								<li><p>clause 1</p></li>
								<li><p>clause 2</p></li>
								<li><p>clause 3</p></li>
								<li><p>clause 4</p></li>
								</ul>
								`,
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
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
			sorter: (a, b) => this.compare(a.title, b.title),
			sortDirection: ['ascend', 'descend'],
			width: '30%',
			setFilter: true
		},
		{
			title: 'Body',
			dataIndex: 'body',
			key: 'body',
			sorter: (a, b) => this.compare(a.body, b.body),
			sortDirection: ['ascend', 'descend'],
			width: '40%',
			setFilter: true
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Title',
			name: 'title',
			rules: [
				{
					required: true,
					message: 'title cannot be empty',
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
			label: 'Body',
			name: 'body',
			rules: [
				{
					required: true,
					message: 'body cannot be empty',
				},
			],
			editable: true,
			input: (disabled, record) => (
				<RichTextInput 
					disabled={ disabled }
					record={ record }
				/>
			)
		},			
	];

	// define table header
	tableHeader = (
		<>
			<CopyOutlined />
			<strong>Templates</strong>
		</>
	)

	// create api
  create = record => {
		const data = this.state.data.slice();
		record.key = Date.now();
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

	// layout for forms
	layout = {
		labelCol: {
			span: 6,
		},
		wrapperCol: {
			span: 18,
		},
	};

	render(){
		return (
			<div className='Template'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					data={ this.state.data }
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					drawerTitle='Create a new template'
					create={ this.create }
					edit={ this.edit }
					delete={ this.delete }
					refreshTable={ this.refreshTable }
					drawerWidth={ 900 }
					formLayout={ this.layout }
				>
				</TableWrapper>
			</div>
		);
	}
}

export { Template };
