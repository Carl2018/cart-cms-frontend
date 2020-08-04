import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { CopyOutlined } from '@ant-design/icons';
import { 
	Input,
	Select,
	Spin,
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
const { createSync, listSync, updateSync, hideSync } = backend;
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
			spinning: false,
		};
	}
	
	componentDidMount() {
		this.setState({ spinning: true }, async () => {
			await this.listSync();
			await this.listCategories();
			this.setState({ spinning: false });
		});
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
						text = 'Yes';
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
					placeholder={ "Category" }
					showSearch
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children.trim().toLowerCase()
							.indexOf(input.trim().toLowerCase()) >= 0
					}
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
					placeholder={ "Title must be unique" }
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
					record={ {body: record.body_eng} }
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
					record={ {body: record.body_chn} }
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
	config = {
		service: templateService,
		create: "create",
		retrieve: "retrieve",
		list: "list",
		update: "update",
		hide: "hide",
		dataName: "data",
	};
	createSync = createSync.bind(this, this.config);
	listSync = listSync.bind(this, this.config);
	updateSync = updateSync.bind(this, this.config);
	hideSync = hideSync.bind(this, this.config);

	configCategory = {
		service: categoryService,
		list: "list",
		dataName: "categories",
	};
	listCategories = listSync.bind(this, this.configCategory);

	// refresh table
	refreshTable = () => {
		this.setState({ spinning: true }, async () => {
			await this.listSync();
			await this.listCategories();
			this.setState({ spinning: false });
			this.setState({ tableWrapperKey: Date.now() })
		});
	};

	render(){
		return (
			<div className='Template'>
				<Spin spinning={ this.state.spinning }>
					<TableWrapper
						key={ this.state.tableWrapperKey }
						// data props
						data={ this.state.data }
						// display props
						columns={ this.columns }
						formItems={ this.formItems }
						tableHeader={ this.tableHeader }
						drawerTitle='A Template'
						drawerWidth={ 900 }
						// api props
						create={ this.createSync }
						edit={ this.updateSync }
						delete={ this.hideSync }
						refreshTable={ this.refreshTable }
					>
					</TableWrapper>
				</Spin>
			</div>
		);
	}
}

export { Template };
