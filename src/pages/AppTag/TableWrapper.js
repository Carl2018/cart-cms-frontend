import React, { Component } from 'react';

// import components from ant design
import { 
	Button, 
	Col, 
	Input, 
	Row, 
	Select, 
	Space, 
	message, 
	notification, 
} from 'antd';
import { 
	EditOutlined, 
	IdcardOutlined, 
} from '@ant-design/icons';

// import shared and child components
import { TableBody } from '_components'
import { TableDrawer } from './TableDrawer'
import { Candidate } from './Candidate'

const { Option } = Select;
const { Search } = Input;

class TableWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedRowKeys: [],
			tableDrawerKey: Date.now(),
			visible: false,
			record: {},
			disabled: false,
			// for candidate modal
			visibleCandidate: false,
			candidateModalKey: Date.now(),
			tagId: null,
			tag: null,
			candCount: null,
		};
	}

	// define columns in TableBody
	columns = [
		...this.props.columns,
		{
			title: 'Actions',
			key: 'action',
			render: (text, record) => (
				<Space size='small'>
					<Button 
						type='link' 
						icon={ <IdcardOutlined /> }
						onClick={ this.handleClickCandidate.bind(this, record) }
					>
						Candidates
					</Button>
					<Button 
						type='link' 
						icon={ <EditOutlined /> }
						onClick={ this.handleClickUpdate.bind(this, record) }
					>
						Update
				</Button>
				</Space>
			),
			fixed: 'right',
			width: "20%",
			setFilter: false
		},
	];

	// handlers for actions in TableBody
	handleClickUpdate = record => {
		this.setState({
			visible: true, 
			disabled: false,
			record,
		});
	}

	handleClickCandidate = record => {
		this.setState({
			visibleCandidate: true, 
			tagId: record.id,
			tag: record.tag,
			candCount: record.cand_count,
		});
	}

	handleSelectChange = selectedRowKeys => this.setState({ selectedRowKeys });

	// handlers for actions in TableDropdown
  handleClickAdd = event => {
    this.setState({
      visible: true,
			disabled: false,
			record: {},
    });
  };

	handleClickRefreshTable = () => {
		this.props.refreshTable();
		message.info('the table has been refreshed');
	}

	handleClickBatchDelete = () => {
		const key = `open${Date.now()}`;
		const btn = (
			<Button 
				type='primary' 
				size='small' 
				onClick={ this.handleClickConfirm.bind(this, notification.close, key) }
			>
				Confirm
			</Button>
		);
		notification.open({
			message: 'About to delete multiple records',
			description:
				'Are you sure to delete these records?',
			btn,
			key,
			duration: 0,
			onClose: () => message.info('batch delete has been canceled'),
		});
	};

  handleClickConfirm = (closeNotification, notificationKey) => {
		this.props.delete(this.state.selectedRowKeys);
		closeNotification(notificationKey);
  };

	// handler for search
	handleSearch = tag => this.props.searchTagsSync({ tag });

	// handlers for actions in TableDrawer
  handleClose = () => {
    this.setState({
      visible: false,
			record: {},
			tableDrawerKey: Date.now(),
    });
  };

	handleSubmit = record => {

		if (this.state.record.id) // edit the entry
			this.props.edit(this.state.record.id, {...record, cache: this.props.cache});
		else // create an entry
			this.props.create(record);

		this.setState({
			record: {},
			visible: false,
			tableDrawerKey: Date.now(),
		});
	}

  handleCloseCandidate = () => {
    this.setState({
      visibleCandidate: false,
			record: {},
			candidateModalKey: Date.now(),
    });
  };

	render(){
		return (
			<div className='TableWrapper'>
				<Row style={{ margin: this.props.isSmall ? "8px" : "16px" }}>
					<Col 
						style={{ 
							fontSize: this.props.isSmall ? 
							'20px' : '24px', textAlign: 'left' 
						}}
						span={ 12 } 
					>
						<Space size="large">
							{ this.props.tableHeader }
						</Space>
					</Col>
				</Row>
				<Row style={{ marginBottom: "16px" }}>
					<Col 
						style={{ fontSize: '24px', textAlign: 'left' }}
						span={ 12 } 
					>
						<Space>
							<span style={{ fontSize: "16px", marginLeft: "8px" }} >
								Cache:
							</span>
							<Select
								defaultValue="all"
								value={ this.props.cache }
								onChange={ this.props.onChangeCache  }
								style={{ marginRight: "16px", width: 100 }}
							>
								<Option value="all">All</Option>
								<Option value="hk">Hong Kong</Option>
								<Option value="tw">Taiwan</Option>
								<Option value="sg">Singapore</Option>
								<Option value="my">Malaysia</Option>
								<Option value="ca">Canada</Option>
							</Select>
							<span style={{ fontSize: "16px", marginLeft: "8px" }} >
								Category:
							</span>
							<Select
								defaultValue="all"
								value={ this.props.category }
								onChange={ this.props.onChangeCategory }
								style={{ marginRight: "16px", width: 100 }}
							>
								<Option value="all">All</Option>
								<Option value="1">Normal</Option>
								<Option value="2">Sweet</Option>
								<Option value="3">Drug</Option>
								<Option value="4">Scam</Option>
								<Option value="5">Crime</Option>
							</Select>
							<span style={{ fontSize: "16px", marginLeft: "8px" }} >
								Featured:
							</span>
							<Select
								defaultValue="2"
								value={ this.props.isFeatured }
								onChange={ this.props.onChangeFeatured}
								style={{ marginRight: "16px", width: 100 }}
							>
								<Option value="2">All</Option>
								<Option value="0">No</Option>
								<Option value="1">Yes</Option>
							</Select>
							<span style={{ fontSize: "16px", marginLeft: "8px" }} >
								Banned:
							</span>
							<Select
								defaultValue="2"
								value={ this.props.isBanned }
								onChange={ this.props.onChangeBanned}
								style={{ marginRight: "16px", width: 100 }}
							>
								<Option value="2">All</Option>
								<Option value="0">No</Option>
								<Option value="1">Yes</Option>
							</Select>
							<Search
								value={ this.props.tag }
								onChange={ this.props.onChangeSearchTag }
								onSearch={ this.handleSearch }
								placeholder= "Search by Tag Name"
								style={{ width: 400 }}
								size="middle"
								allowClear
							/>
						</Space>
					</Col>
				</Row>
				<div>
					<TableBody 
						data={ this.props.data } 
						columns={ this.columns } 
						selectedRowKeys={ this.props.noBatch ? 
							null : this.state.selectedRowKeys 
						}
						onSelectChange={ this.handleSelectChange }
						isSmall={ this.props.isSmall }
						scroll={ this.props.scroll }
						showHeader={ this.props.showHeader }
						loading={ this.props.loading }
						pagination={ {
							pageSizeOptions: [10, 25, 50, 100], 
							pageSize: this.props.pageSize, 
							current: this.props.currentPage, 
							total: this.props.total, 
							onChange: this.props.onChangePage,
						} }
					/>
				</div>
				<div>
					<TableDrawer 
						tableDrawerKey={ this.state.tableDrawerKey }
						drawerTitle={ this.props.drawerTitle } 
						visible={ this.state.visible } 
						onClose={ this.handleClose }
						record={ this.state.record }
						formItems={ this.props.formItems }
						disabled={ this.state.disabled } 
						onSubmit={ this.handleSubmit }
						drawerWidth={ this.props.drawerWidth }
						formLayout={ this.props.formLayout }
					/>
				</div>
				<div>
					<Candidate
						modalKey={ this.state.candidateModalKey }
						visible={ this.state.visibleCandidate } 
						tagId={ this.state.tagId}
						tag={ this.state.tag}
						candCount={ this.state.candCount}
						onClose={ this.handleCloseCandidate }
						// data props
						dataCandidate={ this.props.dataCandidate }
						currentPageCandidate={ this.props.currentPageCandidate }
						pageSizeCandidate={ this.props.pageSizeCandidate }
						// api props
						searchCandidatesByTagSync={ this.props.searchCandidatesByTagSync }  
					/>
				</div>
			</div>
		);
	}
}

export { TableWrapper };
