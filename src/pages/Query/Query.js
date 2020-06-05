import React, { Component } from 'react';

// import styling from ant desgin
import { QuestionCircleOutlined } from '@ant-design/icons';
import { AutoComplete, Input, Space, Button, Card, Row, Col, message } from 'antd';

import Email from "../Email"
import Case from "./Case"
import Account  from "../Account"
import TableDrawer from "../../_components/TableDrawer"

const { Search } = Input;

class Query extends Component {
	constructor(props) {
		super(props);
		this.state = {
			options : [],
			email : "",
			tableDrawerKey: Date.now(),
			record: {},
			loading: false,
			visible: false,
			dataEmail: [],
			dataCase: [],
			dataAccount: [],
		};
	}
	
	allEmails = [
		{
			key: '1',
			email: 'alice@gmail.com',
			createdAt: new Date('2020-05-20T14:20:20').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-25T11:28:25').toISOString().split('.')[0].replace('T', ' '),
			profileID: '1',
		},
		{
			key: '2',
			email: 'bob@gmail.com',
			createdAt: new Date('2020-05-22T17:30:15').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-24T13:48:32').toISOString().split('.')[0].replace('T', ' '),
			profileID: '2',
		},
		{
			key: '21',
			email: 'bob1234@gmail.com',
			createdAt: new Date('2020-05-22T17:30:15').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-24T13:48:32').toISOString().split('.')[0].replace('T', ' '),
			profileID: '2',
		},
		{
			key: '3',
			email: 'charlie@hotmail.com',
			createdAt: new Date('2020-05-21T10:15:45').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-22T18:23:28').toISOString().split('.')[0].replace('T', ' '),
			profileID: '3',
		},
		{
			key: '31',
			email: 'charlie1234@hotmail.com',
			createdAt: new Date('2020-05-21T10:15:45').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-22T18:23:28').toISOString().split('.')[0].replace('T', ' '),
			profileID: '3',
		},
		{
			key: '32',
			email: 'charlie4321@hotmail.com',
			createdAt: new Date('2020-05-21T10:15:45').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-22T18:23:28').toISOString().split('.')[0].replace('T', ' '),
			profileID: '3',
		},
		{
			key: '4',
			email: 'david@gmail.com',
			createdAt: new Date('2020-05-20T16:16:20').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-25T12:33:18').toISOString().split('.')[0].replace('T', ' '),
			profileID: '4',
		},
	];

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

	allAccounts = [
		{
			key: '1',
			candidateID: 'u9876543210',
			accountName: 'alice@facebook.com',
			accountType: 'facebook',
			labels: ['banned'],
			createdAt: new Date('2020-05-20T14:20:20').toISOString().split('.')[0].replace('T', ' '),
		},
		{
			key: '2',
			candidateID: 'u9876543212',
			accountName: '0085212345678',
			accountType: 'phone',
			labels: ['normal'],
			createdAt: new Date('2020-05-22T17:30:15').toISOString().split('.')[0].replace('T', ' '),
		},
		{
			key: '3',
			candidateID: 'u9876543213',
			accountName: 'charlie@facebook.com',
			accountType: 'facebook',
			labels: ['spammer', 'banned'],
			createdAt: new Date('2020-05-21T10:15:45').toISOString().split('.')[0].replace('T', ' '),
		},
		{
			key: '4',
			candidateID: 'u9876543214',
			accountName: '0085287654321',
			accountType: 'phone',
			labels: ['VIP'],
			createdAt: new Date('2020-05-20T16:16:20').toISOString().split('.')[0].replace('T', ' '),
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Email',
			name: 'email',
			rules: [
				{
					required: true,
					message: 'email cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
				/>
			)
		},
	];

	handleChange = data => {
		const options = this.allEmails
		.map( item => item.email )
		.filter( item => item.includes(data) )
		.map( entry => ({ value:entry }) )
		this.setState({ options });
	}

	handleSearch = data => {
		this.setState({ loading: true });
		setTimeout( () => this.updateTables(data), 500);
	}

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
		console.log(dataEmail);
		console.log(dataCase);
		console.log(dataAccount);
		this.setState({ loading: false });
		this.setState({ email, dataEmail, dataCase, dataAccount });
		if (profileID) {
			message.success("Profile Found");
		} else {
			message.info("Profile Not Found");
			this.setState({ tableDrawerKey: Date.now(), record: { email } });
		}
	}

	handleClick = event => this.setState({ visible: true });

	handleClose = event => this.setState({ visible: false });

	handleSubmit = record => {
		record = {
			key: Date.now(),
			email: record.email,
			createdAt: new Date().toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date().toISOString().split('.')[0].replace('T', ' '),
			profileID: Date.now(),
		};
		this.allEmails.push(record);
		this.setState({ visible: false });
		this.handleSearch(record.email);
		this.setState({ tableDrawerKey: Date.now(), record: {} });
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
								onChange={ this.handleChange }
								onSelect={ this.handleSearch }
								options={ this.state.options }
								style={{ width: 320 }}
							>
								<Search
									onSearch={ this.handleSearch }
									placeholder="Search Profile by Email"
									size="middle"
								/>
							</AutoComplete>
							<Button
								size="middle"
								onClick={ this.handleClick }
							>
								Create Profile
							</Button>
						</Space>
					</Col>
				</Row>
				<Card
					style={{ margin: "16px" }}
					loading={ this.state.loading }
				>
					<Email 
						data={ this.state.dataEmail }
						tableHeader={ <><strong>Profile</strong></> }
						isSmall={ true }
					/>
				</Card>
				<Card
					style={{ margin: "16px" }}
					loading={ this.state.loading }
				>
					<Case
						data={ this.state.dataCase }
						dataEmail={ this.state.dataEmail }
						dataAccount={ this.state.dataAccount }
						email={ this.state.email }
						tableHeader={ <><strong>Cases</strong></> }
						isSmall={ true }
					/>
				</Card>
				<Card
					style={{ margin: "16px" }}
					loading={ this.state.loading }
				>
					<Account
						data={ this.state.dataAccount }
						tableHeader={ <><strong>Accounts</strong></> }
						isSmall={ true }
					/>
				</Card>
				<div>
					<TableDrawer 
						tableDrawerKey={ this.state.tableDrawerKey }
						drawerTitle="Create A New Profile"
						record={ this.state.record }
						visible={ this.state.visible } 
						formItems={ this.formItems }
						disabled={ false } 
						onClose={ this.handleClose }
						onSubmit={ this.handleSubmit }
					/>
				</div>
			</div>
		);
	}
}

export default Query;
