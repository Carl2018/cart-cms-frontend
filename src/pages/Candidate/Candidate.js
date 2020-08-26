import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	Select,
	Spin,
	Tag,
} from 'antd';
import { IdcardOutlined } from '@ant-design/icons';

// import shared and child components
import { TableWrapper } from './TableWrapper'

// import services
import { accountService } from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { listSync, updateSync } = backend;
const { compare, toDatetime } = helpers;
const { Option } = Select;

class Candidate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
			spinning: false,
		};
	}
	
	componentDidMount() {
		this.setState({ spinning: true }, async () => {
			await this.listSync();
			this.setState({ spinning: false });
		});
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Candidate ID',
			dataIndex: 'id',
			key: 'id',
			sorter: (a, b) => compare(a.id, b.id),
			sortDirection: ['ascend', 'descend'],
			width: '15%',
			setFilter: true
		},
		{
			title: 'Message',
			dataIndex: 'message',
			key: 'message',
			sorter: (a, b) => compare(a.message, b.message),
			sortDirection: ['ascend', 'descend'],
			ellipsis: true,
			width: '15%',
			setFilter: true
		},
		{
			title: 'Created At',
			dataIndex: 'timestamp',
			key: 'timestamp',
			sorter: (a, b) => compare(a.timestamp, b.timestamp),
			sortDirection: ['ascend', 'descend'],
			width: '15%',
			// setFilter: true,
			render: timestamp => (<>{ toDatetime(Number(timestamp)*1000) }</>),
		},
		{
			title: 'State',
			dataIndex: 'state',
			key: 'state',
			sorter: (a, b) => compare(a.state, b.state),
			sortDirection: ['ascend', 'descend'],
			width: '10%',
			// setFilter: true,
			render: state => {
				let color = 'default';
				let text = 'Unknown';
				switch (state) {
					case '0' :
						color = 'green';
						text = 'Available';
						break;
					case '1' :
						color = 'default';
						text = 'Unavailable';
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
			title: 'Account Status',
			dataIndex: 'status',
			key: 'status',
			sorter: (a, b) => compare(a.status, b.status),
			sortDirection: ['ascend', 'descend'],
			width: '15%',
			// setFilter: true,
			render: status => {
				let color = 'default';
				let text = 'Unknown';
				switch (status) {
					case 'h' :
						color = 'red';
						text = 'Hard Banned';
						break;
					case 's' :
						color = 'orange';
						text = 'Soft Banned';
						break;
					case 'u' :
						color = 'green';
						text = 'Unbanned';
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
	tableHeader = (
		<>
			<IdcardOutlined />
			<strong>Candidates</strong>
		</>
	)

	// bind versions of CRUD
	config = {
		service: accountService,
		retrieve: "retrieve_candidate",
		list: "list_candidates",
		update: "ban_candidate",
		dataName: "data",
	};
	listSync = listSync.bind(this, this.config);
	ban = updateSync.bind(this, this.config);
	softBanSync = async record => {
		const body = {
			candidate_id: record.id,
			ban_type: "S",
		}
		await this.ban(record.id, body);
	}
	hardBanSync = async record => {
		const body = {
			candidate_id: record.id,
			ban_type: "H",
		}
		await this.ban(record.id, body);
	}
	blacklistSync = async (id, record) => {
		const body = {
			candidate_id: id,
			ban_type: "B",
			blacklist_type: record.blacklist_type,
		}
		await this.ban(id, body);
	}
	searchCandidates = listSync.bind(this, {
		...this.config,
		list: "search_candidates",
	});
	searchCandidatesSync = params => {
		this.setState( { spinning: true }, async () => {
			await this.searchCandidates(params);
			this.setState({ spinning: false });
		});
	}

	// refresh table
	refreshTable = () => {
		this.setState({ spinning: true }, async () => {
			await this.listSync();
			this.setState({ spinning: false });
			this.setState({ tableWrapperKey: Date.now() })
		});
	};

	render(){
		return (
			<div className='Candidate'>
				<Spin spinning={ this.state.spinning }>
					<TableWrapper
						key={ this.state.tableWrapperKey }
						// data props
						data={ this.state.data }
						// display props
						columns={ this.columns }
						formItems={ this.formItems }
						tableHeader={ this.tableHeader }
						drawerTitle='A Candidate'
						showDropdown={ false }
						// api props
						listSync={ this.listSync }
						softBanSync={ this.softBanSync}
						hardBanSync={ this.hardBanSync }
						blacklistSync={ this.blacklistSync }
						searchCandidatesSync={ this.searchCandidatesSync }
					>
					</TableWrapper>
				</Spin>
			</div>
		);
	}
}

export { Candidate };
