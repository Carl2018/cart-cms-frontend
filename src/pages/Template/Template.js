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
import { 
	categoryService,
	templateService
} from '_services';

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
			categories: [],
		};
	}
	
	componentDidMount() {
		this.list();
		this.listCategory();
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
			sorter: (a, b) => compare(a.title, b.title),
			sortDirection: ['ascend', 'descend'],
			width: '40%',
			setFilter: true
		},
		{
			title: 'Category',
			dataIndex: 'categoryname',
			key: 'categoryname',
			sorter: (a, b) => compare(a.body, b.body),
			sortDirection: ['ascend', 'descend'],
			width: '30%',
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
			label: 'Category',
			name: 'categoryname',
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
					{
						this.state.categories.map( item => (
							<Option
								key={ item.id }
								value={ item.categoryname }
							>
								{ item.categoryname }
							</Option>
						))
					}
				</Select>
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

	// bind versions of CRUD
	create= create.bind(this, templateService, 'data');
	list = list.bind(this, templateService, 'data');
	update = update.bind(this, templateService, 'data');
	hide = hide.bind(this, templateService, 'data');
	listCategory = list.bind(this, categoryService, 'categories');

	// refresh table
	refreshTable = () => {
		this.list();
		this.listCategory();
		console.log(this.state.categories);
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
