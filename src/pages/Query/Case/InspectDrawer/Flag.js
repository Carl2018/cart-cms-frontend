import React, { Component } from 'react';

// import components from ant design
import { 
	AutoComplete,
	Col,
	InputNumber,
	Input,
	Modal,
	Pagination, 
	Row,
	Select,
	Space,
	Spin,
	message,
} from 'antd';

// import shared and child components
import { TableBody } from '_components'

// import services
import { flagService } from '_services';

// import helpers
import { backend, helpers } from "_helpers";

// destructure imported components and objects
const { listSync } = backend;
const { compare, toDatetime } = helpers;
const { Search } = Input;
const { Option } = Select;

class Flag extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for Spin
			loading: false,
			// for TableBody
			flags: [],
			// for search
			db: "ea",
			interval: 1,
			remarks: "",
			reporterId: "",
			suspectId: "",
			// for AutoComplete
			open: false,
			options: [],
			// for pagination
			currentPage: 1,
			//pageSize: 10,
			pageSize: 500,
			total: 5000,
		};
	}
	
	componentDidMount() {
	}

	// for related email panel
	columns = [
		{
			title: 'Suspect Message',
			dataIndex: 'suspect_message',
			key: 'suspect_message',
			width: '30%',
			sorter: (a, b) => compare(a.id, b.id),
			setFilter: true
		},
		{
			title: 'Remarks',
			dataIndex: 'remarks',
			key: 'remarks',
			width: '20%',
			sorter: (a, b) => compare(a.remarks, b.remarks),
			setFilter: true
		},
		{
			title: 'Flag Type',
			dataIndex: 'flag_type',
			key: 'flag_type',
			width: '15%',
			sorter: (a, b) => compare(a.flag_type, b.flag_type),
			setFilter: true 
		},
		{
			title: 'Flag Category',
			dataIndex: 'flag_category',
			key: 'flag_category',
			width: '15%',
			sorter: (a, b) => compare(a.flag_category, b.flag_category),
			setFilter: true
		},
		{
			title: 'Created At',
			dataIndex: 'timestamp',
			key: 'timestamp',
			width: '20%',
			sorter: (a, b) => compare(a.created_at, b.created_at),
			render: timestring => (<>{ toDatetime( Date.parse(timestring) ) }</>),
			// setFilter: true
		},
	];

	titleModal = () => (
		<Row>
			<Col span={ 8 }>
				Search Flags
			</Col>
		</Row>	
	)

	getOptions = () => {
		const options = this.props.allRelatedAccounts.map( item => {
			return { value: item.candidate_id };
		});
		return options;
	}

	// handler for filters and search
	handleChangeOption = data => {
		this.setState({ 
			suspectId: data,
			open: true,
			options: this.getOptions(),
		});
	}

	handleChangeInterval = value => {
		if (!isFinite(value)) {
			message.error("Hours should be a number");
			this.setState({ interval: 1 });
			return;
		}
		this.setState({ interval: Math.round(value) });
	}

	handleChangeRemarks = event => this.setState({ remarks: event.target.value });

	handleChangeReporterId = event => this.setState({ reporterId: event.target.value });

	handleSearch = async value => {
		const db = this.state.db;
		const interval = this.state.interval;
		const suspectId = value;
		const reporterId = this.state.reporterId;
		const remarks = this.state.remarks;
		if (!isFinite(reporterId)) {
			message.error("Reporter ID should be a number");
			return;
		}
			
		if (!isFinite(suspectId)) {
			message.error("Suspect ID should be a number");
			return;
		}
			
		this.setState({ loading: true });
		const response = await this.listFlags({
			db, 
			suspect: suspectId, 
			reporter: reporterId, 
			remarks, 
			interval,
			page: 0,
			items_per_page: this.state.pageSize,
		});
		this.setState({ currentPage: 1, suspectId: value });
		if (response.code === 200)
			message.info("Flags found");
		else {
			message.success("The account has not been reported for this interval");
			this.setState({ flags: [] });
		}
		this.setState({ loading: false });
	}

	// handlers for pagiantion
	handleChangePage = async (page, size) => {
		const suspectId = this.state.suspectId;
		if (!isFinite(suspectId)) {
			message.error("Suspect ID should be a number");
			return;
		}
		const reporterId = this.state.reporterId;
		if (!isFinite(reporterId)) {
			message.error("Reporter ID should be a number");
			return;
		}
		const db = this.state.db;
		const remarks = this.state.remarks;
		const interval = this.state.interval;
		if (this.state.pageSize === size) {
			page = page - 1;
			this.setState({ currentPage: page + 1 });
		} else {
			page = 0;
			this.setState({ 
				currentPage: page + 1,
				pageSize: size, 
			});
		}
		const items_per_page = size;
			
		this.setState({ loading: true });
		const response = await this.listFlags({
			db, 
			suspect: suspectId, 
			reporter: reporterId, 
			remarks, 
			interval,
			page,
			items_per_page,
		});
		if (response.code === 200)
			message.info("Flags found");
		else {
			message.success("The account has not been reported for this interval");
			this.setState({ flags: [] });
		}
		this.setState({ loading: false });
	}

	// handler for database change
	handleChangeDb = db => {
		this.setState({ 
			db, 
			interval: 1,
			remarks: "",
			reporterId: "",
			suspectId: "",
			currentPage: 1, 
			pageSize: 10, 
			flags: [],
		});
	}

	// handler for click close
	onCancel = event => {
		this.setState({ 
			flags: [],
			interval: 1,
			db: "ea",
			remarks: "",
			reporterId: "",
			suspectId: "",
		});
		this.props.onCancel();
	}

	// bind versions of CRUD
	configFlag = {
		service: flagService,
		list: "search",
		dataName: "flags",
	};
	listFlags = listSync.bind(this, this.configFlag);

	render(){
		return (
			<div className="Flag">
				<Modal
					key={ this.props.modalKey }
					title={ this.titleModal() }
					width={ 1200 }
					style={{ top: 20 }}
					bodyStyle={{ minHeight: 600, overflow: "auto" }}
					visible={ this.props.visible }
					onCancel={ this.onCancel }
					footer={ null }
				>
					<div
						style={{ margin: "0px 4px 32px 4px" }}
					>
						<Space size="large" >
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
								Interval(hours):
							</span>
							<InputNumber
								placeholder="Interval in Hours"
								onChange={ this.handleChangeInterval }
								value={ this.state.interval }
								style={{ width: 100 }}
								min={ 1 }
							/>
							<span>
								Remarks:
							</span>
							<Input
								placeholder="Remarks"
								onChange={ this.handleChangeRemarks }
								value={ this.state.remarks }
								style={{ width: 300 }}
								min={ 1 }
							/>
						</Space>
					</div>
					<div
						style={{ margin: "0px 4px 32px 4px" }}
					>
						<Space size="large" >
							<span>
								Reporter ID:
							</span>
							<Input
								placeholder="Reporter ID"
								onChange={ this.handleChangeReporterId }
								value={ this.state.reporterId }
								style={{ width: 300 }}
								min={ 1 }
							/>
							<span>
								Suspect ID:
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
									placeholder="Suspect ID"
									onSearch={ data => {
										this.setState({ open: false }, 
											() => this.handleSearch(data));
									}}
									style={{ width: 320 }}
								/>
							</AutoComplete>
						</Space>
					</div>
					<div>
						<Spin spinning={ this.state.loading }>
							<div>
								<TableBody
									columns={ this.columns } 
									data={ this.state.flags }
									isSmall={ true }
									pagination={ false }
								/>
							</div>
							<div style={{marginTop: "16px", textAlign: "right" }} >
								<Pagination
									showSizeChanger
									showQuickJumper
									current={ this.state.currentPage }
									pageSize={ this.state.pageSize }
									//pageSizeOptions={ [10, 20, 50] }
									pageSizeOptions={ [500, 600, 700, 800, 900, 1000] }
									total={ this.state.total }
									onChange={ this.handleChangePage }
									onShowSizeChange={ this.handleChangePage }
								/>
							</div>
						</Spin>
					</div>
				</Modal>
			</div>
		);
	}
}

export default Flag;
