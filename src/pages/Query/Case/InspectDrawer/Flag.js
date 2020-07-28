import React, { Component } from 'react';

// import components from ant design
import { 
	Card,
	Col,
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
import { caseService } from '_services';

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
			interval: "",
			candidateId: "",
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

	handleChange= event=> this.setState({ interval: event.target.value });

	handleSearch = async value => {
		const interval = this.state.interval;
		const candidateId = value;
		if (!isFinite(interval)) {
			message.error("Days should be a number");
			return;
		}
		if (!isFinite(candidateId)) {
			message.error("Candidate ID should be a number");
			return;
		}
			
		this.setState({ loading: true });
		const response = await this.listFlags({candidate_id: candidateId, interval});
		if (response.code === 200)
			message.info("Flags found");
		else {
			message.success("The account is free from flags for this interval");
			this.setState({ flags: [] });
		}
		this.setState({ loading: false });
	}

	// handler for click close
	onCancel = event => {
		this.setState({ 
			flags: [],
			interval: "",
			candidateId: "",
		});
		this.props.onCancel();
	}

	// bind versions of CRUD
	configFlag = {
		service: caseService,
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
					<Card>
						<div
							style={{ margin: "16px 4px" }}
						>
							<Space size="middle" >
								<Input.Group compact>
									<Input
										placeholder="Interval in Days"
										onChange={ this.handleChange }
										style={{ width: 160 }}
									/>
									<Search
										placeholder="Candidate ID"
										onSearch={ this.handleSearch }
										style={{ width: 200 }}
									/>
								</Input.Group>
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
					</Card>
				</Modal>
			</div>
		);
	}
}

export default Flag;
