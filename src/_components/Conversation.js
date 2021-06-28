import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	AutoComplete,
	Button,
	Col,
	Input,
	Modal,
	Row,
	Select,
	Space,
	Spin,
	Tag,
	message,
} from 'antd';
import { FileTextOutlined, DownloadOutlined } from '@ant-design/icons';
// import shared and child components
import { TableBody } from '_components'
import { Content } from './Content'

// import services
import { conversationService } from '_services';

// import helpers
import { backend, helpers } from "_helpers";

// destructure imported components and objects
const { listSync } = backend;
const { compare, toDatetime } = helpers;
const { Search } = Input;
const { Option } = Select;

class Conversation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for Spin
			loading: false,
			// for TableBody
			conversations: [],
			// for search
			db: "ea",
			candidateId: "",
			// for AutoComplete
			open: false,
			options: [],
			// for content modal
			loadingContent: false,
			modalKeyContent: Date.now(),
			visibleContent: false,
			contents: [],
			record: {},
			// for pagination of content modal
			currentPage: 1,
			pageSize: 25,
			total: 5000,
		};
	}
	
	componentDidMount() {
	}

	// for related email panel
	columns = [
		{
			title: 'Conversation ID',
			dataIndex: 'id',
			key: 'id',
			fixed: 'left',
			width: 150,
			sorter: (a, b) => compare(a.id, b.id),
			setFilter: true
		},
		{
			title: 'Invitor ID',
			dataIndex: 'cid_invitor_id',
			key: 'cid_invitor_id',
			width: 150,
			sorter: (a, b) => compare(a.cid_chosen_id, b.cid_chosen_id),
			setFilter: true 
		},
		{
			title: 'Chosen ID',
			dataIndex: 'cid_chosen_id',
			key: 'cid_chosen_id',
			width: 150,
			sorter: (a, b) => compare(a.cid_chosen_id, b.cid_chosen_id),
			setFilter: true,
		},
		{
			title: 'Closed',
			dataIndex: 'isClosed',
			key: 'isClosed',
			width: 150,
			sorter: (a, b) => compare(a.isClosed, b.isClosed),
			// setFilter: true,
			render: isClosed => {
				let color = 'default';
				let text = 'No';
				switch (isClosed) {
					case 1 :
						color = 'blue';
						text = 'Yes';
						break;
					case 0 :
						color = 'default';
						text = 'No';
						break;
					default:
						color = 'default';
						text = 'No';
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
			title: 'Absent',
			dataIndex: 'is_invitor_deleted',
			key: 'is_invitor_deleted',
			width: 150,
			// sorter: (a, b) => compare(a.is_invitor_deleted, b.is_invitor_deleted),
			// setFilter: true,
			render: (temp, record) => {
				const { is_invitor_deleted, is_chosen_deleted } = record;
				console.log(is_invitor_deleted);
				console.log(is_chosen_deleted);
				let color = 'default';
				let text = 'No';
				if (is_invitor_deleted && is_chosen_deleted) {
					text = 'Both';
					color = 'red';
				} else if (is_invitor_deleted ) {
					text = 'Invitor';
					color = 'geekblue';
				} else if (is_chosen_deleted) {
					text = 'Chosen';
					color = 'purple';
				} else {
					text = 'None';
					color = 'cyan';
				}
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ text }
					</Tag>
				);
			},
		},
		{
			title: 'Chosen Message',
			dataIndex: 'cid_chosen_message',
			key: 'cid_chosen_message',
			width: 200,
			sorter: (a, b) => compare(a.cid_chosen_message, b.cid_chosen_message),
			setFilter: true 
		},
		{
			title: 'Invitor Message',
			dataIndex: 'cid_invitor_message',
			key: 'cid_invitor_message',
			width: 200,
			sorter: (a, b) => compare(a.cid_invitor_message, b.cid_invitor_message),
			setFilter: true
		},
		{
			title: 'Start Date',
			dataIndex: 'created_at',
			key: 'created_at',
			width: 150,
			sorter: (a, b) => compare(a.created_at, b.created_at),
			render: timestring => (<>{ toDatetime( Date.parse(timestring) ) }</>),
			// setFilter: true
		},
		{
			title: 'End Date',
			dataIndex: 'updated_at',
			key: 'updated_at',
			width: 150,
			sorter: (a, b) => compare(a.updated_at, b.updated_at),
			// setFilter: true
			render: (updated_at, record) => {
				const { isClosed } = record;
				const endDate = isClosed ? toDatetime( Date.parse(updated_at) ) : "N/A";
				return (<>{ endDate }</>);
			}
		},
		{
			title: 'Actions',
			key: 'action',
			render: (text, record) => (
				<Space size='small'>
					<Button 
						type='link' 
						icon={ <FileTextOutlined /> }
						onClick={ this.handleClickView.bind(this, record) }
					>
						View
					</Button>
					<Button 
						type="primary" 
						icon={<DownloadOutlined />} 
						onClick={ this.handleClickPdfExport.bind(this, record) }
						size="small"
					>
					</Button>
				</Space>
			),
			fixed: 'right',
			width: 150,
			setFilter: false
		},
	];

	titleModal = () => (
		<Row>
			<Col span={ 8 }>
				Search Conversations
			</Col>
		</Row>	
	)

	getOptions = () => { return [ { value: this.props.candidateId } ] };

	handleChangeOption = data => {
		this.setState({ 
			open: true,
			options: this.getOptions(),
		});
	}

	handleSearch = async value => {
		const candidateId = value;
		const db = this.state.db;
		if (!isFinite(candidateId)) {
			message.error("Candidate ID should be a number");
			return;
		}
			
		this.setState({ loading: true });
		const response = await this.listConversations({
			db,
			candidate_id: candidateId,
		});
		if (response.code === 200)
			message.success("Conversations found");
		else {
			message.info("Conversation not found");
			this.setState({ conversations: [] });
		}
		this.setState({ loading: false });
	}

	// handler for database change
	handleChangeDb = db => {
		this.setState({ 
			db, 
			conversations: [],
			candidateId: "",
		});
	}

	// handlers for actions in TableBody
	handleClickView = record => {
		this.setState({ loading: true }, async () => {
			const params = {
				db: this.state.db,
				conversation_id: record.id,
				page: this.state.currentPage,
				item_per_page: this.state.pageSize,
			}
			await this.listContents(params);

			this.setState({ 
				record,
				loading: false,
				visibleContent: true,
			});
		});
	}

	// handlers for pagiantion of content modal
	handleChangePage = async (page, size) => {
		if (this.state.pageSize === size) {
			this.setState({ currentPage: page });
		} else {
			page = 1;
			this.setState({ 
				currentPage: page,
				pageSize: size, 
			});
		}
		const item_per_page = size;
			
		this.setState({ loadingContent: true });
		const params = {
			db: this.state.db,
			conversation_id: this.state.record.id,
			page,
			item_per_page,
		}
		await this.listContents(params);
		this.setState({ loadingContent: false });
	}

	handleClickPdfExport = (record) => {
		const params = {
			db: this.state.db,
			conversation_id: record.id,
			page: 1,
			item_per_page: 1000000,
			title: `ChatRecord-${record.id}`
		}
		this.setState( { loading: true }, async () => {
			await this.downloadContents(params)
			this.setState({ loading: false })
		});
		
		;
	}

	// handler for close content modal
	handleCloseContent = event => {
		this.setState({
			visibleContent: false,
			modalKeyContent: Date.now(),
			contents: [],
			record: {},
			currentPage: 1,
			pageSize: 10,
		});
	}

	// handler for click close
	onCancel = event => {
		this.setState({ 
			db: "ea",
			conversations: [],
			candidateId: "",
		});
		this.props.onCancel();
	}

	// bind versions of CRUD
	configConversation = {
		service: conversationService,
		list: "list",
		dataName: "conversations",
	};
	listConversations = listSync.bind(this, this.configConversation);
	configContent = {
		service: conversationService,
		list: "listContent",
		dataName: "contents",
	};
	listContents = listSync.bind(this, this.configContent);

	configDownloadContent = {
		service: conversationService,
		list: "downloadContent",
		dataName: "tempt",
	};
	downloadContents = listSync.bind(this, this.configDownloadContent);

	render(){
		return (
			<div className="Conversation">
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
									defaultValue={ this.props.candidateId }
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
									size={ "small" }
									scroll={ {x:2000} }
								/>
							</div>
						</Spin>
					</div>
				</Modal>
				<div>
					<Content
						data={ this.state.contents }
						loading={ this.state.loadingContent }
						modalKey={ this.state.modalKeyContent }
						visible={ this.state.visibleContent }
						onCancel={ this.handleCloseContent }
						currentPage={ this.state.currentPage }
						pageSize={ this.state.pageSize }
						total={ this.state.total }
						onChangePage={ this.handleChangePage }
					>
					</Content>
				</div>
			</div>
		);
	}
}

export { Conversation };
