import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { TagOutlined } from '@ant-design/icons';
import { 
	Input, 
	Select, 
	Spin, 
	Tag, 
} from 'antd';

// import shared and child components
import { TableWrapper } from './TableWrapper';

// import services
import { tagService } from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { retrieveSync, listSync, updateSync } = backend;
const { compare } = helpers;
const { Option } = Select;

class AppTag extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			spinning: false,
			// populate the table body with data
			cache: "all",
			category: "all",
			tag: "",
			isFeatured: "2",
			isBanned: "2",
			data: [],
			// pagination
			currentPage: 1,
			pageSize: 25,
			total: 0,
			// for Candidate modal
			dataCandidate: [],
			currentPageCandidate: 1,
			pageSizeCandidate: 25,
		};
	}
	
	componentDidMount() {
		this.setState({ spinning: true }, async () => {
			await this.listSync({
				page_size: this.state.pageSize,
				current_page: this.state.currentPage,
			});
			this.setState({ 
				spinning: false, 
			});
		});
	}

	// define columns for TableBody
	columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			sorter: (a, b) => compare(a.id, b.id),
			sortDirection: ['ascend', 'descend'],
			fixed: 'left',
			ellipsis: true,
			width: "10%",
			setFilter: true
		},
		{
			title: 'Cache',
			dataIndex: 'region',
			key: 'region',
			sorter: (a, b) => compare(a.region, b.region),
			sortDirection: ['ascend', 'descend'],
			fixed: 'left',
			ellipsis: true,
			width: "10%",
			// setFilter: true
			render: region => {
				let color = 'gold';
				let text = 'Hong Kong';
				switch (region) {
					case 1 :
						color = 'gold';
						text = 'Hong Kong';
						break;
					case 2 :
						color = 'geekblue';
						text = 'Taiwan';
						break;
					case 3 :
						color = 'red';
						text = 'Canada';
						break;
					case 4 :
						color = 'purple';
						text = 'Singapore';
						break;
					case 5 :
						color = 'lime';
						text = 'Malaysia';
						break;
					default:
						color = 'gold';
						text = 'Hong Kong';
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
			title: 'Category',
			dataIndex: 'category',
			key: 'category',
			sorter: (a, b) => compare(a.category, b.category),
			sortDirection: ['ascend', 'descend'],
			fixed: 'left',
			ellipsis: true,
			width: "10%",
			// setFilter: true
			render: category => {
				let color = 'lime';
				let text = 'Normal';
				switch (category) {
					case 1 :
						color = 'lime';
						text = 'Normal';
						break;
					case 2 :
						color = 'gold';
						text = 'Sweet';
						break;
					case 3 :
						color = 'geekblue';
						text = 'Drug';
						break;
					case 4 :
						color = 'red';
						text = 'Scam';
						break;
					case 5 :
						color = 'purple';
						text = 'Crime';
						break;
					default:
						color = 'lime';
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
			title: 'Tag',
			dataIndex: 'tag',
			key: 'tag',
			sorter: (a, b) => compare(a.tag, b.tag),
			sortDirection: ['ascend', 'descend'],
			fixed: 'left',
			ellipsis: true,
			width: "20%",
			setFilter: true
		},
		{
			title: 'Banned',
			dataIndex: 'is_banned',
			key: 'is_banned',
			sorter: (a, b) => compare(a.is_banned, b.is_banned),
			sortDirection: ['ascend', 'descend'],
			fixed: 'left',
			ellipsis: true,
			width: "10%",
			// setFilter: true
			render: is_banned => {
				let color = 'lime';
				let text = 'No';
				switch (is_banned) {
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
			title: 'Featured',
			dataIndex: 'is_featured',
			key: 'is_featured',
			sorter: (a, b) => compare(a.is_featured, b.is_featured),
			sortDirection: ['ascend', 'descend'],
			fixed: 'left',
			ellipsis: true,
			width: "10%",
			// setFilter: true
			render: is_featured => {
				let color = 'lime';
				let text = 'No';
				switch (is_featured) {
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
			title: 'Count',
			dataIndex: 'cand_count',
			key: 'cand_count',
			sorter: (a, b) => compare(a.cand_count, b.cand_count),
			sortDirection: ['ascend', 'descend'],
			fixed: 'left',
			ellipsis: true,
			width: "10%",
			setFilter: true
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Tag Name',
			name: 'tag',
			rules: [
				{
					required: true,
					message: 'tag cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
					placeholder={ "Tag name must be unique" }
				/>
			)
		},
		{
			label: 'Featured',
			name: 'is_featured',
			rules: [
				{
					required: true,
					message: 'featured field cannot be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Select>
					<Option value={ 0 }>No</Option>
					<Option value={ 1 }>Yes</Option>
				</Select>
			)
		},			
		{
			label: 'Banned',
			name: 'is_banned',
			rules: [
				{
					required: true,
					message: 'banned field cannot be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Select>
					<Option value={ 0 }>No</Option>
					<Option value={ 1 }>Yes</Option>
				</Select>
			)
		},			
		{
			label: 'Category',
			name: 'category',
			rules: [
				{
					required: true,
					message: 'category field cannot be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Select>
					<Option value={ 1 }>Normal</Option>
					<Option value={ 2 }>Sweet</Option>
					<Option value={ 3 }>Drug</Option>
					<Option value={ 4 }>Scam</Option>
					<Option value={ 5 }>Crime</Option>
				</Select>
			)
		},			
	];

	// define table header
	tableHeader = (
		<>
			<TagOutlined />
			<strong>Tags</strong>
		</>
	)

	// handler for pagination
	handleChangePage = async (page, pageSize) => {
		this.setState({ spinning: true }, async () => {
			await this.listSync({
				page_size: pageSize,
				current_page: page,
			});
			this.setState({ 
				currentPage: page,
				pageSize: pageSize,
				spinning: false,
			});
		});
	}

	// handler for change cache
	handleChangeCache = cache => {
		this.setState({ cache }, async () => {
			const currentPage = 1;
			const pageSize = 10;
			await this.listSync({currentPage, pageSize});
			this.setState({ 
				currentPage,
				pageSize,
			});
		});	
	}

	// handler for change category
	handleChangeCategory = category => {
		this.setState({ category }, async () => {
			const currentPage = 1;
			const pageSize = 10;
			await this.listSync({currentPage, pageSize});
			this.setState({ 
				currentPage,
				pageSize,
			});
		});	
	}

	// handler for change featured
	handleChangeFeatured = isFeatured => {
		this.setState({ isFeatured }, async () => {
			const currentPage = 1;
			const pageSize = 10;
			await this.listSync({currentPage, pageSize});
			this.setState({ 
				currentPage,
				pageSize,
			});
		});	
	}

	// handler for change banned
	handleChangeBanned = isBanned => {
		this.setState({ isBanned }, async () => {
			const currentPage = 1;
			const pageSize = 10;
			await this.listSync({currentPage, pageSize});
			this.setState({ 
				currentPage,
				pageSize,
			});
		});	
	}

	// search by tag
	searchTagsSync = ({ tag }) => {
		this.setState({ tag, cache: "all", category: "all", isFeatured: "2", isBanned: "2" }, async () => {
			const currentPage = 1;
			const pageSize = 10;
			await this.listSync({currentPage, pageSize});
			this.setState({ 
				currentPage,
				pageSize,
			});
		});	
	}

	// handler for changing search tag
	handleChangeSearchTag = ({target:{value: tag}}) =>  this.setState({ tag });

	// bind versions of CRUD
	config = {
		service: tagService,
		retrieve: "retrieve",
		list: "list",
		update: "update",
		dataName: "data",
	};
	retrieveRowCount = retrieveSync.bind(this, {
		...this.config, 
		retrieve: "retrieveRowCount",
	});
	list = listSync.bind(this, this.config);
	listSync = ({current_page=1, page_size=10}) => {
		this.setState( { spinning: true }, async () => {
			const limit = page_size;
			const offset = (current_page - 1)*limit;
			const { entry: data } = await this.list({ 
				cache: this.state.cache, 
				category: this.state.category, 
				tag: this.state.tag, 
				is_featured: this.state.isFeatured, 
				is_banned: this.state.isBanned, 
				offset,
				limit,
				order_by: "cand_count",
				is_asc: 0,
			});
			const { entry: {row_count} } = await this.retrieveRowCount({
				cache: this.state.cache, 
				category: this.state.category, 
				tag: this.state.tag, 
				is_featured: this.state.isFeatured, 
				is_banned: this.state.isBanned, 
			});
			this.setState({ data, total: row_count, spinning: false });
		});
	}
	searchCandidatesByTag = listSync.bind(this, {
		...this.config, 
		list: "searchCandidatesByTag",
		dataName: "dataCandidate",
	});
	searchCandidatesByTagSync = ({currentPage=1, pageSize=10, tagId}) => {
		// the lower component needs to invoke the await statement
		// wrap the logic with Promise
		return new Promise(function (resolve) {
			this.setState( { spinning: true }, async () => {
				const limit = pageSize;
				const offset = (currentPage - 1)*limit;
				const { entry: dataCandidate } = await this.searchCandidatesByTag({ 
					cache: this.state.cache, 
					tag_id: tagId,
					offset,
					limit,
				});
				this.setState({ 
					dataCandidate,
					currentPageCandidate: currentPage,
					pageSizeCandidate: pageSize,
					spinning: false 
				});
				resolve(1);
			});
		}.bind(this));
	}
	updateSync = updateSync.bind(this, this.config);

	// refresh table
	refreshTable = () => {
		this.setState({ spinning: true }, async () => {
			await this.listSync();
			await this.listProfiles();
			this.setState({ spinning: false });
			this.setState({ tableWrapperKey: Date.now() })
		});
	};

	render(){
		return (
			<div className='AppTag'>
				<Spin spinning={ this.state.spinning }>
					<TableWrapper
						key={ this.state.tableWrapperKey }
						// data props
						data={ this.state.data }
						currentPage={ this.state.currentPage }
						pageSize={ this.state.pageSize }
						total={ this.state.total }
						cache={ this.state.cache }
						category={ this.state.category }
						tag={ this.state.tag }
						isFeatured={ this.state.isFeatured }
						isBanned={ this.state.isBanned }
						dataCandidate={ this.state.dataCandidate }
						currentPageCandidate={ this.state.currentPageCandidate }
						pageSizeCandidate={ this.state.pageSizeCandidate }
						// display props
						columns={ this.columns }
						formItems={ this.formItems }
						tableHeader={ this.tableHeader }
						drawerTitle='A Tag'
						noBatch={ true }
						isSmall={ true }
						// api props
						edit={ this.updateSync }
						refreshTable={ this.refreshTable }
						onChangeCache={ this.handleChangeCache }
						onChangeCategory={ this.handleChangeCategory }
						onChangeFeatured={ this.handleChangeFeatured }
						onChangeBanned={ this.handleChangeBanned }
						onChangeSearchTag={ this.handleChangeSearchTag }
						searchTagsSync={ this.searchTagsSync }
						onChangePage={ this.handleChangePage }
						searchCandidatesByTagSync={ this.searchCandidatesByTagSync }  
					>
					</TableWrapper>
				</Spin>
			</div>
		);
	}
}

export { AppTag };
