import React, { Component } from 'react';

// import components from ant design
import { 
	AutoComplete,
	Col,
	Input,
	Modal,
	Row,
	Select,
	Space,
	Spin,
	message,
} from 'antd';

// import shared and child components
import { TableBody } from '_components'

// import services
import { candidateService } from '_services';

// import helpers
import { backend, helpers } from "_helpers";

// destructure imported components and objects
const { retrieveSync, listSync } = backend;
const { compare, toDatetime } = helpers;
const { Search } = Input;
const { Option } = Select;

class RedisLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for Spin
			spinning: false,
			// for TableBody
			redisLogs: [],
			// for search
			category: 0,
			candidateId: "",
			// for AutoComplete
			open: false,
			options: [],
			// pagination
			currentPage: 1,
			pageSize: 25,
			total: 10,
		};
	}
	
	componentDidMount() {
	}

	componentDidUpdate(prevProps) {
		const { visible, dataAccount } = this.props;
		const { currentPage, pageSize } = this.state;
		if(prevProps.visible !== visible && visible && dataAccount) {
			const { candidate_id: candidateId } = dataAccount;
			this.setState({ candidateId }, async () => {
				await this.listSync({ currentPage, pageSize });
				await this.retrieveRowCountSync();
			});
		}
	}

	// for related email panel
	columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: '20%',
			sorter: (a, b) => compare(a.id, b.id),
			setFilter: true
		},
	];

	columnsExposure = [
		{
			title: 'Count',
			dataIndex: 'value',
			key: 'value',
			wvalueth: '40%',
			sorter: (a, b) => compare(a.value, b.value),
			// setFilter: true,
			render: value => Math.trunc(value),
		},
		{
			title: 'Timestamp',
			dataIndex: 'time',
			key: 'time',
			wtimeth: '40%',
			sorter: (a, b) => compare(a.time, b.time),
			// setFilter: true,
			render: time => toDatetime(time),
		},
	];
	columnsSweet = [
		{
			title: 'Score',
			dataIndex: 'value',
			key: 'value',
			wvalueth: '40%',
			sorter: (a, b) => compare(a.value, b.value),
			// setFilter: true,
			render: value => Math.trunc(value),
		},
		{
			title: 'Timestamp',
			dataIndex: 'time',
			key: 'time',
			wtimeth: '40%',
			sorter: (a, b) => compare(a.time, b.time),
			// setFilter: true,
			render: time => toDatetime(time),
		},
	];
	columnsScam = [
		{
			title: 'Timestamp',
			dataIndex: 'value',
			key: 'value',
			wvalueth: '80%',
			sorter: (a, b) => compare(a.value, b.value),
			// setFilter: true,
			render: value => toDatetime(value*1000),
		}
	];
		
	titleModal = () => (
		<Row>
			<Col span={ 8 }>
				Search Redis Logs
			</Col>
		</Row>	
	)

	getOptions = () => {
		const options = this.props.allRelatedAccounts.map( item => {
			return { value: item.candidate_id };
		});
		return options;
	}

	handleChangeOption = data => {
		this.setState({ 
			open: true,
			options: this.getOptions(),
		});
	}

	handleSearch = async value => {
		const candidateId = value;
		if (!isFinite(candidateId)) {
			message.error("Candidate ID should be a number");
			return;
		}
			
		this.setState({ candidateId }, async () => {
			await this.listSync({ currentPage: 1, pageSize: 10 });
			await this.retrieveRowCountSync();
		});
	}

	// handler for database change
	handleChangeCategory = category => this.setState({ category, redisLogs: [] });

	// handler for click close
	onCancel = event => {
		this.setState({ 
			category: 0,
			redisLogs: [],
			candidateId: "",
		});
		this.props.onCancel();
	}

	// handler for pagination
	handleChangePage = async (page, pageSize) =>
		await this.listSync({ currentPage: page, pageSize: pageSize });

	// bind versions of CRUD
	config = {
		service: candidateService,
		retrieve: "retrieveRedisLogRowCount",
		list: "listRedisLogs",
		dataName: "redisLogs",
	};
	retrieveRowCount = retrieveSync.bind(this, this.config);
	retrieveRowCountSync =  async () => {
		const { entry: {row_count} } = await this.retrieveRowCount({ 
			category: this.state.category, 
			candidate_id: this.state.candidateId,
		});
		this.setState({ total: row_count });
	}
	list = listSync.bind(this, this.config);
	listSync = ({currentPage=1, pageSize=25}) => {
		// wrap the logic with Promise to allow await statement
		return new Promise(function (resolve) {
			this.setState( { spinning: true }, async () => {
				const limit = pageSize;
				const offset = (currentPage - 1)*limit;
				let { code, entry: redisLogs } = await this.list({ 
					category: this.state.category, 
					candidate_id: this.state.candidateId,
					offset,
					limit,
				});
				if (code === 200) {
					if (currentPage === 1)
						message.success("Redis Logs found");
				} else {
					message.info("Redis Logs not found");
					redisLogs = [];
				}
				this.setState({ 
					currentPage,
					pageSize,
					redisLogs,
					spinning: false 
				});
				resolve(1);
			});
		}.bind(this));
	}

	render(){
		let columns = this.columns;
		const { category } = this.state;
		if (category === 0)
			columns = [...columns, ...this.columnsExposure];
		else if (category === 1)
			columns = [...columns, ...this.columnsSweet];
		if (category === 2)
			columns = [...columns, ...this.columnsScam];

		return (
			<div className="RedisLog">
				<Modal
					key={ this.props.modalKey }
					title={ this.titleModal() }
					width={ 1300 }
					style={{ top: 20 }}
					bodyStyle={{ minHeight: 600, overflow: "auto" }}
					visible={ this.props.visible }
					onCancel={ this.onCancel }
					footer={ null }
				>
					<div
						style={{ margin: "0px 4px 32px 4px" }}
					>
						<Space size="middle" >
								<span>
									Type:
								</span>
								<Select
									value={ this.state.category }
									onChange={ this.handleChangeCategory }
									style={{ width: 200 }}
								>
									<Option value={ 0 }>Exposure</Option>
									<Option value={ 1 }>Sweet</Option>
									<Option value={ 2 }>Scam</Option>
								</Select>
								<span>
									Candidate ID:
								</span>
								<AutoComplete
									options={ this.state.options }
									defaultValue={ this.props.dataAccount?.candidate_id }
									open={ this.state.open }
									onFocus={ this.handleChangeOption.bind(this, "") }
									onBlur ={ () => this.setState({ open: false }) }
									onChange ={ this.handleChangeOption }
								>
									<Search
										placeholder="Candidate ID"
										onSearch={ data => {
											this.setState({ open: false }, 
												() => this.handleSearch(data));
										}}
										style={{ width: 200 }}
									/>
								</AutoComplete>
						</Space>
					</div>
					<div>
						<Spin spinning={ this.state.spinning }>
							<div>
								<TableBody
									columns={ columns } 
									data={ this.state.redisLogs }
									size={ "small" }
									pagination={{
										showQuickJumper: true,
										showSizeChanger: true,
										pageSizeOptions: [10, 25, 50, 100], 
										pageSize: this.state.pageSize,
										current: this.state.currentPage,
										total: this.state.total,
										onChange: this.handleChangePage
									}}
								/>
							</div>
						</Spin>
					</div>
				</Modal>
			</div>
		);
	}
}

export default RedisLog;
