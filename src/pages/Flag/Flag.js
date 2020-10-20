import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	Select,
	Spin,
	Tag,
	message,
} from 'antd';
import { FlagOutlined } from '@ant-design/icons';

// import shared and child components
import { TableWrapper } from './TableWrapper'
import { FlagModal } from './FlagModal'

// import services
import { 
	candidateService,
	flagService,
} from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { listSync, updateSync } = backend;
const { compare, toDatetime } = helpers;
const { Option } = Select;

class Flag extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
			spinning: false,
			cache: 'hk',
			interval: 48,
			orderBy: 'timestamp',
			page: 1,
			// for the flag modal
			visibleFlag: false,
			modalKeyFlag: Date.now(),
			db: "ea",
		};
	}
	
	componentDidMount() {
		this.setState({ spinning: true }, async () => {
			const interval = this.state.interval;
			const orderBy = this.state.orderBy;
			const page = this.state.page;
			await this.listSync(interval, orderBy, page);
			this.setState({ spinning: false });
		});
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Total Flags',
			dataIndex: 'total_flag',
			key: 'total_flag',
			sorter: (a, b) => compare(a.total_flag, b.total_flag),
			sortDirection: ['ascend', 'descend'],
			ellipsis: true,
			fixed: 'left',
			width: 140,
			setFilter: true
		},
		{
			title: 'Suspect Message',
			dataIndex: 'suspect_message',
			key: 'suspect_message',
			sorter: (a, b) => compare(a.suspect_message, b.suspect_message),
			sortDirection: ['ascend', 'descend'],
			// ellipsis: true,
			fixed: 'left',
			width: 260,
			setFilter: true
		},
		{
			title: 'Account Status',
			dataIndex: 'status',
			key: 'status',
			sorter: (a, b) => compare(a.status, b.status),
			sortDirection: ['ascend', 'descend'],
			width: 160,
			// setFilter: true,
			fixed: 'left',
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
		{
			title: 'Current Message',
			dataIndex: 'current_message',
			key: 'current_message',
			sorter: (a, b) => compare(a.current_message, b.current_message),
			sortDirection: ['ascend', 'descend'],
			// ellipsis: true,
			width: 260,
			setFilter: true
		},
		{
			title: 'State',
			dataIndex: 'state',
			key: 'state',
			sorter: (a, b) => compare(a.state, b.state),
			sortDirection: ['ascend', 'descend'],
			width: 140,
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
			title: 'Suspect ID',
			dataIndex: 'suspect_id',
			key: 'suspect_id',
			sorter: (a, b) => compare(a.suspect_id, b.suspect_id),
			sortDirection: ['ascend', 'descend'],
			width: 160,
			setFilter: true
		},
		{
			title: 'Created At',
			dataIndex: 'flag_timestamp',
			key: 'flag_timestamp',
			sorter: (a, b) => compare(a.flag_timestamp, b.flag_timestamp),
			sortDirection: ['ascend', 'descend'],
			width: 140,
			// setFilter: true,
			render: timestamp => (<>{ toDatetime(Number(timestamp)*1000) }</>),
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
			<FlagOutlined />
			<strong>Flags</strong>
		</>
	)

	// handler for change cache
	handleChangeCache = cache => {
		const db = cache === 'ca' ? 'na' : 'ea';
		this.setState({ cache, data: [], db }, async () => {
			const interval = 48;
			const orderBy = 'timestamp';
			const page = 1;
			await this.listSync(interval, orderBy, page);
			this.setState({ 
				interval,
				orderBy,
				page,
			});
		});	
	}

	// handler for orderBy
	handleChangeOrderBy = orderBy => this.setState({ orderBy });

	// handler for page
	handleChangePage = page => {
		if (!isFinite(page)) {
			message.error("Page should be a number");
			this.setState({ page: 1 });
			return;
		}
		this.setState({ page });
	}

	// handler for interval
	handleChangeInterval = interval => {
		if (!isFinite(interval)) {
			message.error("Interval should be a number");
			this.setState({ interval: 48 });
			return;
		}
		this.setState({ interval });
	}

	// handler for Search button
	handleSearch = async event => {
		const interval = this.state.interval;
		const orderBy = this.state.orderBy;
		const page = this.state.page;
		await this.listSync(interval, orderBy, page);
		const tableWrapperKey =  Date.now();
		this.setState({ tableWrapperKey });
	}

	// handler for click flag search modal
	handleClickFlag = record => {
		this.setState({
			visibleFlag: true,
			suspectId: record.suspect_id,
		});
	}

	// handler for close flag modal
	handleCloseFlag = event => {
		this.setState({
			visibleFlag: false,
			modalKeyFlag: Date.now(),
		});
	}

	// update local data
	updateLocal = (record, type) => {
		record.status = type;
		this.setState({ data: [record, ...this.state.data]});
	}

	// bind versions of CRUD
	config = {
		service: flagService,
		retrieve: "retrieve",
		list: "list",
		dataName: "data",
	};
	list = listSync.bind(this, this.config);
	listSync = (interval=48, orderBy='timestamp', page=1) => {
		this.setState( { spinning: true }, async () => {
			await this.list({ 
				cache: this.state.cache, 
				interval, 
				order_by: orderBy, 
				page
			});
			this.setState({ spinning: false });
		});
	}
	configCandidate = {
		service: candidateService,
		retrieve: "retrieve",
		update: "ban",
		dataName: "data",
	};
	ban = updateSync.bind(this, this.configCandidate);
	softBanSync = async record => {
		const body = {
			candidate_id: record.suspect_id,
			ban_type: "S",
			cache: this.state.cache,
		}
		await this.ban(record.suspect_id, body);
		this.updateLocal( record, 's' );
	}
	hardBanSync = async record => {
		const body = {
			candidate_id: record.suspect_id,
			ban_type: "H",
			cache: this.state.cache,
		}
		await this.ban(record.suspect_id, body);
		this.updateLocal( record, 'h' );
	}
	blacklistSync = async (id, record) => {
		const body = {
			candidate_id: id,
			ban_type: "B",
			blacklist_type: record.blacklist_type,
			cache: this.state.cache,
		}
		await this.ban(id, body);
		this.updateLocal( record, 'h' );
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
			<div className='Flag'>
				<Spin spinning={ this.state.spinning }>
					<TableWrapper
						key={ this.state.tableWrapperKey }
						// data props
						data={ this.state.data }
						cache={ this.state.cache }
						interval={ this.state.interval }
						orderBy={ this.state.orderBy }
						page={ this.state.page }
						// display props
						columns={ this.columns }
						formItems={ this.formItems }
						tableHeader={ this.tableHeader }
						drawerTitle='A Flag'
						showDropdown={ false }
						scroll={ {x:1600} }
						// api props
						listSync={ this.listSync }
						softBanSync={ this.softBanSync}
						hardBanSync={ this.hardBanSync }
						blacklistSync={ this.blacklistSync }
						onChangeCache={ this.handleChangeCache }
						onChangeOrderBy={ this.handleChangeOrderBy }
						onChangePage={ this.handleChangePage }
						onChangeInterval={ this.handleChangeInterval }
						onSearch={ this.handleSearch }
						onClickFlag={ this.handleClickFlag }
					>
					</TableWrapper>
				</Spin>
				<div>
					<FlagModal
						suspectId={ this.state.suspectId }
						interval={ this.state.interval}
						db={ this.state.db }
						modalKey={ this.state.modalKeyFlag }
						visible={ this.state.visibleFlag }
						onCancel={ this.handleCloseFlag }
					>
					</FlagModal>
				</div>
			</div>
		);
	}
}

export { Flag };
