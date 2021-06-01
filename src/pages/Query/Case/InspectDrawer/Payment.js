import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	AutoComplete,
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

// import shared and child components
import { TableBody } from '_components'

// import services
import { candidateService } from '_services';

// import helpers
import { backend, helpers } from "_helpers";

// destructure imported components and objects
const { retrieveSync, listSync } = backend;
const { compare, toDatetime } = helpers;
const { Search } = Input;
const { Option } = Select;

class Payment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for Spin
			spinning: false,
			// for TableBody
			payments: [],
			// for search
			db: "ea",
			candidateId: "",
			// for AutoComplete
			open: false,
			options: [],
			// pagination
			currentPage: 1,
			pageSize: 10,
			total: 10,
		};
	}
	
	componentDidMount() {
	}

	componentDidUpdate(prevProps) {
		const { visible, dataAccount } = this.props;
		const { currentPage, pageSize } = this.state;
		if(prevProps.visible !== visible && visible && dataAccount) {
			const { db, candidate_id: candidateId } = dataAccount;
			this.setState({ db, candidateId }, async () => {
				await this.listSync({ currentPage, pageSize });
				await this.retrieveRowCountSync();
			});
		}
	}

	// for related email panel
	columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: '10%',
			sorter: (a, b) => compare(a.id, b.id),
			setFilter: true
		},
		{
			title: 'Transaction ID',
			dataIndex: 'transaction_id',
			key: 'transaction_id',
			wtransaction_idth: '10%',
			sorter: (a, b) => compare(a.transaction_id, b.transaction_id),
			setFilter: true
		},
		{
			title: 'Category',
			dataIndex: 'product_id',
			key: 'product_id',
			wproduct_idth: '10%',
			sorter: (a, b) => compare(a.product_id, b.product_id),
			// setFilter: true,
			render: product_id => {
				const match = product_id.match(/gold|silver|adfree/);
				const category = match ? match[0] : "none";
				let color = 'default';
				switch (category) {
					case 'gold':
						color = 'gold';
						break;
					case 'silver':
						color = '#c0c0c0';
						break;
					case 'adfree':
						color = 'cyan';
						break;
					case 'none':
						color = 'purple';
						break;
					default:
						color = 'purple';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ category }
					</Tag>
				);
			},
		},
		{
			title: 'Periodicity',
			dataIndex: 'product_id',
			key: 'product_id',
			wproduct_idth: '10%',
			sorter: (a, b) => compare(a.product_id, b.product_id),
			// setFilter: true,
			render: product_id => {
				const match = product_id.match(/quarter|halfyear|monthly/);
				const periodicity = match ? match[0] : "none";
				let color = 'default';
				switch (periodicity) {
					case 'quarter' :
						color = 'gold';
						break;
					case 'halfyear' :
						color = '#c0c0c0';
						break;
					case 'monthly' :
						color = 'cyan';
						break;
					default:
						color = 'cyan';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ periodicity }
					</Tag>
				);
			},
		},
		{
			title: 'Transaction Date',
			dataIndex: 'transaction_date',
			key: 'transaction_date',
			wtransaction_dateth: '10%',
			sorter: (a, b) => compare(a.transaction_date, b.transaction_date),
			// setFilter: true,
			render: transaction_date => toDatetime(transaction_date),
		},
		{
			title: 'Expiry Date',
			dataIndex: 'expiry_date',
			key: 'expiry_date',
			wexpiry_dateth: '10%',
			sorter: (a, b) => compare(a.expiry_date, b.expiry_date),
			// setFilter: true,
			render: expiry_date => toDatetime(expiry_date),
		},
	];

	titleModal = () => (
		<Row>
			<Col span={ 8 }>
				Search Payments
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
			
		this.setState({ candidateId }, async () => {
			await this.listSync({ currentPage: 1, pageSize: 10 });
			await this.retrieveRowCountSync();
		});
	}

	// handler for database change
	handleChangeDb = db => this.setState({ db });

	// handler for click close
	onCancel = event => {
		this.setState({ 
			db: "ea",
			payments: [],
			candidateId: "",
		});
		this.props.onCancel();
	}

	// handler for pagination
	handleChangePage = async (page, pageSize) =>
		await this.listSync({ currentPage: page, pageSize: pageSize });

	// bind versions of CRUD
	config = {
		service: candidateService,
		retrieve: "retrievePaymentRowCount",
		list: "listPayments",
		dataName: "payments",
	};
	retrieveRowCount = retrieveSync.bind(this, this.config);
	retrieveRowCountSync =  async () => {
		const { entry: {row_count} } = await this.retrieveRowCount({ 
			db: this.state.db, 
			candidate_id: this.state.candidateId,
		});
		this.setState({ total: row_count });
	}
	list = listSync.bind(this, this.config);
	listSync = ({currentPage=1, pageSize=10}) => {
		// wrap the logic with Promise to allow await statement
		return new Promise(function (resolve) {
			this.setState( { spinning: true }, async () => {
				const limit = pageSize;
				const offset = (currentPage - 1)*limit;
				let { code, entry: payments } = await this.list({ 
					db: this.state.db, 
					candidate_id: this.state.candidateId,
					offset,
					limit,
				});
				if (code === 200) {
					if (currentPage === 1)
						message.success("Invitations found");
				} else {
					message.info("Payments not found");
					payments = [];
				}
				this.setState({ 
					currentPage,
					pageSize,
					payments,
					spinning: false 
				});
				resolve(1);
			});
		}.bind(this));
	}

	render(){
		return (
			<div className="Payment">
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
						<Spin spinning={ this.state.spinning }>
							<div>
								<TableBody
									columns={ this.columns } 
									data={ this.state.payments }
									isSmall={ true }
									pagination={{
										pageSizeOptions: [10, 25, 50, 100], 
										pageSize: this.state.pageSize,
										current: this.state.currentPage,
										total: this.state.total,
										onChange: this.handleChangePage
									}}
								/>
							</div>
						</Spin>
					</div>
				</Modal>
			</div>
		);
	}
}

export default Payment;
