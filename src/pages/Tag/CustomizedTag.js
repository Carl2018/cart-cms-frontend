import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { TagOutlined } from '@ant-design/icons';
import { 
	Input, 
	Spin,
	Radio,
	Select,
} from 'antd';
// import services
import { labelService } from '_services';
// import shared and child components
import { TableWrapper } from './TableWrapper'
// import helpers
import { 
	backend,
	helpers 
} from '_helpers';
import moment from 'moment';
// destructure imported components and objects
const { createSync, retrieveSync, listSync, updateSync, hideSync } = backend;
const { compare } = helpers;
const { Option } = Select;

class CustomizedTag extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [
				{tag_name: "tag 1",tag_region:"HK",tag_banned:"OFF",tag_featured:"ON",tag_count:123,tag_created_at:"2020-12-28 13:00:00"},
				{tag_name: "tag 2",tag_region:"TW",tag_banned:"OFF",tag_featured:"ON",tag_count:43,tag_created_at:"2020-12-28 13:00:00"},
				{tag_name: "tag 3",tag_region:"MY",tag_banned:"OFF",tag_featured:"ON",tag_count:10,tag_created_at:"2020-12-28 13:00:00"},
				{tag_name: "tag 4",tag_region:"CA",tag_banned:"OFF",tag_featured:"OFF",tag_count:50,tag_created_at:"2020-12-28 13:00:00"},
				{tag_name: "tag 5",tag_region:"HK",tag_banned:"OFF",tag_featured:"OFF",tag_count:70,tag_created_at:"2020-12-28 13:00:00"},
				{tag_name: "tag 6",tag_region:"HK",tag_banned:"ON",tag_featured:"OFF",tag_count:20,tag_created_at:"2020-12-28 13:00:00"},
				{tag_name: "tag 7",tag_region:"TW",tag_banned:"ON",tag_featured:"OFF",tag_count:550,tag_created_at:"2020-12-28 13:00:00"},
				{tag_name: "tag 8",tag_region:"TW",tag_banned:"ON",tag_featured:"OFF",tag_count:1110,tag_created_at:"2020-12-28 13:00:00"},
			],
			spinning: false,
			rowCount: 0,
			defaultPageSize: 10,
			defaultPage: 1,
		};
	}
	
	componentDidMount() {
		this.setState({ spinning: true }, async () => {
			const limit = this.state.defaultPageSize;
			const offset = (this.state.defaultPage - 1) * limit;
			// await this.listSync({
			// 	limit,
			// 	offset,
			// });
			// const { entry: {row_count} } = await this.retrieveRowCount();
			this.setState({ 
				spinning: false, 
				rowCount: 10, 
			});
		});
	}
	// define columns for TableBody
	columns = [
		{
			title: 'Tag Name',
			dataIndex: 'tag_name',
			key: 'tag_name',
			sorter: (a, b) => compare(a.tag_name, b.tag_name),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			ellipsis: true,
			setFilter: false
		},
		{
			title: 'Count',
			dataIndex: 'tag_count',
			key: 'tag_count',
			sorter: (a, b) => compare(a.tag_count, b.tag_count),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: false,
		},
		{
			title: 'Region',
			dataIndex: 'tag_region',
			key: 'tag_region',
			sorter: (a, b) => compare(a.tag_region, b.tag_region),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: false,
		},
		{
			title: 'Is Banned',
			dataIndex: 'tag_banned',
			key: 'tag_banned',
			sorter: (a, b) => compare(a.tag_banned, b.tag_banned),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			ellipsis: true,
			setFilter: false
		},
		{
			title: 'Is Featured',
			dataIndex: 'tag_featured',
			key: 'tag_featured',
			sorter: (a, b) => compare(a.tag_featured, b.tag_featured),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			ellipsis: true,
			setFilter: false
		},
		{
			title: 'Created at',
			dataIndex: 'tag_created_at',
			key: 'tag_created_at',
			sorter: (a, b) => compare(a.tag_created_at, b.tag_created_at),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: false,
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Tag Name',
			name: 'tag_name',
			rules: [
				{
					required: true,
					message: 'Tag name cannot be empty',
				}
			],
			editable: true,
			input: (disabled,record) => {
			return	<Input
					maxLength={255}
					allowClear
					disabled= { record?.tag_name? true:disabled }
					placeholder={ "" }
				/>
			}
		},
		{
			label: 'Tag Region',
			name: 'tag_region',
			rules: [
				{
					required: true,
					message: 'Tag region cannot be empty',
				},
			],
			editable: true,
			input: (disabled, record) => (
				<Select
					mode="multiple"
					allowClear
					style={{ width: '100%' }}
					placeholder="Please select"
					disabled={ record?.tag_name? true: disabled }
				>
					{[
						<Option key={"HK"}>{"HK"}</Option>,
						<Option key={"TW"}>{"TW"}</Option>,
						<Option key={"MY"}>{"MY"}</Option>,
						<Option key={"CA"}>{"CA"}</Option>,

					]}
				</Select>
			)
		},	
		{
			label: 'Is Banned',
			name: 'tag_banned',
			rules: [
				{
					required: true,
					message: 'Tag Ban cannot be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Radio.Group 
					disabled={ disabled }
					allowClear
				>
					<Radio value={1}>ON</Radio>
					<Radio value={2}>OFF</Radio>
				</Radio.Group>
			)
		},	
		{
			label: 'Is Featured',
			name: 'tag_featured',
			rules: [
				{
					required: true,
					message: 'Tag featured cannot be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Radio.Group 
					disabled={ disabled }
					allowClear
				>
					<Radio value={1}>ON</Radio>
					<Radio value={2}>OFF</Radio>
				</Radio.Group>
			)
		},			
	];

	// define table header
	tableHeader = (
		<>
			<TagOutlined />
			<strong>Tags</strong>
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
	retrieveRowCount = retrieveSync.bind(this, {
		...this.config, 
		retrieve: "retrieveRowCount",
	});
	//listSync = listSync.bind(this, this.config);
	updateSync = updateSync.bind(this, this.config);
	hideSync = hideSync.bind(this, this.config);

	// refresh table
	refreshTable = () => {
		this.setState({ spinning: true }, async () => {
			// await this.listSync();
			// this.setState({ spinning: false });
			// this.setState({ tableWrapperKey: Date.now() })
		});
	};

	// render function
    render(){
        return (
            <div className='Tag'>
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
						drawerTitle='Tag'
						pagination={ false }
						// api props
						create={ this.createSync }
						//list={ this.listSync }
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

export { CustomizedTag };
