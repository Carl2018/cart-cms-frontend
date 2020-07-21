import React, { Component } from 'react';

// import components from ant design
import { 
	AutoComplete, 
	Button, 
	Card, 
	Col, 
	Input, 
	Row, 
	Select, 
	Space, 
	message, 
	notification, 
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

// import shared and child components
import { Account } from "./Account"
import { Case } from "./Case/Case"
import { Email } from "./Email"

// import services
import { 
	accountService,
	caseService,
	emailService,
 } from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { create, list, listCombined, update, ban, bind, hide } = backend;
const { compare } = helpers;
const { Search } = Input;
const { Option } = Select

class Query extends Component {
	constructor(props) {
		super(props);
		this.state = {
			options : [], // options for AutoComplete
			email : "", // current search
			loading: false, // for Spin
			showHeader: false, // for header in each table
			showDropdown: false, // for dropdown in each table
			dataEmail: [], // for email table
			dataCase: [], // for case table
			dataAccount: [], // for account table
			// all emails
			emails: [],
			options: [], // options for email search
			// all cases
			cases: [],
			// all accounts
			accounts: [],
		};
	}
	
	componentDidMount() {
		this.listEmails();
		this.listCases();
		this.listAccounts();
	}

	// data from email table
	allEmails = [
		{
			key: '1',
			email: 'alice@gmail.com',
			labels: ['burning', 'hot'],
			createdAt: new Date('2020-05-20T14:20:20').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-25T11:28:25').toISOString().split('.')[0].replace('T', ' '),
			profileID: '1',
		},
		{
			key: '2',
			email: 'bob@gmail.com',
			labels: ['freezing','cold'],
			createdAt: new Date('2020-05-22T17:30:15').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-24T13:48:32').toISOString().split('.')[0].replace('T', ' '),
			profileID: '2',
		},
		{
			key: '21',
			email: 'bob1234@gmail.com',
			labels: ['temperate'],
			createdAt: new Date('2020-05-22T17:30:15').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-24T13:48:32').toISOString().split('.')[0].replace('T', ' '),
			profileID: '2',
		},
		{
			key: '3',
			email: 'charlie@hotmail.com',
			labels: ['warm', 'agreeable'],
			createdAt: new Date('2020-05-21T10:15:45').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-22T18:23:28').toISOString().split('.')[0].replace('T', ' '),
			profileID: '3',
		},
		{
			key: '31',
			email: 'charlie1234@hotmail.com',
			labels: ['icy'],
			createdAt: new Date('2020-05-21T10:15:45').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-22T18:23:28').toISOString().split('.')[0].replace('T', ' '),
			profileID: '3',
		},
		{
			key: '32',
			email: 'charlie4321@hotmail.com',
			labels: ['burning'],
			createdAt: new Date('2020-05-21T10:15:45').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-22T18:23:28').toISOString().split('.')[0].replace('T', ' '),
			profileID: '3',
		},
		{
			key: '4',
			email: 'david@gmail.com',
			labels: ['freezing', 'icy'],
			createdAt: new Date('2020-05-20T16:16:20').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-25T12:33:18').toISOString().split('.')[0].replace('T', ' '),
			profileID: '4',
		},
	];

	// data from action table
	actions = [
		{
			key: '1',
			action: 'open',
			details: 'opened a case',
			createdAt: new Date('2020-05-20T14:20:20').toISOString().split('.')[0].replace('T', ' '),
			createdBy: 'root',
		},
		{
			key: '2',
			action: 'reply',
			details: 'informed the user to wait for 1 day',
			createdAt: new Date('2020-05-21T14:20:20').toISOString().split('.')[0].replace('T', ' '),
			createdBy: 'root',
		},
		{
			key: '3',
			action: 'reply',
			details: 'informed the user that his account has been unbaned',
			createdAt: new Date('2020-05-21T14:20:20').toISOString().split('.')[0].replace('T', ' '),
			createdBy: 'andy',
		},
	];

	// data from case table
	allCases = [
		{
			key: '1',
			casename: 'alice account unban',
			remarks: 'The user has been banned once before',
			status: 'pending',
			createdAt: new Date('2020-05-20T14:20:20').toISOString().split('.')[0].replace('T', ' '),
			relatedEmail: 'alice@gmail.com',
			relatedAccount: 'alice@facebook.com',
			actions: this.actions,
		},
		{
			key: '2',
			casename: 'bob membership change',
			remarks: 'The user has been a VIP for 6 months',
			status: 'approved',
			createdAt: new Date('2020-05-22T17:30:15').toISOString().split('.')[0].replace('T', ' '),
			relatedEmail: 'bob@gmail.com',
			relatedAccount: '0085212345678',
			actions: this.actions,
		},
		{
			key: '21',
			casename: 'bob password change failed',
			remarks: 'made more than 3 attempts',
			status: 'approved',
			createdAt: new Date('2020-05-22T17:30:15').toISOString().split('.')[0].replace('T', ' '),
			relatedEmail: 'bob@gmail.com',
			relatedAccount: '0085212345678',
			actions: this.actions,
		},
		{
			key: '3',
			casename: 'charlie account unban',
			remarks: 'This is the first time the user got banned',
			status: 'pending',
			createdAt: new Date('2020-05-21T10:15:45').toISOString().split('.')[0].replace('T', ' '),
			relatedEmail: 'charlie@hotmail.com',
			relatedAccount: 'charlie@facebook.com',
			actions: this.actions,
		},
		{
			key: '4',
			casename: 'david passowrd change',
			remarks: 'The user has made too many failed attempts',
			status: 'pending',
			createdAt: new Date('2020-05-20T16:16:20').toISOString().split('.')[0].replace('T', ' '),
			relatedEmail: 'david@gmail.com',
			relatedAccount: '0085287654321',
			actions: this.actions,
		},
	];

	// data from account table
	allAccounts = [
		{
			key: '1',
			candidateID: 'u9876543210',
			accountName: 'alice@facebook.com',
			accountType: 'facebook',
			banned: true,
			labels: ['banned'],
			createdAt: new Date('2020-05-20T14:20:20').toISOString().split('.')[0].replace('T', ' '),
		},
		{
			key: '2',
			candidateID: 'u9876543212',
			accountName: '0085212345678',
			accountType: 'phone',
			banned: false,
			labels: ['normal'],
			createdAt: new Date('2020-05-22T17:30:15').toISOString().split('.')[0].replace('T', ' '),
		},
		{
			key: '3',
			candidateID: 'u9876543213',
			accountName: 'charlie@facebook.com',
			accountType: 'facebook',
			banned: false,
			labels: ['spammer', 'banned'],
			createdAt: new Date('2020-05-21T10:15:45').toISOString().split('.')[0].replace('T', ' '),
		},
		{
			key: '4',
			candidateID: 'u9876543214',
			accountName: '0085287654321',
			accountType: 'phone',
			banned: false,
			labels: ['VIP'],
			createdAt: new Date('2020-05-20T16:16:20').toISOString().split('.')[0].replace('T', ' '),
		},
	];

	// handler for the create profile button
	handleClickCreate = event => {
		const autosearch = document.getElementById("autosearch");
		const value = autosearch.value.trim();
		if (!value) {
			autosearch.style.backgroundColor = "#ffcccb";
			setTimeout( () => autosearch.style.backgroundColor = "#fff" , 1000 ); 
			message.info( "Email cannot be empty" );
		} else if ( this.allEmails.map( item => item.email ).includes(value) ) {
			message.info( "Email exists already" );
		} else {
			const record = { email: value };
			const key = `open${Date.now()}`;
			const btn = (
				<Button 
					type='primary' 
					size='small' 
					onClick={ 
						this.handleClickConfirm.bind(this, 
							notification.close, key, record) 
					}
				>
					Confirm
				</Button>
			);
			notification.open({
				message: 'About to Create A New Profile',
				description:
					<> 
						<div>
						{ `Are you sure you want to create a new profile 
							for the following email?` }
						</div>
						<div style={{ color: "#5a9ef8" }} >
						{ value }
						</div>
					</>,
				btn,
				key,
				duration: 0,
				onClose: () => message.info("Profile Create Cancelled"),
			});
		}
	}

	// handler for create profile confirmation
	handleClickConfirm = (closeNotification, notificationKey, record) => {
		this.handleSubmit(record);
		message.success("A new profile has been created successfully");
		closeNotification(notificationKey);
	};

	// handler for submitting a new profile
	handleSubmit = record => {
		record = {
			key: Date.now(),
			email: record.email,
			createdAt: new Date().toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date().toISOString().split('.')[0].replace('T', ' '),
			profileID: Date.now(),
		};
		this.allEmails.push(record);
		this.handleSearch(record.email);
	}

	// handler for ban button in child component
	handleClickBan = relatedAccount => {
		const dataAccount = this.state.dataAccount.map( item => {
			if (item.accountName === relatedAccount)
				item.banned = true;
			return item;
		})
		this.setState({ dataAccount });
	}

	// handler for unban button in child component
	handleClickUnban = relatedAccount => {
		const dataAccount = this.state.dataAccount.map( item => {
			if (item.accountName === relatedAccount)
				item.banned = false;
			return item;
		})
		this.setState({ dataAccount });
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
		const profileID = this.state.emails
			.find( item => item.email === email )?.profile_id;
		const dataEmail = this.state.emails
			.filter( item => item.profile_id === profileID );
		const emails = dataEmail.map( item => item.email );
		const dataCase = this.state.cases
			.filter( item => emails.includes( item.email ) )
//		const accounts = dataCase.map( item => item.accoutname );
//		const dataAccount = this.state.cases
//			.filter( item => accounts.includes( item.accountname ) );
		const dataAccount = this.state.accounts
			.filter( item => item.profile_id === profileID );
		console.log(this.state.emails);
		console.log(this.state.cases);
		console.log(this.state.accounts);
		console.log(dataEmail);
		console.log(dataCase);
		console.log(dataAccount);

		this.setState({
			loading: false,
			email, 
			dataEmail,
			dataCase,
			dataAccount,
		});
		if (profileID) {
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

	// bind versions of CRUD
	listCases = list.bind(this, caseService, 'cases');

	// email table
	createEmail = create.bind(this, emailService, 'emails');
	createEmailSync = record => this.createEmail(record)
		.then( res => this.listEmails() )
		.then( res => this.updateData(this.state.email));
	listEmails = listCombined
		.bind(this, emailService, 'emails', ['labelname', 'label_color']);
	updateEmail = update.bind(this, emailService, 'emails');
	updateEmailSync = (id, record) => this.updateEmail(id, record)
		.then( res => this.listEmails() )
		.then( res => { 
			const email = this.state.email === record.email ? 
				this.state.email : record.email;
			this.updateData(email);
		});
	hideEmail = hide.bind(this, emailService, 'emails');
	hideEmailSync = ids => this.hideEmail(ids)
		.then( res => this.listEmails() )
		.then( res => this.updateData(this.state.email));

	// account table
	createAccount = create.bind(this, accountService, 'accounts');
	createAccountSync = record => this.createAccount(record)
		.then( res => this.listAccounts() )
		.then( res => this.updateData(this.state.email));
	listAccounts = list.bind(this, accountService, 'accounts');
	updateAccount = update.bind(this, accountService, 'accounts');
	updateAccountSync = (id, record) => this.updateAccount(id, record)
		.then( res => this.listAccounts() )
		.then( res => this.updateData(this.state.email));
	banAccount = ban.bind(this, accountService, 'accounts');
	banAccountSync = (id, record) => this.banAccount(id, record)
		.then( res => this.listAccounts() )
		.then( res => this.updateData(this.state.email));
	hideAccount = hide.bind(this, accountService, 'accounts');
	hideAccountSync = ids => this.hideAccount(ids)
		.then( res => this.listAccounts() )
		.then( res => this.updateData(this.state.email));

	// case table
	createCase = create.bind(this, caseService, 'cases');
	createCaseSync = record => this.createCase(record)
		.then( res => this.listCases() )
		.then( res => this.updateData(this.state.email));
	listCases = list.bind(this, caseService, 'cases');
	updateCase = update.bind(this, caseService, 'cases');
	updateCaseSync = (id, record) => this.updateCase(id, record)
		.then( res => this.listCases() )
		.then( res => this.updateData(this.state.email));
	bindCase = bind.bind(this, caseService, 'cases');
	bindCaseSync = (id, record) => this.bindCase(id, record)
		.then( res => this.listCases() )
		.then( res => this.updateData(this.state.email));
	hideCase = hide.bind(this, caseService, 'cases');
	hideCaseSync = ids => this.hideCase(ids)
		.then( res => this.listCases() )
		.then( res => this.updateData(this.state.email));

	// refresh all 3 data streams 
	updateData = data => {
		console.log(data);
		const email = data;
		const profileID = this.state.emails
			.find( item => item.email === email )?.profile_id;
		const dataEmail = this.state.emails
			.filter( item => item.profile_id === profileID );
		const emails = dataEmail.map( item => item.email );
		const dataCase = this.state.cases
			.filter( item => emails.includes( item.email ) )
//		const accounts = dataCase.map( item => item.accoutname );
//		const dataAccount = this.state.cases
//			.filter( item => accounts.includes( item.accountname ) );
		const dataAccount = this.state.accounts
			.filter( item => item.profile_id === profileID );
		console.log(this.state.emails);
		console.log(dataEmail);
		this.setState({
			email, 
			dataEmail,
			dataCase,
			dataAccount,
		});
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
								onClick={ this.handleClickCreate }
							>
								Create Profile
							</Button>
						</Space>
					</Col>
				</Row>
				<Card
					style={{ margin: "16px" }}
				>
					<Email 
						// data props
						data={ this.state.dataEmail }
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
						// display props
						loading={ this.state.loading }
						tableHeader={ <><strong>Cases</strong></> }
						isSmall={ true }
						showHeader={ this.state.showHeader }
						showDropdown={ this.state.showDropdown }
						// api props
						onClickBan={ this.handleClickBan }
						onClickUnban={ this.handleClickUnban }
						create={ this.createCaseSync }
						edit={ this.updateCaseSync }
						bind={ this.bindCaseSync }
						delete={ this.hideCaseSync }
					/>
				</Card>
				<Card
					style={{ margin: "16px" }}
				>
					<Account
						// data props
						data={ this.state.dataAccount }
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
