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
	titleService,
} from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { createSync, listSync, updateSync } = backend;
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
			remarks: '',
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
			const remarks = this.state.remarks;
			await this.listSync(interval, orderBy, page, remarks);
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
			title: 'Tag',
			dataIndex: 'tag',
			key: 'tag',
			sorter: (a, b) => compare(a.tag, b.tag),
			sortDirection: ['ascend', 'descend'],
			width: 140,
			ellipsis: true,
			//setFilter: true
			render: tag => {
				let color = 'green';
				let text = 'Normal';
				switch (tag) {
					case 0 :
						color = 'green';
						text = 'Normal';
						break;
					case 1 :
						color = 'red';
						text = 'Spammer';
						break;
					default:
						color = 'green';
						text = 'Normal';
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
			title: 'Spam Score',
			dataIndex: 'score',
			key: 'score',
			sorter: (a, b) => compare(a.score, b.score),
			sortDirection: ['ascend', 'descend'],
			width: 140,
			//setFilter: true
			render: score => {
				let color = '#00ff00';
				switch (score) {
					case 0 :
						color = '#00ff00';
						break;
					case 1 :
						color = '#2efc00';
						break;
					case 2 :
						color = '#5bf900';
						break;
					case 3 :
						color = '#88f700';
						break;
					case 4 :
						color = '#b3f400';
						break;
					case 5 :
						color = '#def200';
						break;
					case 6 :
						color = '#efd600';
						break;
					case 7 :
						color = '#eca800';
						break;
					case 8 :
						color = '#ea7b00';
						break;
					case 9 :
						color = '#e74f00';
						break;
					case 10 :
						color = '#e52400';
						break;
					default:
						color = '#00ff00';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ score }
					</Tag>
				);
			},
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
		{
			title: 'Remarks',
			dataIndex: 'remarks',
			key: 'remarks',
			sorter: (a, b) => compare(a.remarks, b.remarks),
			sortDirection: ['ascend', 'descend'],
			width: 180,
			setFilter: true,
		},
		{
			title: 'Reporter',
			dataIndex: 'reporter_message',
			key: 'reporter_message',
			sorter: (a, b) => compare(a.reporter_message, b.reporter_message),
			sortDirection: ['ascend', 'descend'],
			width: 140,
			// setFilter: true,
			render: reporter => (<>{ reporter ? reporter : "System/CMS" }</>),
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
			const remarks= '';
			await this.listSync(interval, orderBy, page, remarks);
			this.setState({ 
				interval,
				orderBy,
				page,
				remarks,
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

	// handler for remarks
	handleChangeRemarks = event => this.setState({ remarks: event.target.value});

	// handler for Search button
	handleSearch = event => {
		this.setState({ data: [] }, async () => {
			const interval = this.state.interval;
			const orderBy = this.state.orderBy;
			const page = this.state.page;
			const remarks = this.state.remarks;
			await this.listSync(interval, orderBy, page, remarks);
			const tableWrapperKey =  Date.now();
			this.setState({ tableWrapperKey });
		});
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
	listSync = (interval=48, orderBy='timestamp', page=1, remarks='') => {
		this.setState( { spinning: true }, async () => {
			const { entry } = await this.list({ 
				cache: this.state.cache, 
				interval, 
				order_by: orderBy, 
				page,
				remarks,
			});

			if (entry) {
				// perform title classifications
				let titles = {};
				entry.forEach( item => { titles[item.id] = item.suspect_message });
				const { entry : predictions } = await this.predictSync({ 
					titles,
					should_update: "False",
				});
				const data = entry.map( item => {
					item.score = predictions[item.id]?.score ? predictions[item.id]?.score : 0;
					item.tag = item.score > 6 ? 1 : 0;
					return item; 
				})
				this.setState({ data });
			}

			this.setState({ spinning: false });
		});
	}
	configCandidate = {
		service: candidateService,
		retrieve: "retrieve",
		update: "ban",
		dataName: "data",
		pageName: "Flags",
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

	predictSync = createSync.bind(this, {
		service: titleService,
		create: "predict",
		dataName: "unknown",
	});

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
						remarks={ this.state.remarks }
						// display props
						columns={ this.columns }
						formItems={ this.formItems }
						tableHeader={ this.tableHeader }
						drawerTitle='A Flag'
						showDropdown={ false }
						scroll={ {x:2080} }
						// api props
						listSync={ this.listSync }
						softBanSync={ this.softBanSync}
						hardBanSync={ this.hardBanSync }
						blacklistSync={ this.blacklistSync }
						onChangeCache={ this.handleChangeCache }
						onChangeOrderBy={ this.handleChangeOrderBy }
						onChangePage={ this.handleChangePage }
						onChangeInterval={ this.handleChangeInterval }
						onChangeRemarks={ this.handleChangeRemarks }
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
