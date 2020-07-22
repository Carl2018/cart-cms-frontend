import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { CopyOutlined } from '@ant-design/icons';
import { 
	Input,
	Select,
	Tag,
} from 'antd';

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
			// for category selections
			categories: [],
		};
	}
	
	componentDidMount() {
		this.list();
		this.listCategories();
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
			sorter: (a, b) => compare(a.categoryname, b.categoryname),
			sortDirection: ['ascend', 'descend'],
			width: '30%',
			setFilter: true
		},
		{
			title: 'Copied Count',
			dataIndex: 'copied_count',
			key: 'copied_count',
			sorter: (a, b) => compare(a.copied_count, b.copied_count),
			sortDirection: ['ascend', 'descend'],
			width: '30%',
			setFilter: true
		},
		{
			title: 'Stick Top',
			dataIndex: 'sticktop',
			key: 'sticktop',
			width: '30%',
			sorter: (a, b) => compare(a.sticktop, b.sticktop),
			sortDirection: ['ascend', 'descend'],
			render: sticktop => {
				let color = 'default';
				let text = 'No';
				switch (sticktop) {
					case 't' :
						color = 'blue';
						text = 'True';
						break;
					case 'f' :
						color = 'default';
						text = 'No';
						break;
					default:
						color = 'default';
						text = 'No';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ text }
					</Tag>
				);
			},
		}
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Category',
			name: 'categoryname',
			rules: [
				{
					required: false,
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
			label: 'Body in English',
			name: 'body_eng',
			rules: [
				{
					required: true,
					message: 'Body in English cannot be empty',
				},
			],
			editable: true,
			input: (disabled, record) => (
				<RichTextInput 
					disabled={ disabled }
					record={ record }
					bodyName={ "body_eng"}
				/>
			)
		},			
		{
			label: 'Body in Chinese',
			name: 'body_chn',
			rules: [
				{
					required: true,
					message: 'Body in Chinese cannot be empty',
				},
			],
			editable: true,
			input: (disabled, record) => (
				<RichTextInput 
					disabled={ disabled }
					record={ record }
					bodyName={ "body_chn"}
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
	createSync = record => this.create(record).then( res => this.list() );
	list = list.bind(this, templateService, 'data');
	update = update.bind(this, templateService, 'data');
	hide = hide.bind(this, templateService, 'data');
	listCategories = list.bind(this, categoryService, 'categories');

	// refresh table
	refreshTable = () => {
		this.list();
		this.listCategories();
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
					drawerTitle='Create a New Template'
					create={ this.createSync }
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
