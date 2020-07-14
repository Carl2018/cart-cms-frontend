import React, { Component } from 'react';

// import components from ant design
import { CopyOutlined } from '@ant-design/icons';
import { Input, Select } from 'antd';

// import shared and child components
import {
	RichTextInput,
	TableWrapper,
} from '_components'

// import services
import { templateService } from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { create, list, update, hide } = backend;
const { compare } = helpers;
const { Option } = Select

class Template extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
		};
	}
	
	componentDidMount() {
		this.list();
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
			sorter: (a, b) => compare(a.title, b.title),
			sortDirection: ['ascend', 'descend'],
			width: '25%',
			setFilter: true
		},
		{
			title: 'Body',
			dataIndex: 'body',
			key: 'body',
			sorter: (a, b) => compare(a.body, b.body),
			sortDirection: ['ascend', 'descend'],
			width: '30%',
			setFilter: true
		},
		{
			title: 'Category',
			dataIndex: 'categoryname',
			key: 'categoryname',
			sorter: (a, b) => compare(a.body, b.body),
			sortDirection: ['ascend', 'descend'],
			width: '25%',
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
		{
			label: 'Category',
			name: 'category_id',
			rules: [
				{
					required: true,
					message: 'Category cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Select
					disabled={ disabled }
				>
					<Option value="1">General</Option>
					<Option value="2">Membership</Option>
				</Select>
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

	// bind versions of CRUD
	create= create.bind(this, templateService);
	list = list.bind(this, templateService);
	update = update.bind(this, templateService);
	hide = hide.bind(this, templateService);

	// refresh table
	refreshTable = () => {
		this.list();
		this.setState({ tableWrapperKey: Date.now() })
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
					edit={ this.update }
					delete={ this.hide }
					refreshTable={ this.refreshTable }
					drawerWidth={ 900 }
				>
				</TableWrapper>
			</div>
		);
	}
}

export { Template };
