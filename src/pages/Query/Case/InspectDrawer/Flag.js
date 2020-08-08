import React, { Component } from 'react';

// import components from ant design
import { 
	AutoComplete,
	Col,
	InputNumber,
	Input,
	Modal,
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
			candidateId: "",
			// for AutoComplete
			open: false,
			options: [],
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
			open: true,
			options: this.getOptions(),
		});
	}

	handleChange = value => {
		if (!isFinite(value)) {
			message.error("Days should be a number");
			this.setState({ interval: 1 });
			return;
		}
		this.setState({ interval: Math.round(value) });
	}

	handleSearch = async value => {
		const interval = this.state.interval;
		const candidateId = value;
		if (!isFinite(candidateId)) {
			message.error("Candidate ID should be a number");
			return;
		}
			
		this.setState({ loading: true });
		const response = await this.listFlags({candidate_id: candidateId, interval});
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
			candidateId: "",
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
						<Space size="middle" >
								<span>
									Interval(days):
								</span>
								<InputNumber
									placeholder="Interval in Days"
									onChange={ this.handleChange }
									value={ this.state.interval }
									style={{ width: 160 }}
									min={ 1 }
								/>
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
						<Spin spinning={ this.state.loading }>
							<div>
								<TableBody
									columns={ this.columns } 
									data={ this.state.flags }
									isSmall={ true }
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
