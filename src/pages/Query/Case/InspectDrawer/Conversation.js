import React, { Component } from 'react';

// import components from ant design
import { 
	AutoComplete,
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
import { accountService } from '_services';

// import helpers
import { backend } from "_helpers";

// destructure imported components and objects
const { listSync } = backend;
const { Search } = Input;

class Conversation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for Spin
			loading: false,
			// for TableBody
			conversations: [],
			// for search
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
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: '10%',
			setFilter: true
		},
		{
			title: 'Chosen ID',
			dataIndex: 'cid_chosen_id',
			key: 'cid_chosen_id',
			width: '15%',
			setFilter: true
		},
		{
			title: 'Invitor ID',
			dataIndex: 'cid_invitor_id',
			key: 'cid_invitor_id',
			width: '15%',
			setFilter: false 
		},
		{
			title: 'Chosen Message',
			dataIndex: 'cid_chosen_message',
			key: 'cid_chosen_message',
			width: '15%',
			setFilter: false
		},
		{
			title: 'Invitor Message',
			dataIndex: 'cid_invitor_message',
			key: 'cid_invitor_message',
			width: '15%',
			setFilter: false
		},
		{
			title: 'Created At',
			dataIndex: 'created_at',
			key: 'created_at',
			width: '15%',
			setFilter: true
		},
		{
			title: 'Updated At',
			dataIndex: 'updated_at',
			key: 'updated_at',
			width: '15%',
			setFilter: true
		},
	];

	titleModal = () => (
		<Row>
			<Col span={ 8 }>
				Search Conversations
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
			
		this.setState({ loading: true });
		const response = await this.listConversations({candidate_id: candidateId});
		if (response.code === 200)
			message.success("Conversations found");
		else {
			message.info("Conversation not found");
			this.setState({ conversations: [] });
		}
		this.setState({ loading: false });
	}

	// handler for click close
	onCancel = event => {
		this.setState({ 
			conversations: [],
			candidateId: "",
		});
		this.props.onCancel();
	}

	// bind versions of CRUD
	configConversation = {
		service: accountService,
		list: "retrieveConversation",
		dataName: "conversations",
	};
	listConversations = listSync.bind(this, this.configConversation);

	render(){
		return (
			<div className="Conversation">
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
									data={ this.state.conversations }
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

export default Conversation;
