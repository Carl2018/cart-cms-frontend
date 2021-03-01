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
import { tagService } from '_services';
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
			data: [],
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
			let filter = {
				in_region: 1,
				in_is_banned: 0,
				in_is_featured:1,
				in_is_active:1,
				in_order_by_column:'count',
				in_order_by_order:'desc'
			}
			await this.listSync(filter);
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
			dataIndex: 'tag',
			key: 'tag',
			sorter: (a, b) => compare(a.tag, b.tag),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			ellipsis: true,
			setFilter: false
		},
		{
			title: 'Count',
			dataIndex: 'count',
			key: 'count',
			sorter: (a, b) => compare(a.count, b.count),
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
			dataIndex: 'is_banned',
			key: 'is_banned',
			sorter: (a, b) => compare(a.is_banned, b.is_banned),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			ellipsis: true,
			setFilter: false
		},
		{
			title: 'Is Featured',
			dataIndex: 'is_featured',
			key: 'is_featured',
			sorter: (a, b) => compare(a.is_featured, b.is_featured),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			ellipsis: true,
			setFilter: false
		},
		{
			title: 'Created at',
			dataIndex: 'latest_update_datetime',
			key: 'latest_update_datetime',
			sorter: (a, b) => compare(a.created_at, b.created_at),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: false,
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Tag Name',
			name: 'tag',
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
					disabled= { record?.tag? true:disabled }
					placeholder={ "" }
				/>
			}
		},
		{
			label: 'Tag Region',
			name: 'region',
			rules: [
				{
					required: true,
					message: 'Tag region cannot be empty',
				},
			],
			editable: true,
			input: (disabled, record) => (
				<Select
				mode="single"
					allowClear
					style={{ width: '100%' }}
					placeholder="Please select"
					disabled={ record?.tag? true: disabled }
				>
					{[
						<Option key={1}>{"HK"}</Option>,
						<Option key={2}>{"TW"}</Option>,
						<Option key={3}>{"SG"}</Option>,
					]}
				</Select>
			)
		},	
		{
			label: 'Is Banned',
			name: 'is_banned',
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
					<Radio value={"ON"}>ON</Radio>
					<Radio value={"OFF"}>OFF</Radio>
				</Radio.Group>
			)
		},	
		{
			label: 'Is Featured',
			name: 'is_featured',
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
					<Radio value={"ON"}>ON</Radio>
					<Radio value={"OFF"}>OFF</Radio>
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
		service: tagService,
		create: "create",
		retrieve: "retrieve",
		list: "tagList",
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
						list={ this.listSync }
						edit={ this.updateSync }
						// delete={ this.hideSync }
						refreshTable={ this.refreshTable }
						toFlagPage={this.props.toFlagPage}
					>
					</TableWrapper>
				</Spin>
				<button onClick={this.props.toFlagPage}> test</button>
			</div>
        );
    }
}

export { CustomizedTag };
