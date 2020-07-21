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
	message, 
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

// import shared and child components
import { ProfileDrawer } from "./ProfileDrawer"
import { Account } from "./Account"
import { Case } from "./Case/Case"
import { Email } from "./Email"

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
const { create, list, listCombined, update, ban, bind, hide } = backend;
const { Search } = Input;

class Query extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false, // for Spin
			showHeader: false, // for header in each table
			showDropdown: false, // for dropdown in each table
			options: [], // options for email search
			email : "", // current search
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
		this.listEmails();
		this.listCases();
		this.listAccounts();
		this.listLabels();
		this.listCategories();
	}

	// filter AutoComplete options when input field changes
	handleChange = data => {
		const options = this.state.emails
			.map( item => item.email )
			.filter( (item, index, array) => array.indexOf(item) === index )
			.filter( item => item.includes(data) )
			.map( item => ({ value: item }) );
		this.setState({ options });
	}

	// perform a search when the search button is pressed
	handleSearch = data => {
		this.setState({ loading: true });
		setTimeout( () => this.updateTables(data), 500);
	}

	// update all 3 tables upon a search
	updateTables = data => {
		const email = data;
		const profilename = this.state.emails
			.find( item => item.email === email )?.profilename;
		this.updateData(profilename);
		this.setState({ 
			email,
			profilename,
			loading: false,
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
				showHeader: false,
				showDropdown: false,
			});
		}
	}

	// refresh all 3 data streams 
	updateData = profilename => {
		const dataEmail = this.state.emails
			.filter( item => item.profilename === profilename );
		const emails = dataEmail.map( item => item.email );
		const dataCase = this.state.cases
			.filter( item => emails.includes( item.email ) )
//		const accounts = dataCase.map( item => item.accoutname );
//		const dataAccount = this.state.cases
//			.filter( item => accounts.includes( item.accountname ) );
		const dataAccount = this.state.accounts
			.filter( item => item.profilename === profilename );
		this.setState({
			dataEmail,
			dataCase,
			dataAccount,
		});
	}

	// handlers for profile drawer

	handleClickProfile = event => {
		this.setState(
			{record: { email: this.state.email }},
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

	// bind versions of CRUD
	// labels
	listLabels = list.bind(this, labelService, 'labels');
	// categories
	listCategories = list.bind(this, categoryService, 'categories');

	// profile drawer
	createProfile = create.bind(this, profileService, 'profiles');
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

	// email table
	createEmail = create.bind(this, emailService, 'emails');
	createEmailSync = record => this.createEmail(record)
		.then( res => this.listEmails() )
		.then( res => this.updateData(this.state.profilename));
	listEmails = listCombined
		.bind(this, emailService, 'emails', ['labelname', 'label_color']);
	updateEmail = update.bind(this, emailService, 'emails');
	updateEmailSync = (id, record) => this.updateEmail(id, record)
		.then( res => this.listEmails() )
		.then( res => this.listCases() ) // might affect email 
		.then( res => this.updateData(this.state.profilename) );
	hideEmail = hide.bind(this, emailService, 'emails');
	hideEmailSync = ids => this.hideEmail(ids)
		.then( res => this.listEmails() )
		.then( res => this.updateData(this.state.profilename));

	// account table
	createAccount = create.bind(this, accountService, 'accounts');
	createAccountSync = record => this.createAccount(record)
		.then( res => this.listAccounts() )
		.then( res => this.updateData(this.state.profilename));
	listAccounts = list.bind(this, accountService, 'accounts');
	updateAccount = update.bind(this, accountService, 'accounts');
	updateAccountSync = (id, record) => this.updateAccount(id, record)
		.then( res => this.listAccounts() )
		.then( res => this.listCases() ) // might affect accountname
		.then( res => this.updateData(this.state.profilename));
	banAccount = ban.bind(this, accountService, 'accounts');
	banAccountSync = (id, record) => this.banAccount(id, record)
		.then( res => this.listAccounts() )
		.then( res => this.updateData(this.state.profilename));
	hideAccount = hide.bind(this, accountService, 'accounts');
	hideAccountSync = ids => this.hideAccount(ids)
		.then( res => this.listAccounts() )
		.then( res => this.listCases() ) // might delete the foreigh key
		.then( res => this.updateData(this.state.profilename));

	// case table
	createCase = create.bind(this, caseService, 'cases');
	createCaseSync = record => this.createCase(record)
		.then( res => this.listCases() )
		.then( res => this.updateData(this.state.profilename));
	listCases = list.bind(this, caseService, 'cases');
	updateCase = update.bind(this, caseService, 'cases');
	updateCaseSync = (id, record) => this.updateCase(id, record)
		.then( res => this.listCases() )
		.then( res => this.updateData(this.state.profilename));
	bindCase = bind.bind(this, caseService, 'cases');
	bindCaseSync = (id, record) => this.bindCase(id, record)
		.then( res => { this.listCases(); return res; } )
		.then( res => { this.updateData(this.state.profilename); return res; });
	hideCase = hide.bind(this, caseService, 'cases');
	hideCaseSync = ids => this.hideCase(ids)
		.then( res => this.listCases() )
		.then( res => this.updateData(this.state.profilename));

	// refresh the page
	refreshPage = profilename => {
		this.listEmails()
		.then( res => this.listCases())
		.then( res => this.listAccounts())
		.then( res => this.updateData(profilename) );
	}

	render(){
		return (
			<div className='Query'>
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
						loading={ this.state.loading }
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
						accounts={ this.state.accounts }
						categories={ this.state.categories }
						// display props
						loading={ this.state.loading }
						tableHeader={ <><strong>Cases</strong></> }
						isSmall={ true }
						showHeader={ this.state.showHeader }
						showDropdown={ this.state.showDropdown }
						// api props
						create={ this.createCaseSync }
						list={ this.listCases }
						edit={ this.updateCaseSync }
						bind={ this.bindCaseSync }
						delete={ this.hideCaseSync }
						refreshPage={ this.refreshPage }
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
						loading={ this.state.loading }
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
			</div>
		);
	}
}

export { Query };
