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

class LoginLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for Spin
			spinning: false,
			// for TableBody
			loginLogs: [],
			// for search
			db: "ea",
			candidateId: "",
			// for AutoComplete
			open: false,
			options: [],
			// pagination
			currentPage: 1,
			pageSize: 10,
			total: 10,
		};
	}
	
	componentDidMount() {
	}

	componentDidUpdate(prevProps) {
		const { visible, dataAccount } = this.props;
		const { currentPage, pageSize } = this.state;
		if(prevProps.visible !== visible && visible && dataAccount) {
			const { db, candidate_id: candidateId } = dataAccount;
			this.setState({ db, candidateId }, async () => {
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
			width: '10%',
			sorter: (a, b) => compare(a.id, b.id),
			setFilter: true
		},
		{
			title: 'Platform',
			dataIndex: 'platform',
			key: 'platform',
			wplatformth: '10%',
			sorter: (a, b) => compare(a.platform, b.platform),
			setFilter: true,
		},
		{
			title: 'Device',
			dataIndex: 'device_model',
			key: 'device_model',
			wdevice_modelth: '10%',
			sorter: (a, b) => compare(a.device_model, b.device_model),
			setFilter: true,
		},
		{
			title: 'OS',
			dataIndex: 'operating_system',
			key: 'operating_system',
			woperating_systemth: '10%',
			sorter: (a, b) => compare(a.operating_system, b.operating_system),
			setFilter: true,
		},
		{
			title: 'Time',
			dataIndex: 'updated_at',
			key: 'updated_at',
			wupdated_atth: '10%',
			sorter: (a, b) => compare(a.updated_at, b.updated_at),
			// setFilter: true,
			render: updated_at => toDatetime(updated_at),
		},
	];

	titleModal = () => (
		<Row>
			<Col span={ 8 }>
				Search Login Logs
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
	handleChangeDb = db => this.setState({ db });

	// handler for click close
	onCancel = event => {
		this.setState({ 
			db: "ea",
			loginLogs: [],
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
		retrieve: "retrieveLoginLogRowCount",
		list: "listLoginLogs",
		dataName: "loginLogs",
	};
	retrieveRowCount = retrieveSync.bind(this, this.config);
	retrieveRowCountSync =  async () => {
		const { entry: {row_count} } = await this.retrieveRowCount({ 
			db: this.state.db, 
			candidate_id: this.state.candidateId,
		});
		this.setState({ total: row_count });
	}
	list = listSync.bind(this, this.config);
	listSync = ({currentPage=1, pageSize=10}) => {
		// wrap the logic with Promise to allow await statement
		return new Promise(function (resolve) {
			this.setState( { spinning: true }, async () => {
				const limit = pageSize;
				const offset = (currentPage - 1)*limit;
				let { code, entry: loginLogs } = await this.list({ 
					db: this.state.db, 
					candidate_id: this.state.candidateId,
					offset,
					limit,
				});
				if (code === 200) {
					if (currentPage === 1)
						message.success("Invitations found");
				} else {
					message.info("Login Logs not found");
					loginLogs = [];
				}
				this.setState({ 
					currentPage,
					pageSize,
					loginLogs, 
					spinning: false 
				});
				resolve(1);
			});
		}.bind(this));
	}

	render(){
		return (
			<div className="LoginLog">
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
									Database:
								</span>
								<Select
									value={ this.state.db }
									onChange={ this.handleChangeDb }
									style={{ width: 100 }}
								>
									<Option value="ea">Asia</Option>
									<Option value="na">NA</Option>
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
									columns={ this.columns } 
									data={ this.state.loginLogs }
									isSmall={ true }
									pagination={{
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

export default LoginLog;
