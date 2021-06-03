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
import { candidateService, titleService } from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { createSync, listSync, updateSync } = backend;
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
			cache: 'hk',
			// pagination
			pagination: false,
			currentPage: 1,
			pageSize: 25,
			total: 5000,
		};
	}
	
	componentDidMount() {
		if(this.props.fromTagPage){
			this.setState({ spinning: true }, async () => {
				await this.searchCandidatesSync({keywords: this.props.keywords});
				this.setState({ spinning: false });
			});
		}
		else {
			this.setState({ spinning: true }, async () => {
				await this.listSync(0, 10);
				this.setState({ spinning: false });
			});
		}
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Candidate ID',
			dataIndex: 'id',
			key: 'id',
			sorter: (a, b) => compare(a.id, b.id),
			sortDirection: ['ascend', 'descend'],
			fixed: 'left',
			width: 140,
			setFilter: true
		},
		{
			title: 'Gender',
			dataIndex: 'gender',
			key: 'gender',
			sorter: (a, b) => compare(a.gender, b.gender),
			sortDirection: ['ascend', 'descend'],
			width: 140,
			// setFilter: true,
			render: gender => {
				let color = 'default';
				let text = 'Unknown';
				switch (gender) {
					case '0' :
						color = 'default';
						text = 'Unknown';
						break;
					case '1' :
						color = 'geekblue';
						text = 'Male';
						break;
					case '2' :
						color = 'magenta';
						text = 'Female';
						break;
					case '3' :
						color = 'purple';
						text = 'Other';
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
			title: 'Message',
			dataIndex: 'message',
			key: 'message',
			sorter: (a, b) => compare(a.message, b.message),
			sortDirection: ['ascend', 'descend'],
			ellipsis: true,
			width: 300,
			setFilter: true
		},
		{
			title: 'User Tags',
			dataIndex: 'user_tags',
			key: 'user_tags',
			sorter: (a, b) => compare(a.tag, b.tag),
			sortDirection: ['ascend', 'descend'],
			width: 200,
			// ellipsis: true,
			render: user_tags => (
				<>
					{ 
						user_tags ? user_tags.map( item => (
							<Tag color="blue" key={ uuidv4() }>
								{ item?.length > 20 ? item.slice(0,20) + "..." : item }
							</Tag>
						)) : <Tag key={ uuidv4() }>None</Tag> 
					}
				</>
			),
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
			title: 'Account Status',
			dataIndex: 'status',
			key: 'status',
			sorter: (a, b) => compare(a.status, b.status),
			sortDirection: ['ascend', 'descend'],
			width: 140,
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
		{
			title: 'Last Updated',
			dataIndex: 'timestamp',
			key: 'timestamp',
			sorter: (a, b) => compare(a.timestamp, b.timestamp),
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
			<IdcardOutlined />
			<strong>Candidates</strong>
		</>
	)

	// handler for change cache
	handleChangeCache = cache => {
		this.setState({ cache }, async () => {
			const offset = 0;
			const size = 10;
			await this.listSync(offset, size);
			this.setState({ 
				currentPage: 1,
				pageSize: size,
			});
		});	
	}

	// handlers for pagiantion
	handleChangePage = async (page, size) => {
		if (this.state.pageSize === size) {
			const offset = (page - 1) * size;
			await this.listSync(offset, size);
			this.setState({ currentPage: page });
		} else {
			const offset = 0;
			await this.listSync(offset, size);
			this.setState({ 
				currentPage: 1,
				pageSize: size,
			});
		}
	}

	// bind versions of CRUD
	config = {
		service: candidateService,
		retrieve: "retrieve",
		list: "list",
		update: "ban",
		dataName: "data",
	};
	list = listSync.bind(this, this.config);
	listSync = (offset=0, limit=1) => {
		this.setState( { spinning: true, pagination: false }, async () => {
			const { entry } = await this.list({ cache: this.state.cache, offset, limit });

			if (entry) {
				// perform title classifications
				let titles = {};
				entry.forEach( item => { titles[item.id] = item.message });
				const { entry : predictions } = await this.predictSync({ 
					titles,
					should_update: 0,
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
	searchCandidates = listSync.bind(this, {
		...this.config,
		list: "search_by_keywords",
	});
	searchCandidateById = listSync.bind(this, {
		...this.config,
		list: "search_by_cid",
	});

	searchCandidatesSync = params => {
		this.setState( { spinning: true, pagination: true }, async () => {
			const { entry } = await this.searchCandidates({...params, cache: this.state.cache});

			if (entry) {
				// perform title classifications
				let titles = {};
				entry.forEach( item => { titles[item.id] = item.message });
				const { entry : predictions } = await this.predictSync({ 
					titles,
					should_update: 0,
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

	searchCandidateByIdSync = params => {
		this.setState( { spinning: true, pagination: true }, async () => {
			const { entry } = await this.searchCandidateById({...params, cache: this.state.cache});

			if (entry) {
				// perform title classifications
				let titles = {};
				entry.forEach( item => { titles[item.id] = item.message });
				const { entry : predictions } = await this.predictSync({ 
					titles,
					should_update: 0,
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
			<div className='Candidate'>
				<Spin spinning={ this.state.spinning }>
					<TableWrapper
						key={ this.state.tableWrapperKey }
						// data props
						data={ this.state.data }
						currentPage={ this.state.currentPage }
						pageSize={ this.state.pageSize }
						total={ this.state.total }
						pagination={ this.state.pagination }
						// display props
						columns={ this.columns }
						formItems={ this.formItems }
						tableHeader={ this.tableHeader }
						drawerTitle='A Candidate'
						showDropdown={ false }
						size={ "small" }
						scroll={ {x:2000} }
						// api props
						listSync={ this.listSync }
						softBanSync={ this.softBanSync}
						hardBanSync={ this.hardBanSync }
						blacklistSync={ this.blacklistSync }
						searchCandidatesSync={ this.searchCandidatesSync }
						searchCandidateByIdSync={ this.searchCandidateByIdSync}
						onChangeCache={ this.handleChangeCache }
						onChangePage={ this.handleChangePage }
						onChangeSize={ this.handleChangePage }
					>
					</TableWrapper>
				</Spin>
			</div>
		);
	}
}

export { Candidate };
