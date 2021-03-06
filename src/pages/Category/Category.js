import React, { Component } from 'react';

// import components from ant design
import { 
	Input,
	Spin
} from 'antd';
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
const { createSync, retrieveSync, listSync, updateSync, hideSync } = backend;
const { compare } = helpers;

class Category extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
			spinning: false,
			rowCount: 0,
			defaultPageSize: 25,
			defaultPage: 1,
		};
	}
	
	componentDidMount() {
		this.setState({ spinning: true }, async () => {
			const limit = this.state.defaultPageSize;
			const offset = (this.state.defaultPage - 1) * limit;
			await this.listSync({
				limit,
				offset,
			});
			const { entry: {row_count} } = await this.retrieveRowCount();
			this.setState({ 
				spinning: false, 
				rowCount: row_count, 
			});
		});
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
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
			sorter: (a, b) => compare(a.description, b.description),
			sortDirection: ['ascend', 'descend'],
			width: '45%',
			ellipsis: true,
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
					placeholder={ "Category name must be unique" }
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
					placeholder={ "Category description" }
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
	config = {
		service: categoryService,
		create: "create",
		retrieve: "retrieve",
		list: "list",
		update: "update",
		hide: "hide",
		dataName: "data",
	};
	createSync = createSync.bind(this, this.config);
	retrieveRowCount = retrieveSync.bind(this, {
		...this.config, 
		retrieve: "retrieveRowCount",
	});
	listSync = listSync.bind(this, this.config);
	updateSync = updateSync.bind(this, this.config);
	hideSync = hideSync.bind(this, this.config);

	// refresh table
	refreshTable = () => {
		this.setState({ spinning: true }, async () => {
			await this.listSync();
			this.setState({ spinning: false });
			this.setState({ tableWrapperKey: Date.now() })
		});
	};

	render(){
		return (
			<div className='Category'>
				<Spin spinning={ this.state.spinning }>
					<TableWrapper
						key={ this.state.tableWrapperKey }
						// data props
						data={ this.state.data }
						rowCount={ this.state.rowCount }
						defaultPageSize={ this.state.defaultPageSize }
						defaultPage={ this.state.defaultPage}
						// display props
						columns={ this.columns }
						formItems={ this.formItems }
						tableHeader={ this.tableHeader }
						drawerTitle='A Category'
						pagination={ false }
						size={ "small" }
						// api props
						create={ this.createSync }
						list={ this.listSync }
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

export { Category };
