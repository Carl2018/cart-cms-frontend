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
	Space,
	Spin,
	message,
} from 'antd';

// import shared and child components
import { TableBody } from '_components'

// import services
import { accountService } from '_services';

// import helpers
import { backend } from "_helpers";

// destructure imported components and objects
const { listSync } = backend;
const { Search } = Input;

class Flag extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for Spin
			loading: false,
			// for TableBody
			flags: [],
			// for search
			interval: 1,
			remarks: "",
			reporterId: "",
			suspectId: "",
			// for AutoComplete
			open: false,
			options: [],
			// for pagination
			currentPage: 0,
			pageSize: 10,
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
			setFilter: true
		},
		{
			title: 'Remarks',
			dataIndex: 'remarks',
			key: 'remarks',
			width: '20%',
			setFilter: true
		},
		{
			title: 'Flag Type',
			dataIndex: 'flag_type',
			key: 'flag_type',
			width: '15%',
			setFilter: false 
		},
		{
			title: 'Flag Category',
			dataIndex: 'flag_category',
			key: 'flag_category',
			width: '15%',
			setFilter: false
		},
		{
			title: 'Created At',
			dataIndex: 'timestamp',
			key: 'timestamp',
			width: '20%',
			setFilter: true
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
			suspect: suspectId, 
			reporter: reporterId, 
			remarks, 
			interval,
			page: this.state.currentPage,
			items_per_page: this.state.pageSize,
		});
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


	// handler for click close
	onCancel = event => {
		this.setState({ 
			flags: [],
			interval: 1,
			remarks: "",
			reporterId: "",
			suspectId: "",
		});
		this.props.onCancel();
	}

	// bind versions of CRUD
	configFlag = {
		service: accountService,
		list: "retrieveFlag",
		dataName: "flags",
	};
	listFlags = listSync.bind(this, this.configFlag);

	render(){
		return (
			<div className="Flag">
				<Modal
					key={ this.props.modalKey }
					title={ this.titleModal() }
					width={ 1000 }
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
								style={{ width: 500 }}
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
									style={{ width: 300 }}
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
									pageSizeOptions={ [10, 20, 50] }
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
