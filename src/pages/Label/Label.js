import React, { Component } from 'react';

// import components from ant design
import { TagOutlined } from '@ant-design/icons';
import { 
	Input, 
	Select, 
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
const { create, list, update, hide } = backend;
const { compare } = helpers;
const { Option } = Select;

class Label extends Component {
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
			title: 'Label Name',
			dataIndex: 'labelname',
			key: 'labelname',
			sorter: (a, b) => compare(a.labelname, b.labelname),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: true
		},
		{
			title: 'Label Color',
			dataIndex: 'label_color',
			key: 'label_color',
			sorter: (a, b) => compare(a.label_color, b.label_color),
			sortDirection: ['ascend', 'descend'],
			width: '30%',
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
			key: 'label_color',
			dataIndex: 'label_color',
			render: (label_color, record) => {
				let labelname = record.labelname;
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
					<Tag color={color} key={Date.now()}>
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
	create= create.bind(this, labelService, 'data');
	list = list.bind(this, labelService, 'data');
	update = update.bind(this, labelService, 'data');
	hide = hide.bind(this, labelService, 'data');

	// refresh table
	refreshTable = () => {
		this.list();
		this.setState({ tableWrapperKey: Date.now() })
	};

	render(){
		return (
			<div className='Label'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					data={ this.state.data }
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					drawerTitle='Create a New Label'
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

export { Label };
