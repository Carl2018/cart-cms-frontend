import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { TagOutlined } from '@ant-design/icons';
import { 
	Input, 
	Select, 
	Spin,
	Tag, 
} from 'antd';

// import shared and child components
import { TableWrapper } from '_components'

// import services
import { labelService } from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { createSync, listSync, updateSync, hideSync } = backend;
const { compare } = helpers;
const { Option } = Select;

class Label extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
			spinning: false,
		};
	}
	
	componentDidMount() {
		this.setState({ spinning: true }, async () => {
			await this.listSync();
			this.setState({ spinning: false });
		});
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Label Name',
			dataIndex: 'labelname',
			key: 'labelname',
			sorter: (a, b) => compare(a.labelname, b.labelname),
			sortDirection: ['ascend', 'descend'],
			width: '30%',
			setFilter: true
		},
		{
			title: 'Label Color',
			dataIndex: 'label_color',
			key: 'label_color',
			sorter: (a, b) => compare(a.label_color, b.label_color),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			//setFilter: true,
			render: label_color => {
				let text = 'Gray';
				switch (label_color) {
					case 'l' :
						text = 'Green';
						break;
					case 'b' :
						text = 'Blue';
						break;
					case 'r' :
						text = 'Red';
						break;
					case 'y' :
						text = 'Gold';
						break;
					case 'g' :
						text = 'Gray';
						break;
					default :
						text = 'Gray';
						break;
				};	
				return (<>{ text }</>);
			}
		},
		{
			title: 'Label',
			key: 'labelname',
			dataIndex: 'labelname',
			sorter: (a, b) => compare(a.labelname, b.labelname),
			sortDirection: ['ascend', 'descend'],
			render: (labelname, record) => {
				let label_color= record.label_color;
				let color = 'default';
				switch (label_color) {
					case 'l' :
						color = 'success';
						break;
					case 'b' :
						color = 'processing';
						break;
					case 'r' :
						color = 'error';
						break;
					case 'y' :
						color = 'warning';
						break;
					case 'g' :
						color = 'default';
						break;
					default :
						color = 'default';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ labelname }
					</Tag>
				);
			},
			width: '20%',
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Label Name',
			name: 'labelname',
			rules: [
				{
					required: true,
					message: 'Label name cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
					placeholder={ "Label name must be unique" }
				/>
			)
		},
		{
			label: 'Label Color',
			name: 'label_color',
			rules: [
				{
					required: true,
					message: 'Label color cannot be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Select
					disabled={ disabled }
					placeholder={ "Label color" }
				>
					<Option value="l">Green</Option>
					<Option value="b">Blue</Option>
					<Option value="r">Red</Option>
					<Option value="y">Gold</Option>
					<Option value="g">Gray</Option>
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

	// bind versions of CRUD
	config = {
		service: labelService,
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
			<div className='Label'>
				<Spin spinning={ this.state.spinning }>
					<TableWrapper
						key={ this.state.tableWrapperKey }
						// data props
						data={ this.state.data }
						// display props
						columns={ this.columns }
						formItems={ this.formItems }
						tableHeader={ this.tableHeader }
						drawerTitle='A Label'
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

export { Label };
