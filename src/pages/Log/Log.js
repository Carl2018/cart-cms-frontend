import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	Col,
	DatePicker,
	Row,
	Select,
	Space,
	Spin,
	Tag,
} from 'antd';
import { ProfileOutlined } from '@ant-design/icons';

// import shared and child components
import { TableWrapper } from '_components'

// import services
import { 
	userService,
	logService,
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

class Log extends Component {
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
			pagename: "Categories",
			users: [],
			created_by: "",
			created_on: "",
		};
	}
	
	componentDidMount() {
		this.setState({ spinning: true }, async () => {
			// get all users
			const { entry } = await this.listUsers();
			const users = entry.map( item => item.alias );

			const limit = this.state.defaultPageSize;
			const offset = (this.state.defaultPage - 1) * limit;
			const filters = {
				pagename: this.state.pagename,
				created_by: this.state.created_by,
				created_on: this.state.created_on,
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
				users,
			});
		});
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Action',
			dataIndex: 'log_id',
			key: 'log_id',
			sorter: (a, b) => compare(a.log_id, b.log_id),
			sortDirection: ['ascend', 'descend'],
			width: 100,
			fixed: "left",
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Action Type',
			dataIndex: 'action_type',
			key: 'action_type',
			sorter: (a, b) => compare(a.action_type, b.action_type),
			sortDirection: ['ascend', 'descend'],
			width: 150,
			//setFilter: true
			render: action_type => {
				let color = 'default';
				let text = 'Unknown';
				switch (action_type) {
					case 'c' :
						color = 'green';
						text = 'Create';
						break;
					case 'u' :
						color = 'gold';
						text = 'Update';
						break;
					case 'd' :
						color = 'red';
						text = 'Delete';
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
			title: 'Action Name',
			dataIndex: 'actionname',
			key: 'actionname',
			sorter: (a, b) => compare(a.actionname, b.actionname),
			sortDirection: ['ascend', 'descend'],
			width: 200,
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Table',
			dataIndex: 'relationname',
			key: 'relationname',
			sorter: (a, b) => compare(a.relationname, b.relationname),
			sortDirection: ['ascend', 'descend'],
			width: 150,
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Row',
			dataIndex: 'row_id',
			key: 'row_id',
			sorter: (a, b) => compare(a.row_id, b.row_id),
			sortDirection: ['ascend', 'descend'],
			width: 100,
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Column',
			dataIndex: 'columnname',
			key: 'columnname',
			sorter: (a, b) => compare(a.columnname, b.columnname),
			sortDirection: ['ascend', 'descend'],
			width: 200,
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Column Display Name',
			dataIndex: 'displayname',
			key: 'displayname',
			sorter: (a, b) => compare(a.displayname, b.displayname),
			sortDirection: ['ascend', 'descend'],
			width: 200,
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Old Value',
			dataIndex: 'old_value',
			key: 'old_value',
			sorter: (a, b) => compare(a.old_value, b.old_value),
			sortDirection: ['ascend', 'descend'],
			width: 300,
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'New Value',
			dataIndex: 'new_value',
			key: 'new_value',
			sorter: (a, b) => compare(a.new_value, b.new_value),
			sortDirection: ['ascend', 'descend'],
			width: 300,
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'By',
			dataIndex: 'alias',
			key: 'alias',
			sorter: (a, b) => compare(a.alias, b.alias),
			sortDirection: ['ascend', 'descend'],
			fixed: "right",
			width: 130,
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'At',
			dataIndex: 'created_at',
			key: 'created_at',
			sorter: (a, b) => compare(a.created_at, b.created_at),
			sortDirection: ['ascend', 'descend'],
			fixed: "right",
			width: 200,
			ellipsis: true,
			setFilter: true
		},
	];

	// define table header
	tableHeader = (
		<>
			<ProfileOutlined />
			<strong>Logs</strong>
		</>
	)

	// handler for change page 
	handleChangePage = pagename => {
		this.setState({ spinning: true, data: [], pagename }, async () => {
			const limit = this.state.defaultPageSize;
			const offset = (this.state.defaultPage - 1) * limit;
			const filters = {
				pagename,
				created_by: this.state.created_by,
				created_on: this.state.created_on,
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

	// handler for change user
	handleChangeUser = user => {
		this.setState({ spinning: true, data: [], created_by: user }, async () => {
			const limit = this.state.defaultPageSize;
			const offset = (this.state.defaultPage - 1) * limit;
			const filters = {
				pagename: this.state.pagename,
				created_by: user,
				created_on: this.state.created_on,
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

	// handler for change date
	handleChangeDate = (date, dateString) => {
		this.setState({ spinning: true, data: [], created_on: dateString }, 
			async () => {
				const limit = this.state.defaultPageSize;
				const offset = (this.state.defaultPage - 1) * limit;
				const filters = {
					pagename: this.state.pagename,
					created_by: this.state.created_by,
					created_on: dateString,
				}
				await this.listSync({
					limit,
					offset,
					...filters,
				});
				const { entry: {row_count} } = await this.retrieveRowCount({ 
					...filters
				});
				this.setState({ 
					spinning: false, 
					rowCount: row_count, 
				});
			}
		);
	}

	// bind versions of CRUD
	config = {
		service: logService,
		retrieve: "retrieveRowCount",
		list: "list",
		dataName: "data",
	};
	retrieveRowCount = retrieveSync.bind(this, this.config);
	listSync = listSync.bind(this, this.config);

	configUser = {
		service: userService,
		list: "list",
		dataName: "temp",
	};
	listUsers = listSync.bind(this, this.configUser);

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
								Page:
							</span>
							<Select
								value={ this.state.pagename }
								onChange={ this.handleChangePage }
								style={{ marginRight: "16px", width: 150 }}
							>
								<Option value="Queries">Queries</Option>
								<Option value="Candidates">Candidates</Option>
								<Option value="Flags">Flags</Option>
								<Option value="Words">Words</Option>
								<Option value="Cases">Cases</Option>
								<Option value="Accounts">Accounts</Option>
								<Option value="Emails">Emails</Option>
								<Option value="Profiles">Profiles</Option>
								<Option value="Labels">Labels</Option>
								<Option value="Templates">Templates</Option>
								<Option value="Categories">Categories</Option>
							</Select>
							<span style={{ fontSize: "16px", marginLeft: "8px" }} >
								By:
							</span>
							<Select
								value={ this.state.created_by }
								onChange={ this.handleChangeUser }
								style={{ marginRight: "16px", width: 150 }}
							>
								<Option value="">All</Option>
								{
									this.state.users.map( item =>
										<Option
											key={ uuidv4() }
											value={ item }
										>
											{ item }
										</Option>
									)
								}
							</Select>
							<span style={{ fontSize: "16px", marginLeft: "8px" }} >
								On:
							</span>
							<DatePicker
								onChange={ this.handleChangeDate }
								style={{ marginRight: "16px", width: 150 }}
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

export { Log };
