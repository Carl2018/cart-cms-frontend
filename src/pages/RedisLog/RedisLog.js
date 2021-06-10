import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	Col,
	Row,
	Select,
	Space,
	Spin,
	Input, 
	Button
} from 'antd';
import { ProfileOutlined } from '@ant-design/icons';

// import shared and child components
import { TableWrapper } from '_components'
import { RedisLogChart } from '_components'
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
const moment = require('moment');

class RedisLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalKeyDetail: Date.now(),
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
			spinning: false,
			rowCount: 0,
			defaultPageSize: 25,
			defaultPage: 1,
			region:"1",
			candidate_id:"",
			category:"",
			categoryList: ['a','b','c'],
			lineDataSet: [],
			start_time:moment().format("YYYY-MM-DD"),
			end_time:moment().format("YYYY-MM-DD"),
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
			sorter: (a, b) =>  compare(a.candidate_id - b.candidate_id),
			sortDirection: ['ascend', 'descend'],
			width: '5%',
			ellipsis: true,
			setFilter: false
		},
		{
			title: 'Value',
			dataIndex: 'value',
			key: 'value',
			sorter: (a, b) => compare(a.value, b.value),
			sortDirection: ['ascend', 'descend'],
			width: '3%',
			ellipsis: true,
			setFilter: false
		},
		{
			title: 'Category',
			dataIndex: 'category',
			key: 'category',
			sorter: (a, b) => compare(a.category, b.category),
			sortDirection: ['ascend', 'descend'],
			width: '8%',
			ellipsis: true,
			setFilter: false
		},
		
		{
			title: 'Cache',
			dataIndex: 'region',
			key: 'region',
			sorter: (a, b) => compare(a.region, b.region),
			sortDirection: ['ascend', 'descend'],
			width: '7%',
			ellipsis: true,
			setFilter: false
		},
		{
			title: 'Created at',
			dataIndex: 'created_at',
			key: 'created_at',
			sorter: (a, b) => compare(a.created_at, b.created_at),
			sortDirection: ['ascend', 'descend'],
			width: '10%',
			ellipsis: true,
			setFilter: false
		},
		{
			title: 'Actions',
			key: 'action',
			render: (text, record) => (
				<Space size='small'>
                    <Button
						type='link'
						onClick={this.handleClickDetail.bind(this,record)}
					>
						Detail
					</Button>
				</Space>
			),
			width: '5%',
			setFilter: false
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
	handleChangeCache = async region => {
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
			this.setState({ 
				spinning: false, 
				rowCount: row_count, 
			});
		});
	}
	// handler for Search button
	handleSearch = async candidate_id => {
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
	handleCategorySearch = async category => {
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
	// handler for click flag search modal
	handleClickDetail = async record => {
		this.setState({
			candidate_id: record.candidate_id,
			visibleDetail: true,
		});
		const filters = {
			candidate_id: record.candidate_id,
			start_time: this.state.start_time,
			end_time: this.state.end_time,
		}
		await this.logValueListSync({
			...filters,
		})
	}
	// handler for close Detail modal
	handleCloseDetail = event => {
		this.setState({
			visibleDetail: false,
			modalKeyDetail: Date.now(),
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
	configLogValueList = {
		service: statisticService,
		dataName: "lineDataSet",
		list: "log_value_lists",
	};
	listSync = listSync.bind(this, this.config);
	categoryListSync = listSync.bind(this, this.configCategoryList);
	logValueListSync = listSync.bind(this, this.configLogValueList);
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
							<span style={{ fontSize: "16px", marginLeft: "8px" }} >
								Category:
							</span>
							<Select
								value={ this.state.category }
								onChange={ this.handleCategorySearch }
								style={{ marginRight: "16px", width: 350 }}
							>
								{this.state.categoryList.map( item => (<Option value={item} key={ uuidv4() }>{item}</Option>))}
							</Select>
							<Search
								onSearch={ this.handleSearch }
								placeholder= "Search Logs by Candidate ID"
								style={{ width: 300 }}
								size="middle"
								allowClear
							/>
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
							region: this.state.region,
							candidate_id: this.state.candidate_id,
							category: this.state.category,
						} }
						// display props
						columns={ this.columns }
						tableHeader={ this.tableHeader }
						extraRow={ extraRow }
						pagination={ false }
						showDropdown={ false }
						noAction={ true }
						noBatch={ true }
						size={ "small" }
						scroll={ {x:2200} }
						// api props
						list={ this.listSync }
					>
					</TableWrapper>
				</Spin>
				<div>
					<RedisLogChart
						// lineDataSet = { this.state.lineDataSet}
						categoryList={ this.state.categoryList }
						candidateId={ this.state.candidate_id }
						category = { this.state.category }
						modalKey={ this.state.modalKeyDetail }
						visible={ this.state.visibleDetail }
						onCancel={ this.handleCloseDetail }
					>
					</RedisLogChart>
				</div>
			</div>
		);
	}
}

export { RedisLog };
