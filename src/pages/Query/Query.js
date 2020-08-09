import React, { Component } from 'react';

// import components from ant design
import { 
	AutoComplete, 
	Button, 
	Card, 
	Col, 
	Input, 
	Row, 
	Space, 
	Spin, 
	message, 
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

// import shared and child components
import { ProfileDrawer } from "./ProfileDrawer"
import { Account } from "./Account/Account"
import { Case } from "./Case/Case"
import { Email } from "./Email/Email"

// import services
import { 
	accountService,
	caseService,
	categoryService,
	emailService,
	labelService,
	profileService,
 } from '_services';

// import helpers
import { backend } from '_helpers';

// destructure imported components and objects
const { 
	createSync, 
	retrieveSync, 
	listSync, 
	updateSync, 
	hideSync, 
} = backend;
const { Search } = Input;

class Query extends Component {
	constructor(props) {
		super(props);
		this.state = {
			spinning: false, // for Spin
			showHeader: false, // for header in each table
			showDropdown: false, // for dropdown in each table
			options: [], // options for email search
			email : "", // current email search
			emailId : "", // current email id search
			profilename : "", // current profile
			emails: [], // all emails
			cases: [], // all cases
			accounts: [], // all accounts
			// data streams
			dataEmail: [], 
			dataCase: [], 
			dataAccount: [], 
			// profile drawer
			profileDrawerKey: Date.now(),
			visibleProfile: false,
			profiles: [],
			record: {},
			labels: [],
			// for category selections in case table
			categories: [],
		};
	}
	
	componentDidMount() {
		this.setState({ spinning: true }, async () => {
			await this.listEmails();
			await this.listCases();
			await this.listAccounts();
			await this.listLabels();
			await this.listCategories();
			this.setState({ spinning: false });
		});
	}

	// filter AutoComplete options when input field changes
	handleChange = data => {
		const options = this.state.emails
			.map( item => item.email )
			.filter( (item, index, array) => array.indexOf(item) === index )
			.filter( item => item.trim().toLowerCase()
				.includes(data.trim().toLowerCase()) 
			)
			.map( item => ({ value: item }) );
		this.setState({ options });
	}

	// perform a search when the search button is pressed
	handleSearch = data => {
		this.setState({ spinning: true }, () => {
			this.updateTables(data.trim().toLowerCase());
		});
	}

	// update all 3 tables upon a search
	updateTables = data => {
		const email = data;
		const found = this.state.emails
			.find( item => item.email === email );
		const profilename = found?.profilename;
		const emailId = found?.id;
		this.updateData(profilename);
		this.setState({ 
			email,
			emailId,
			profilename,
			spinning: false,
		});
		if (profilename) {
			message.success("Profile Found");
			this.setState({ 
				showHeader: true,
				showDropdown: true,
			});
		} else {
			message.info("Profile Not Found");
			this.setState({ 
				dataEmail: [], 
				dataCase: [], 
				dataAccount: [], 
				showHeader: false,
				showDropdown: false,
			});
		}
	}

	// handlers for profile drawer
	handleClickProfile = async event => {
		const response = await this.retrieveNextIdProfile()
		const profile_id = response?.entry?.AUTO_INCREMENT;
		this.setState(
			{record: { email: this.state.email, profile_id }},
			() => this.setState({ visibleProfile: true })
		)
	}

	handleCloseProfile = event => {
		this.setState({ 
			visibleProfile: false,
			profileDrawerKey: Date.now(),
			record: {},
		});
	};

	// update streams
	// update dataEmail
	updateDataEmail = (profilename=this.state.profilename) => {
		const dataEmail = this.state.emails
			.filter( item => item.profilename === profilename );
		this.setState({ dataEmail });
		return dataEmail;
	}

	// update dataEmail AND dataCase
	updateDataCase = (profilename=this.state.profilename)=> {
		const dataEmail = this.updateDataEmail( profilename );
		const emails = dataEmail.map( item => item.email );
		const dataCase = this.state.cases
			.filter( item => emails.includes( item.email ) )
		this.setState({ dataCase });
	}

	// update dataAccount
	updateDataAccount = (profilename=this.state.profilename) => {
		const dataAccount = this.state.accounts
			.filter( item => item.profilename === profilename );
		this.setState({ dataAccount });
	}

	// update all 3 data streams 
	updateData = (profilename=this.state.profilename) => {
		this.updateDataCase( profilename );
		this.updateDataAccount( profilename );
	}

	// bind versions of CRUD
	// labels
	configLabel = {
		service: labelService,
		list: "list",
		dataName: "labels",
	};
	listLabels = listSync.bind(this, this.configLabel);

	// categories
	configCategory = {
		service: categoryService,
		list: "list",
		dataName: "categories",
	};
	listCategories = listSync.bind(this, this.configCategory);

	// profile drawer
	configProfile = {
		service: profileService,
		create: "create",
		retrieve: "retrieve",
		dataName: "profiles",
	};
	createProfile = createSync.bind(this, this.configProfile);
	createProfileSync = record => this.createProfile(record)
		.then( res => this.listEmails() )
		.then( res => this.handleSearch(record.email))
		.then( res => {
			this.setState({ 
				visibleProfile: false,
				profileDrawerKey: Date.now(),
				record: {},
			});
		});
	retrieveNextIdProfile = retrieveSync.bind(this, {
		...this.configProfile,
		retrieve: "retrieveNextId",
	});


	// email table
	configEmail = {
		service: emailService,
		create: "create",
		retrieve: "retrieve",
		list: "list",
		update: "update",
		hide: "hide",
		dataName: "emails",
	};
	createEmail = createSync.bind(this, this.configEmail);
	createEmailSync = async record => {
		await this.createEmail(record);
		this.updateDataEmail();
	}
	listEmails = listSync.bind(this, this.configEmail);
	updateEmail = updateSync.bind(this, this.configEmail);
	updateEmailSync = async (id, record) => {
		await this.updateEmail(id, record);
		await this.setState({ spinning: true }, async () => {
			await this.listEmails(); // might affect profile
			await this.listCases(); // might affect queried email
			this.setState({ spinning: false });
		});
		this.updateDataCase();
	}
	hideEmail = hideSync.bind(this, this.configEmail);
	hideEmailSync = async ids => {
		await this.hideEmail(ids);
		await this.setState({ spinning: true }, async () => {
			await this.listCases(); // do not actually need this line
			this.setState({ spinning: false });
		});
		this.updateDataCase();
	}

	// case table
	configCase = {
		service: caseService,
		create: "create",
		retrieve: "retrieve",
		list: "list",
		update: "update",
		hide: "hide",
		dataName: "cases",
	};
	createCase = createSync.bind(this, this.configCase);
	createCaseSync = async record => {
		const response = await this.createCase(record);
		this.updateDataCase();
		return response; // for add button in case table
	}
	listCases = listSync.bind(this, this.configCase);
	retrieveNextId = retrieveSync.bind(this, {
		...this.configCase,
		retrieve: "retrieveNextId",
	});
	updateCase = updateSync.bind(this, this.configCase);
	updateCaseSync = async (id, record) => {
		await this.updateCase(id, record);
		this.updateDataCase();
	}
	hideCase = hideSync.bind(this, this.configCase);
	hideCaseSync = async ids => {
		await this.hideCase(ids);
		this.updateDataCase();
	}
	bindCase = updateSync.bind(this, {...this.configCase, update: 'bind'});
	bindCaseSync = async (id, record) => {
		const merge = await this.bindCase(id, record);
		this.updateDataCase();
		return merge;
	}
	unbindCase = updateSync.bind(this, {...this.configCase, update: 'unbind'});
	unbindCaseSync = async (id, record) => {
		await this.unbindCase(id, record);
		this.updateDataCase();
	}

	// account table
	configAccount = {
		service: accountService,
		create: "create",
		retrieve: "retrieve",
		list: "list",
		update: "update",
		hide: "hide",
		dataName: "accounts",
	};
	createAccount = createSync.bind(this, this.configAccount);
	createAccountSync = async record => {
		await this.createAccount(record);
		this.updateDataAccount();
	}
	listAccounts = listSync.bind(this, this.configAccount);
	updateAccount = updateSync.bind(this, this.configAccount);
	updateAccountSync = async (id, record) => {
		await this.updateAccount(id, record);
		await this.setState({ spinning: true }, async () => {
			await this.listCases(); // might affect account bound
			this.setState({ spinning: false });
		});
		this.updateData();
	}
	hideAccount = hideSync.bind(this, this.configAccount);
	hideAccountSync = async ids => {
		await this.hideAccount(ids);
		await this.setState({ spinning: true }, async () => {
			await this.listCases();
			this.setState({ spinning: false });
		});
		this.updateData();
	}
	banAccount = updateSync.bind(this,{...this.configAccount, update: "ban"});
	banAccountSync = async (id, record) => {
		await this.banAccount(id, record);
		this.updateDataAccount();
	}

	// refresh the page
	refreshPage = (profilename=this.state.profilename) => {
		this.setState({ profilename, spinning: true }, async () => {
			await this.listEmails();
			await this.listCases();
			await this.listAccounts();
			this.updateData(profilename); 
			this.setState({ spinning: false });
		});
	}

	render(){
		return (
			<div className='Query'>
				<Spin spinning={ this.state.spinning }>
					<Row style={{ margin: "16px" }}>
						<Col 
							style={{ fontSize: '24px', textAlign: 'left' }}
							span={ 12 } 
						>
							<Space size="large">
								<QuestionCircleOutlined />
								<strong>Queries</strong>
							</Space>
						</Col>
					</Row>
					<Row style={{ margin: "16px" }}>
						<Col 
							style={{ fontSize: '24px', textAlign: 'left' }}
							span={ 12 } 
						>
							<Space size="large">
								<AutoComplete
									id={ "autosearch" }
									onChange={ this.handleChange }
									onSelect={ this.handleSearch }
									options={ this.state.options }
									style={{ width: 320 }}
								>
									<Search
										onSearch={ this.handleSearch }
										placeholder="Search Profile by Email"
										size="middle"
										allowClear
									/>
								</AutoComplete>
								<Button
									size="middle"
									onClick={ this.handleClickProfile }
								>
									Create Profile
								</Button>
							</Space>
						</Col>
					</Row>
					<div>
						<ProfileDrawer
							tableDrawerKey={ this.state.profileDrawerKey }
							// data props
							record={ this.state.record }
							labels={ this.state.labels }
							// display props
							visible={ this.state.visibleProfile } 
							// api aprops
							onSubmit={ this.createProfileSync }
							onClose={ this.handleCloseProfile }
						>
						</ProfileDrawer>
					</div>
					<Card
						style={{ margin: "16px" }}
					>
						<Email 
							// data props
							data={ this.state.dataEmail }
							profilename={ this.state.profilename }
							labels={ this.state.labels }
							// display props
							tableHeader={ <><strong>Profile</strong></> }
							isSmall={ true }
							showHeader={ this.state.showHeader }
							showDropdown={ this.state.showDropdown }
							// api props
							create={ this.createEmailSync }
							edit={ this.updateEmailSync }
							delete={ this.hideEmailSync }
						/>
					</Card>
					<Card
						style={{ margin: "16px" }}
					>
						<Case
							// data props
							data={ this.state.dataCase }
							dataEmail={ this.state.dataEmail }
							dataAccount={ this.state.dataAccount }
							email={ this.state.email }
							emailId={ this.state.emailId }
							emails={ this.state.emails }
							cases={ this.state.cases }
							accounts={ this.state.accounts }
							categories={ this.state.categories }
							labels={ this.state.labels }
							// display props
							tableHeader={ <><strong>Cases</strong></> }
							isSmall={ true }
							showHeader={ this.state.showHeader }
							showDropdown={ this.state.showDropdown }
							// api props
							create={ this.createCaseSync }
							list={ this.listCases }
							retrieveNextId={ this.retrieveNextId }
							edit={ this.updateCaseSync }
							bind={ this.bindCaseSync }
							unbind={ this.unbindCaseSync }
							delete={ this.hideCaseSync }
							updateDataCase={ this.updateDataCase }
							refreshPage={ this.refreshPage }
							ban={ this.banAccountSync }
						/>
					</Card>
					<Card
						style={{ margin: "16px" }}
					>
						<Account
							// data props
							data={ this.state.dataAccount }
							profilename={ this.state.profilename }
							// display props
							tableHeader={ <><strong>Accounts</strong></> }
							isSmall={ true }
							showHeader={ this.state.showHeader }
							showDropdown={ this.state.showDropdown }
							// api props
							create={ this.createAccountSync }
							edit={ this.updateAccountSync }
							ban={ this.banAccountSync }
							delete={ this.hideAccountSync }
						/>
					</Card>
				</Spin>
			</div>
		);
	}
}

export { Query };
