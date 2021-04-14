import React, { Component } from 'react';

// import components from ant design
import { 
	Col,
	Row,
	Select,
	Space,
	Spin,
	Input, 
} from 'antd';
import { ProfileOutlined } from '@ant-design/icons';

// import shared and child components
import { TableWrapper } from '_components'

// import services
import { 
	statisticService,
} from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { retrieveSync, listSync } = backend;
const { compare } = helpers;
const { Option } = Select;
const { Search } = Input; 

class RedisLog extends Component {
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
			region:"1",
			candidate_id:"",
			category:"",
			categoryList: ['a','b','c'],
		};
	}
	
	componentDidMount() {
		this.setState({ spinning: true }, async () => {
			const limit = this.state.defaultPageSize;
			const offset = (this.state.defaultPage - 1) * limit;
			const filters = {
				region: this.state.region,
				candidate_id: this.state.candidate_id,
				category: this.state.category,
			}
			const { categories } = await this.categoryListSync({
				...filters,
			});
			await this.listSync({
				limit,
				offset,
				...filters,
			});
			const { entry: {row_count} } = await this.retrieveRowCount({
				...filters,
			});
			this.setState({ 
				spinning: false, 
				rowCount: row_count, 
				categoryList: categories
			});
		});
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Candidate ID',
			dataIndex: 'candidate_id',
			key: 'candidate_id',
			sorter: (a, b) => compare(a.candidate_id, b.candidate_id),
			sortDirection: ['ascend', 'descend'],
			width: 40,
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Cache',
			dataIndex: 'region',
			key: 'region',
			sorter: (a, b) => compare(a.region, b.region),
			sortDirection: ['ascend', 'descend'],
			width: 20,
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Category',
			dataIndex: 'category',
			key: 'category',
			sorter: (a, b) => compare(a.category, b.category),
			sortDirection: ['ascend', 'descend'],
			width: 40,
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Value',
			dataIndex: 'value',
			key: 'value',
			sorter: (a, b) => compare(a.value, b.value),
			sortDirection: ['ascend', 'descend'],
			width: 20,
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Created at',
			dataIndex: 'created_at',
			key: 'created_at',
			sorter: (a, b) => compare(a.created_at, b.created_at),
			sortDirection: ['ascend', 'descend'],
			width: 60,
			ellipsis: true,
			setFilter: true
		},
	];

	// define table header
	tableHeader = (
		<>
			<ProfileOutlined />
			<strong>Redis Logs</strong>
		</>
	)

	// handler for change page 
	handleChangeCache = region => {
		this.setState({ spinning: true, data: [], region }, async () => {
			const limit = this.state.defaultPageSize;
			const offset = (this.state.defaultPage - 1) * limit;
			const filters = {
				region,
				candidate_id: this.state.candidate_id,
				category: this.state.category,
			};
			await this.listSync({
				limit,
				offset,
				...filters,
			});
			const { entry: {row_count} } = await this.retrieveRowCount({ 
				...filters,
			});
			console.log(`row_count is: dddddddddddddddd  ${row_count}`)
			this.setState({ 
				spinning: false, 
				rowCount: row_count, 
			});
		});
	}
	// handler for Search button
	handleSearch = candidate_id => {
		this.setState({ data: [] }, async () => {
			const limit = this.state.defaultPageSize;
			const offset = (this.state.defaultPage - 1) * limit;
			let filters = {}
			filters = {
				region: this.state.region,
				candidate_id,
				category: this.state.category,
			}
			await this.listSync({
				limit,
				offset,
				...filters,
			});
			const { entry: {row_count} } = await this.retrieveRowCount({ 
				...filters,
			});
			this.setState({ 
				spinning: false, 
				rowCount: row_count, 
				candidate_id: candidate_id
			});
		});
	}
	// handler for Search button
	handleCategorySearch = category => {
		this.setState({ data: [] }, async () => {
			const limit = this.state.defaultPageSize;
			const offset = (this.state.defaultPage - 1) * limit;
			let filters = {}
			filters = {
				region: this.state.region,
				candidate_id: this.state.candidate_id,
				category,
			}
			await this.listSync({
				limit,
				offset,
				...filters,
			});
			const { entry: {row_count} } = await this.retrieveRowCount({ 
				...filters,
			});
			this.setState({ 
				spinning: false, 
				rowCount: row_count, 
				category: category
			});
		});
	}
	// bind versions of CRUD
	config = {
		service: statisticService,
		list: "redis_logs",
		dataName: "data",
		retrieve: "retrieve_row_count",
	};
	configCategoryList = {
		service: statisticService,
		list: "category_lists",
	};
	listSync = listSync.bind(this, this.config);
	categoryListSync = listSync.bind(this, this.configCategoryList);
	retrieveRowCount = retrieveSync.bind(this, {
		...this.config, 
	});

	render(){
		// define extra row
		const extraRow = (
			<Row style={{ marginBottom: "16px" }}>
				<Col 
					style={{ fontSize: '24px', textAlign: 'left' }}
					span={ 12 } 
				>
						<Space>
							<span style={{ fontSize: "16px", marginLeft: "8px" }} >
								Cache:
							</span>
							<Select
								value={ this.state.region }
								onChange={ this.handleChangeCache }
								style={{ marginRight: "16px", width: 150 }}
							>
								<Option value="1">Hong Kong</Option>
								<Option value="2">Taiwan</Option>
								<Option value="4">Malaysia</Option>
								<Option value="3">Canada</Option>
							</Select>
							
							<Search
								onSearch={ this.handleSearch }
								placeholder= "Search Logs by Candidate ID"
								style={{ width: 300 }}
								size="middle"
								allowClear
							/>
							<span style={{ fontSize: "16px", marginLeft: "8px" }} >
								Category:
							</span>
							<Select
								value={ this.state.category }
								onChange={ this.handleCategorySearch }
								style={{ marginRight: "16px", width: 150 }}
							>
								{this.state.categoryList.map( item => (<Option value={item}>{item}</Option>))}
							</Select>
						</Space>
				</Col>
			</Row>
		)

		return (
			<div className='Log'>
				<Spin spinning={ this.state.spinning }>
					<TableWrapper
						key={ this.state.tableWrapperKey }
						// data props
						data={ this.state.data }
						rowCount={ this.state.rowCount }
						defaultPageSize={ this.state.defaultPageSize }
						defaultPage={ this.state.defaultPage}
						filters={ {
							pagename: this.state.pagename,
							created_by: this.state.created_by,
							created_on: this.state.created_on,
						} }
						// display props
						columns={ this.columns }
						tableHeader={ this.tableHeader }
						extraRow={ extraRow }
						pagination={ false }
						showDropdown={ false }
						noAction={ true }
						noBatch={ true }
						scroll={ {x:2200} }
						// api props
						list={ this.listSync }
					>
					</TableWrapper>
				</Spin>
			</div>
		);
	}
}

export { RedisLog };
