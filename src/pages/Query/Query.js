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
	notification, 
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

// import shared and child components
import Account  from "./Account"
import Case from "./Case"
import Email from "./Email"

// destructure child components
const { Search } = Input;

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
		};
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

	// filter AutoComplete options when input field changes
	handleChange = data => {
		const options = this.allEmails
			.map( item => item.email )
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
		const profileID = this.allEmails
			.find( item => item.email === email )?.profileID;
		const dataEmail = this.allEmails
			.filter( item => item.profileID === profileID );
		const emails = dataEmail.map( item => item.email );
		const dataCase = this.allCases
			.filter( item => emails.includes( item.relatedEmail ) )
		const accounts = dataCase.map( item => item.relatedAccount );
		const dataAccount = this.allAccounts
			.filter( item => accounts.includes( item.accountName ) );
		this.setState({ loading: false });
		this.setState({ email, dataEmail, dataCase, dataAccount });
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

	// handlers for CUD actions
	// create api
  create = (data, dataName, record) => {
		const dataCopied = data.slice();
		record.key = Date.now();
		record.createdAt = new Date().toISOString().split('.')[0].replace('T', ' ');
		record.updatedAt = new Date().toISOString().split('.')[0].replace('T', ' ');
		dataCopied.push(record);
		if (200) message.success('A new record has been created');
		this.setState({ [ dataName ] : dataCopied });
	}

	// edit api
  edit = (data, dataName, key, record) => {
		let dataCopied = data.slice();
		let originalRecord = dataCopied.find( item => item.key === key);
		let index = dataCopied.findIndex( item => item.key === key);
		Object.keys(record).forEach(item => originalRecord[item] = record[item])
		dataCopied[index] = originalRecord;
		if (200) message.success('The record has been edited');
		this.setState({ [ dataName ] : dataCopied });
	}

	// delete api
  delete = (data, dataName, keys) => {
		let dataCopied = data.slice();
		if (Array.isArray(keys)) {
			dataCopied = dataCopied.filter( 
				item => !keys.includes(item.key)
			);
			if (200) message.success('Multiple records have been deleted');
		} else {
			dataCopied = dataCopied.filter( 
				item => item.key !== keys
			);
			if (200) message.success('The record has been deleted');
		}
		this.setState({ [ dataName ] : dataCopied });
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
						create={ this.create.bind(this, this.state.dataEmail, 'dataEmail') }
						edit={ this.edit.bind(this, this.state.dataEmail, 'dataEmail') }
						delete={ this.delete.bind(this, this.state.dataEmail, 'dataEmail') }
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
						create={ this.create.bind(this, this.state.dataCase, 'dataCase') }
						edit={ this.edit.bind(this, this.state.dataCase, 'dataCase') }
						delete={ this.delete.bind(this, this.state.dataCase, 'dataCase') }
						onClickBan={ this.handleClickBan }
						onClickUnban={ this.handleClickUnban }
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
						create={ this.create.bind(this, this.state.dataAccount, 'dataAccount') }
						edit={ this.edit.bind(this, this.state.dataAccount, 'dataAccount') }
						delete={ this.delete.bind(this, this.state.dataAccount, 'dataAccount') }
					/>
				</Card>
			</div>
		);
	}
}

export { Query };
