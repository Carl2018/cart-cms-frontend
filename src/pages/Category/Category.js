import React, { Component } from 'react';

// import components from ant design
import { Input } from 'antd';
import { HddOutlined } from '@ant-design/icons';

// import shared and child components
import { TableWrapper } from '_components'

// import services
import { categoryService } from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { create, list, update, hide } = backend;
const { compare } = helpers;

class Category extends Component {
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
			title: 'Category',
			dataIndex: 'categoryname',
			key: 'categoryname',
			sorter: (a, b) => compare(a.categoryname, b.categoryname),
			sortDirection: ['ascend', 'descend'],
			width: '30%',
			setFilter: true
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
			sorter: (a, b) => compare(a.description, b.description),
			sortDirection: ['ascend', 'descend'],
			width: '40%',
			setFilter: true
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Category',
			name: 'categoryname',
			rules: [
				{
					required: true,
					message: 'category cannot be empty',
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
			label: 'Description',
			name: 'description',
			rules: [
				{
					required: true,
					message: 'description cannot be empty',
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
	];

	// define table header
	tableHeader = (
		<>
			<HddOutlined />
			<strong>Categories</strong>
		</>
	)

	// bind versions of CRUD
	create= create.bind(this, categoryService);
	list = list.bind(this, categoryService);
	update = update.bind(this, categoryService);
	hide = hide.bind(this, categoryService);

	// refresh table
	refreshTable = () => {
		this.list();
		this.setState({ tableWrapperKey: Date.now() })
	};

	render(){
		return (
			<div className='Category'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					data={ this.state.data }
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					drawerTitle='Create a new category'
					create={ this.create }
					edit={ this.update }
					delete={ this.hide }
					refreshTable={ this.refreshTable }
				>
				</TableWrapper>
			</div>
		);
	}
}

export { Category };
