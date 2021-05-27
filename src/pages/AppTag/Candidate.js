import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	Modal,
	Select,
	Space,
	Spin,
	Tag,
} from 'antd';
import { IdcardOutlined } from '@ant-design/icons';

// import shared and child components
import { TableWrapper } from '../Candidate/TableWrapper'

// import services
import { candidateService } from '_services';

// import helpers
import { backend, helpers } from "_helpers";

// destructure imported components and objects
const { updateSync } = backend;
const { compare } = helpers;
const { Option } = Select;

class Candidate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
			spinning: false,
			cache: 'hk',
			// pagination
			pagination: false,
			currentPage: 1,
			pageSize: 10,
			total: 5000,
		};
	}
	
	componentDidMount() {
	}

	componentDidUpdate(prevProps) {
		const { tagId } = this.props;
		if(prevProps.tagId !== tagId) {
			this.setState({ spinning: true }, async () => {
				this.props.searchCandidatesByTagSync({
					currentPage: 1, 
					pageSize: this.props.pageSizeCandidate, 
					tagId, 
				});
				this.setState({ 
					spinning: false,
				});
			});
		}
	}

	// for related email panel
	columns = [
		{
			title: 'Candidate ID',
			dataIndex: 'candidate_id',
			key: 'candidate_id',
			width: '20%',
			sorter: (a, b) => compare(a.candidate_id, b.candidate_id),
			setFilter: true
		},
		{
			title: 'Active',
			dataIndex: 'is_active',
			key: 'is_active',
			width: '20%',
			sorter: (a, b) => compare(a.is_active, b.is_active),
			// setFilter: true
			render: is_active => {
				let color = 'lime';
				let text = 'No';
				switch (is_active) {
					case 1 :
						color = 'red';
						text = 'Yes';
						break;
					default:
						color = 'lime';
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
			title: 'Message',
			dataIndex: 'message',
			key: 'message',
			width: '40%',
			sorter: (a, b) => compare(a.message, b.message),
			setFilter: true
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Blacklist Type',
			name: 'blacklist_type',
			rules: [
				{
					required: true,
					message: 'Blacklist type cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Select>
					<Option value="E">Registration</Option>
					<Option value="U">Device</Option>
				</Select>
			)
		},
	];

	// define table header
	titleModal = () => { return ( 
		<Space>
			<IdcardOutlined />
			<strong>{ `Candidates with Tag ${this.props.tag}` }</strong>
		</Space>
	); }

	// handler for pagination
	handleChangePage = async (page, pageSize) => {
		this.setState({ spinning: true }, async () => {
			await this.props.searchCandidatesByTagSync({
				currentPage: page, 
				pageSize: pageSize, 
				tagId: this.props.tagId, 
			});
			this.setState({ 
				spinning: false,
			});
		});
	}

	// bind versions of CRUD
	config = {
		service: candidateService,
		retrieve: "retrieve",
		list: "list",
		update: "ban",
		dataName: "data",
	};
	ban = updateSync.bind(this, this.config);
	softBanSync = async record => {
		const body = {
			candidate_id: record.id,
			ban_type: "S",
			cache: this.state.cache,
		}
		await this.ban(record.id, body);
	}
	hardBanSync = async record => {
		const body = {
			candidate_id: record.id,
			ban_type: "H",
			cache: this.state.cache,
		}
		await this.ban(record.id, body);
	}
	blacklistSync = async (id, record) => {
		const body = {
			candidate_id: id,
			ban_type: "B",
			blacklist_type: record.blacklist_type,
			cache: this.state.cache,
		}
		await this.ban(id, body);
	}

	render(){
		return (
			<div className="Candidate">
				<Modal
					key={ this.props.modalKey }
					title={ this.titleModal() }
					width={ 1200 }
					style={{ top: 20 }}
					bodyStyle={{ minHeight: 600, overflow: "auto" }}
					visible={ this.props.visible }
					onCancel={ this.props.onClose }
					footer={ null }
				>
					<Spin spinning={ this.state.spinning }>
						<TableWrapper
							key={ this.state.tableWrapperKey }
							// data props
							isSmall={ true }
							noFilter={ true }
							data={ this.props.dataCandidate ? this.props.dataCandidate : [] }
							pagination={ {
								pageSizeOptions: [10, 25, 50, 100], 
								pageSize: this.props.pageSizeCandidate,
								current: this.props.currentPageCandidate,
								total: this.props.candCount,
								onChange: this.handleChangePage
							} }
							// display props
							columns={ this.columns }
							formItems={ this.formItems }
							drawerTitle='A Candidate'
							showDropdown={ false }
							// api props
							softBanSync={ this.softBanSync }
							hardBanSync={ this.hardBanSync }
							blacklistSync={ this.blacklistSync }
							onChangeSize={ this.handleChangePage }
						>
						</TableWrapper>
					</Spin>
				</Modal>
			</div>
		);
	}
}

export { Candidate };
