import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	Input,
	Select,
	Spin,
	Tag,
} from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';

// import shared and child components
import { TableWrapper } from './TableWrapper'

// import services
import { wordService } from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { createSync, listSync, updateSync } = backend;
const { compare } = helpers;
const { Option } = Select;

class Word extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
			spinning: false,
			db: 'ea',
		};
	}
	
	componentDidMount() {
		this.setState({ spinning: true }, async () => {
			await this.listSync({db: this.state.db});
			this.setState({ spinning: false });
		});
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Word ID',
			dataIndex: 'id',
			key: 'id',
			sorter: (a, b) => compare(a.id, b.id),
			sortDirection: ['ascend', 'descend'],
			fixed: 'left',
			width: "10%",
			setFilter: true
		},
		{
			title: 'Expression',
			dataIndex: 'expression',
			key: 'expression',
			sorter: (a, b) => compare(a.expression, b.expression),
			sortDirection: ['ascend', 'descend'],
			ellipsis: true,
			width: "20%",
			setFilter: true
		},
		{
			title: 'Region',
			dataIndex: 'region',
			key: 'region',
			sorter: (a, b) => compare(a.region, b.region),
			sortDirection: ['ascend', 'descend'],
			width: "20%",
			// setFilter: true,
			render: region => {
				let color = 'default';
				let text = 'Unknown';
				switch (region) {
					case 0:
						color = 'green';
						text = 'Universal';
						break;
					case 1:
						color = 'purple';
						text = 'Hong Kong';
						break;
					case 2:
						color = 'blue';
						text = 'Taiwan';
						break;
					case 3:
						color = 'red';
						text = 'Canada';
						break;
					case 4:
						color = 'magenta';
						text = 'Malaysia';
						break;
					default:
						color = 'default';
						text = 'Unknown';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ text }
					</Tag>
				);
			},
		},
		{
			title: 'Status',
			dataIndex: 'is_active',
			key: 'is_active',
			sorter: (a, b) => compare(a.is_active, b.is_active),
			sortDirection: ['ascend', 'descend'],
			width: "10%",
			// setFilter: true,
			render: is_active => {
				let color = 'default';
				let text = 'Unknown';
				switch (is_active) {
					case 0:
						color = 'red';
						text = 'Inactive';
						break;
					case 1:
						color = 'green';
						text = 'Active';
						break;
					default:
						color = 'default';
						text = 'Unknown';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ text }
					</Tag>
				);
			},
		},
		{
			title: 'In Word',
			dataIndex: 'in_word',
			key: 'in_word',
			sorter: (a, b) => compare(a.in_word, b.in_word),
			sortDirection: ['ascend', 'descend'],
			// setFilter: true,
			width: "10%",
			render: in_word => {
				let color = 'default';
				let text = 'Unknown';
				switch (in_word) {
					case 0:
						color = 'red';
						text = 'No';
						break;
					case 1:
						color = 'green';
						text = 'Yes';
						break;
					default:
						color = 'default';
						text = 'Unknown';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ text }
					</Tag>
				);
			},
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Expression',
			name: 'expression',
			rules: [
				{
					required: true,
					message: 'Expression cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
					placeholder={ "Expression must be unique" }
				/>
			)
		},
		{
			label: 'Region',
			name: 'region',
			rules: [
				{
					required: true,
					message: 'Region cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Select>
					<Option value={0}>Universal</Option>
					<Option value={1}>Hong Kong</Option>
					<Option value={2}>Taiwan</Option>
					<Option value={3}>Malaysia</Option>
					<Option value={4}>Canada</Option>
				</Select>
			)
		},
		{
			label: 'Status',
			name: 'is_active',
			rules: [
				{
					required: true,
					message: 'Status cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Select>
					<Option value={0}>Inactive</Option>
					<Option value={1}>Active</Option>
				</Select>
			)
		},
		{
			label: 'In Word',
			name: 'in_word',
			rules: [
				{
					required: true,
					message: 'In word cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Select>
					<Option value={0}>No</Option>
					<Option value={1}>Yes</Option>
				</Select>
			)
		},
	];

	// define table header
	tableHeader = (
		<>
			<FileExcelOutlined />
			<strong>Words</strong>
		</>
	)

	// handler for change cache
	handleChangeDb = db => {
		this.setState({ db, spinning: true }, async () => {
			await this.listSync({db});
			this.setState({ spinning: false });
		});	
	}

	// bind versions of CRUD
	config = {
		service: wordService,
		create: "create",
		retrieve: "retrieve",
		list: "list",
		update: "update",
		dataName: "data",
	};
	createSync = createSync.bind(this, this.config);
	listSync = listSync.bind(this, this.config);
	updateSync = updateSync.bind(this, this.config);

	// refresh table
	refreshTable = () => {
		this.setState({ spinning: true }, async () => {
			await this.listSync(this.state.db);
			this.setState({ spinning: false });
			this.setState({ tableWrapperKey: Date.now() })
		});
	};

	render(){
		return (
			<div className='Word'>
				<Spin spinning={ this.state.spinning }>
					<TableWrapper
						key={ this.state.tableWrapperKey }
						// data props
						data={ this.state.data }
						db={ this.state.db }
						// display props
						columns={ this.columns }
						formItems={ this.formItems }
						tableHeader={ this.tableHeader }
						drawerTitle='A Word'
						showDropdown={ false }
						size={ "small" }
						// api props
						create={ this.createSync }
						edit={ this.updateSync }
						onChangeDb={ this.handleChangeDb }
						refreshTable={ this.refreshTable }
					>
					</TableWrapper>
				</Spin>
			</div>
		);
	}
}

export { Word };
