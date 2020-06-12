import React, { Component } from 'react';

/*
		This component is a drawer with a form input
		It requires 7 props

		variable 'tableDrawerKey' for refreshing the component

		variable 'drawerTitle' for the title of the drawer
		variable 'visible' for the opening and closing of the drawer
		function 'onClose' for clicing the Cancel button 

		variable 'record' for filling the form 
		variable 'formItems' for defining the input fields in the form
		variable 'disabled' for disabling the input fields in the form
		function 'onSubmit' for form submit
*/

// import styling from ant design
import { 
	Button, Form, Divider, Input, Select, Descriptions, Radio,
	Switch, Row, Col, Card, Modal, Drawer, Tag, Collapse, Space, message,
	Spin, notification,
} from 'antd';
import { 
	CopyOutlined,
	NodeIndexOutlined,
} from '@ant-design/icons';

// import shared components
import TableBody from '../../_components/TableBody'
import SearchableInput from '../../_components/SearchableInput'
import RichTextOutput from '../../_components/RichTextOutput'
import TableDropdown from './TableDropdown'


const { Item } = Descriptions;
const { Panel } = Collapse;
const { Option } = Select;

class TableDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// populate the email table
			dataCase: [],
			// populate the email table
			dataEmail: [],
			// populate the account table body with data
			dataAccount: [],
			// populate the action table
			dataAction: [],
			// opening and closing of the action drawer
			visibleAction: false,
			formKey: Date.now(),
			// opening and closing of the edit drawer
			visibleEdit: false,
			formKeyEdit: Date.now(),
			// opening and closing of the bind drawer
			visibleBind: false,
			formKeyBind: Date.now(),
			// for modal
			visibleModal: false,
			// for Radio
			valueRadio: "title",
			searchProperty: "title",
			// for Switch
			templateLang: "Chn",
			// for Collapse
			searchInput: "",
			searchResults: this.allOptions,
			allOptions: this.allOptions,
			// for Spin
			loading: false,
			// for SearchableInput
			modalKey: Date.now(),
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ 
			dataCase: nextProps.dataCase ? [ nextProps.dataCase ] : [], 
			dataEmail: nextProps.dataEmail ? [ nextProps.dataEmail ] : [], 
			dataAccount: nextProps.dataAccount ? [ nextProps.dataAccount ] : [], 
			dataAction: nextProps.dataCase ? nextProps.dataCase.actions : [], 
		});
	}

	// layout for forms
	layout = {
		labelCol: {
			span: 8,
		},
		wrapperCol: {
			span: 12,
		},
	};
	tailLayout = {
		wrapperCol: {
			offset: 8,
			span: 16,
		},
	};

	allCases = [
		{
			key: '1',
			casename: 'alice account unban',
			remarks: 'The user has been banned once before',
			status: 'pending',
			createdAt: new Date('2020-05-20T14:20:20').toISOString().split('.')[0].replace('T', ' '),
			relatedEmail: 'alice@gmail.com',
			relatedAccount: 'alice@facebook.com',
		},
	];

	columnsCase = [
		{
			title: 'Case Name',
			dataIndex: 'casename',
			key: 'casename',
			width: '34%',
			setFilter: false
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: '33%',
			setFilter: false
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: '33%',
			setFilter: false
		},
	];

	// define form items for action Drawer
	formItems = [
		{
			label: 'Action',
			name: 'action',
			rules: [
				{
					required: true,
					message: 'action cannot be empty',
				},
			],
			editable: true,
			input: (
				<Select>
					<Option value="reply">Reply</Option>
					<Option value="defer">Defer</Option>
					<Option value="approve">Approve</Option>
					<Option value="reject">Reject</Option>
				</Select>
			)
		},			
		{
			label: 'Details',
			name: 'details',
			rules: [
				{
					required: true,
					message: 'details cannot be empty',
				}
			],
			editable: true,
			input: (
				<Input.TextArea
					autoSize={{ minRows: 6, maxRows: 10 }}
					maxLength={255}
					allowClear
				/>
			)
		},
	];

	// define form items for edit Drawer
	formItemsEdit = [
		{
			label: 'Case Name',
			name: 'casename',
			rules: [
				{
					required: true,
					message: 'casename cannot be empty',
				}
			],
			editable: true,
			input: (
				<Input
					maxLength={255}
					allowClear
				/>
			)
		},
		{
			label: 'Remarks',
			name: 'remarks',
			rules: [
				{
					required: true,
					message: 'remarks cannot be empty',
				},
			],
			editable: true,
			input: (
				<Input.TextArea
					autoSize={{ minRows: 6, maxRows: 10 }}
					maxLength={255}
					allowClear
				/>
			)
		},			
	];

	// define form items for edit Drawer
	formItemsBind = [
		{
			label: 'Bind to Account',
			name: 'relatedAccount',
			rules: [
				{
					required: true,
					message: 'field cannot be empty',
				}
			],
			editable: true,
			input: (
				<Select>
					{ this.props.allRelatedAccounts.map( item => 
						<Option value={ item.accountName }>
							{ item.accountName }
						</Option>
					) }
				</Select>
			)
		},
	];

	handleClickAction = record => {
		this.setState({
			visibleAction: true, 
		});
	}

	handleCloseAction = event => {
		console.log(event);
		this.setState({
			visibleAction: false, 
		});
	}

	handleSubmitAction = record => {
		console.log(record);
		message.success("The action has been peformed on the case successfully");
		this.setState({
			visibleAction: false, 
			formKey: Date.now(),
		});
	}

	handleClickEdit = record => {
		this.setState({
			visibleEdit: true, 
		});
	}

	handleCloseEdit = event => {
		console.log(event);
		this.setState({
			visibleEdit: false, 
		});
	}

	handleSubmitEdit = record => {
		console.log(record);
		this.props.onSubmit(record);
		this.setState({
			visibleEdit: false, 
			formKeyEdit: Date.now(),
		});
	}

	handleCloseBind = event => {
		console.log(event);
		this.setState({
			visibleBind: false, 
		});
	}

	handleSubmitBind = record => {
		console.log(this.props.allRelatedAccounts);
		const dataAccount = [ this.props.allRelatedAccounts
			.find( item => item.accountName === record.relatedAccount ) ];
		this.props.onSubmit(record);
		this.setState({
			dataAccount,
			visibleBind: false, 
			formKeyBind: Date.now(),
		});
	}

	allEmails = [
		{
			key: '1',
			email: 'alice@gmail.com',
			createdAt: new Date('2020-05-20T14:20:20').toISOString().split('.')[0].replace('T', ' '),
			updatedAt: new Date('2020-05-25T11:28:25').toISOString().split('.')[0].replace('T', ' '),
			profileID: '1',
		},
	];

	columnsEmail = [
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			width: '34%',
			setFilter: false
		},
		{
			title: 'Last Contacted At',
			dataIndex: 'updatedAt',
			key: 'updatedAt',
			width: '33%',
			setFilter: false
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: '33%',
			setFilter: false
		},
	];

	handleClickTemplates = event => {
		console.log(event);
		this.setState({
			visibleModal: true,
		});
	}

	handleCancel = event => {
		const sticktops = this.state.allOptions
			.filter( item => item.stickTop );
		const rest = this.state.allOptions
			.filter( item => !item.stickTop )
			.sort( this.dynamicSort("copiedCount") );
			
		this.setState({
			allOptions: [...sticktops, ...rest],
			searchResults: [...sticktops, ...rest],
			visibleModal: false,
			modalKey: Date.now(),
		});
	}

	allAccounts = [
		{
			key: '1',
			candidateID: 'u9876543210',
			accountName: 'alice@facebook.com',
			accountType: 'facebook',
			labels: ['banned'],
			createdAt: new Date('2020-05-20T14:20:20').toISOString().split('.')[0].replace('T', ' '),
		},
	];

	columnsAccount = [
		{
			title: 'Candidate ID',
			dataIndex: 'candidateID',
			key: 'candidateID',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Account Type',
			dataIndex: 'accountType',
			key: 'accountType',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Account Name',
			dataIndex: 'accountName',
			key: 'accountName',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Status',
			dataIndex: 'banned',
			key: 'banned',
			render: banned => ( banned ? 
				<Tag color="red">BANNED</Tag> : 
				<Tag color="blue">UNBANNED</Tag> ),
			width: '20%',
		},
	];

	onClickBan = () => {
		const key = `open${Date.now()}`;
		const btn = (
			<Button 
				type='primary' 
				size='small' 
				onClick={ this.handleClickConfirmBan.bind(this, notification.close, key) }
			>
				Confirm
			</Button>
		);
		notification.open({
			message: 'About to Ban This Account',
			description:
				<> 
					{"Are you sure to "} 
					<span style={{color: "#ec5f5b"}}><strong>Ban</strong></span> 
					{" this account?"}
				</>,
			btn,
			key,
			duration: 0,
			onClose: () => message.info("Ban Cancelled"),
		});
	};

	handleClickConfirmBan = (closeNotification, notificationKey) => {
		this.props.onClickBan();
		message.success("the account has been Banned successfully");
		closeNotification(notificationKey);
	};

	onClickUnban = () => {
		const key = `open${Date.now()}`;
		const btn = (
			<Button 
				type='primary' 
				size='small' 
				onClick={ this.handleClickConfirmUnban.bind(this, notification.close, key) }
			>
				Confirm
			</Button>
		);
		notification.open({
			message: 'About to UNban This Account',
			description:
				<> 
					{"Are you sure to "} 
					<span style={{color: "#5a9ef8"}}><strong>UNban</strong></span> 
					{" this account?"}
				</>,
			btn,
			key,
			duration: 0,
			onClose: () => message.info("Ban Cancelled"),
		});
	};

	handleClickConfirmUnban = (closeNotification, notificationKey) => {
		this.props.onClickUnban();
		message.success("the account has been UNbanned successfully");
		closeNotification(notificationKey);
	};

	columnsAction = [
		{
			title: 'Action',
			dataIndex: 'action',
			key: 'action',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Details',
			dataIndex: 'details',
			key: 'details',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: '25%',
			setFilter: false
		},
		{
			title: 'Created By',
			dataIndex: 'createdBy',
			key: 'createdBy',
			width: '25%',
			setFilter: false
		},
	];

	allActions = [
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

	handleClickBind = event => {
		event.stopPropagation();
		console.log(this.props.record.relatedAccount);
		if (this.props.record.relatedAccount)
			message.info("The case has been bound to an account already")
		else 
			this.setState({ visibleBind: true });
		
	}

	genExtra = () => (
		<Button
			type="ghost"
			style={{ border: "none" }}
			size="small"
			onClick={ this.handleClickBind }
		>
			<NodeIndexOutlined />
			Bind
		</Button>
	);

	title = (
		<Row>
			<Col span={ 8 }>
				Inspect A Case
			</Col>
			<Col
				span={ 2 }
				offset={ 12 }
			>
				<TableDropdown 
					onClickAction={ this.handleClickAction }
					onClickEdit={ this.handleClickEdit }
					onClickUnban={ this.onClickUnban }
					onClickBan={ this.onClickBan }
					onClickTemplates={ this.handleClickTemplates }
				/>
			</Col>
		</Row>	
	)

	titleModal = () => (
		<Row>
			<Col span={ 8 }>
				Search templates
			</Col>
			<Col
				span={ 3 }
				offset={ 12 }
			>
				<Radio.Group 
					size="small"
					buttonStyle="solid"
					defaultValue="Chn"
					onChange={this.handleChangeRadioLang} 
					value={this.state.templateLang}
				>
					<Radio.Button value={"Chn"}>CHN</Radio.Button>
					<Radio.Button value={"Eng"}>ENG</Radio.Button>
				</Radio.Group>
			</Col>
		</Row>	
	)

	handleSearch = data => {
		console.log(data);
		this.setState({ loading: true });
		setTimeout( () => this.updateCollapse(data) , 1000 );
	}

	updateCollapse = data => {
		const searchProperty = this.state.searchProperty;
		const searchResults = this.state.allOptions
			.filter( item => item[searchProperty].includes(data) );
		console.log(searchResults);
		this.setState({ 
			searchInput: data,
			searchResults,
			loading: false, 
		});
	}

	allOptions = [
		{
			key: '1',
			title: 'change of membership response',
			bodyEng: '<h2>By doing so, you will lose your privilge as abcdf</h2>',
			bodyChn: "<h2>QQQQQQQQQQDDDDDDDDDDD</h2>",
			stickTop: false,
			copiedCount: 0,
			updatedAt: 0,
		},
		{
			key: '2',
			title: 'unban response',
			bodyEng: `<h2>please behave yourself</h2>
						<p>or you will be banned permanetly
						I am not kidding
						<strong>seriously</strong>
						I mean it
						stop laughing</p>
						`,
			bodyChn: "<strong>TTTTT</strong><em>AAAAAAAAAAAAAAAAA</em>",
			stickTop: false,
			copiedCount: 0,
			updatedAt: 1,
		},
		{
			key: '3',
			title: 'change of password response',
			bodyEng: `<h2>please provide your credentials</h2>
						<p><em>please please please</em>
						please please please
						please please please</p>
						`,
			bodyChn: "<strong>ASDASDF</strong><h2>ASDFASDFASDFASDFASDF</h2>",
			stickTop: false,
			copiedCount: 0,
			updatedAt: 2,
		},
		{
			key: '4',
			title: 'terms and conditions',
			bodyEng: `<h2>terms and conditions<h2><ol>
						<li>clause 1</li>
						<li>clause 2</li>
						<li>clause 3</li>
						<li>clause 4</li></ol>
						`,
			bodyChn: "<em>ZZZ</em> <strong>ZZZ1234</strong>",
			stickTop: false,
			copiedCount: 0,
			updatedAt: 3,
		},
	];

	handleChangeRadio = event => {
		const valueRadio = event.target.value;
		let searchProperty = valueRadio;
		if (searchProperty === "body")
				searchProperty += this.state.templateLang;
		this.setState({
			valueRadio,
			searchProperty,
		});
		message.info("Search Templates by " + valueRadio);
	};

	handleChangeRadioLang = event => {
		const templateLang = event.target.value;
		this.setState({ templateLang })
		const valueRadio = this.state.valueRadio;
		let searchProperty = valueRadio;
		if (searchProperty === "body") {
				searchProperty += templateLang;
				this.setState({ searchProperty })
		}
		message.info("Template Bodies Shown in " + 
			( templateLang === "Chn" ? "Chinese" : "English" ) );
	}

	handleClickCopy = template => {
		const key = "body" + this.state.templateLang;
		this.copyToClip( template[key] )
		const allOptions = this.state.allOptions.map( item => {
			if (item.key  === template.key)
				 item.copiedCount++;	
			return item;
		});
		console.log(allOptions);
		this.setState({ allOptions });
		message.success("Template Copied");
	}


	handleChangeSwitchStickTop = (key, checked) => {
		console.log("hello");
		console.log(checked);
		console.log(key);
		let allOptions = this.state.allOptions.map( item => {
			if (item.key === key) {
				item.stickTop = checked;
				item.updatedAt = Date.now();
			}
			return item;
		});

		// sort the array accordingly
		allOptions.sort(this.dynamicSort("stickTop"));

		let searchResults = this.state.searchResults.slice();
		searchResults.sort(this.dynamicSort("stickTop"));

		console.log("search results");
		console.log(searchResults);
		this.setState({
			allOptions,
			searchResults,
		});
		const panel = document.getElementById("panel" + key);
		const bgcolor = panel.style.backgroundColor;
		panel.style.backgroundColor = "#a9a9a9";
		console.log( panel.style.backgroundColor );
		setTimeout( () => {
			panel.style.backgroundColor = bgcolor;
			}, 500 );
	}

	genExtraModal = item => (
		<div
			onClick={ event => event.stopPropagation() }
		>
		<Space size="middle">
			<Switch 
				checkedChildren="top"
				checked={ item.stickTop } 
				defaultChecked={ item.stickTop } 
				onChange={ this.handleChangeSwitchStickTop.bind(this, item.key) }
			/>
			<Button
				type="ghost"
				style={{ border: "none" }}
				size="small"
				onClick={ this.handleClickCopy.bind(this, item) }
			>
				<CopyOutlined />
			</Button>
		</Space>
		</div>
	);

	copyToClip(str) {
		function listener(e) {
			e.clipboardData.setData("text/html", str);
			e.clipboardData.setData("text/plain", str);
			e.preventDefault();
		}
		document.addEventListener("copy", listener);
		document.execCommand("copy");
		document.removeEventListener("copy", listener);
	};

	dynamicSort(property) {
			var sortOrder = 1;

			if(property[0] === "-") {
					sortOrder = -1;
					property = property.substr(1);
			}

			return function (a,b) {
					if (typeof a[property] === "string") {
						if(sortOrder === -1){
								return b[property].localeCompare(a[property]);
						}else{
								return a[property].localeCompare(b[property]);
						}        
					} else {
						if(sortOrder === -1){
								return a[property] - b[property];
						}else{
								return b[property] - a[property];
						}        
					}
			}
	}

	render(){
		return (
			<div 
				className='TableDrawer'
				key={ this.props.tableDrawerKey } 
			>
				<Drawer
					title={ this.title }
					width={ 1000 }
					bodyStyle={{ paddingBottom: 80 }}
					visible={ this.props.visible }
					onClose={ this.props.onClose }
				>
					<Card
						style={{ marginBottom: "16px", background: "#fafafa" }}
					>
						<Descriptions 
							column={ 3 }
						>
							<Item label="Case Name"> 
								{ this.props.record.casename }
							</Item>
							<Item label="Status">
								{ this.props.record.status }
							</Item>
							<Item label="Created At">
								{ this.props.record.createdAt }
							</Item>
							<Item 
								label="Remarks" 
								span = { 2 } 
							>
								{ this.props.record.remarks }
							</Item>
							<Item 
								label="Labels"
								span = { 1 } 
							>
								{ this.state.dataEmail[0]?.labels?.map(tag => {
									let color = 'blue';
									switch (tag) {
										case 'burning' :
											color = 'magenta';
											break;
										case 'hot' :
											color = 'red';
											break;
										case 'temperate' :
											color = 'orange';
											break;
										case 'warm' :
											color = 'gold';
											break;
										case 'agreeable' :
											color = 'green';
											break;
										case 'cold' :
											color = 'blue';
											break;
										case 'icy' :
											color = 'geekblue';
											break;
										case 'freezing' :
											color = 'purple';
											break;
										default :
											color = 'lime';
											break;
									}
									return (
										<Tag color={color} key={tag}>
											{tag.toUpperCase()}
										</Tag>
									);
								})}
							</Item>
						</Descriptions>
					</Card>
					<Form
						{ ...this.layout }
						name='basic'
						initialValues={{
							remember: true,
						}}
						onFinish={ this.props.onSubmit }
						onFinishFailed={ this.onFinishFailed }
					>

					<Collapse 
						defaultActiveKey={
							this.props.disabled ? ['1', '2', '3'] : ['1']
						} 
						expandIconPosition="left"
					>
							<Panel 
								header="Action History" 
								key="4"
							>
								<TableBody
									columns={ this.columnsAction } 
									data={ this.state.dataAction ? this.state.dataAction : [] } 
									isSmall={ true }
									pagination={ false }
								/>
							</Panel>
							<Panel 
								header="Related Email" 
								key="2"
							>
								<TableBody
									columns={ this.columnsEmail } 
									data={ this.state.dataEmail ? this.state.dataEmail : [] }
									isSmall={ true }
									pagination={ false }
								/>
							</Panel>
							<Panel 
								header="Related Account" 
								key="3"
								extra={ this.genExtra() }
							>
								<TableBody
									columns={ this.columnsAccount } 
									data={ this.state.dataAccount ? this.state.dataAccount : [] } 
									isSmall={ true }
									pagination={ false }
								/>
							</Panel>
						</Collapse>
						<Divider />
						{ this.props.disabled ? <></> : 
							<div style={{ textAlign:'right' }} >
								<Button 
									onClick={ this.props.onClose } 
									style={{ marginRight: 8 }}
								>
									Cancel
								</Button>
								<Button 
									type='primary' 
									htmlType='submit'
								>
									Submit
								</Button>
							</div>
						}
					</Form>
				</Drawer>
				<div>
					<Drawer
						key={ this.state.tableDrawerKey }
						title="Perform An Action on A Case"
						width={ 618 }
						bodyStyle={{ paddingBottom: 80 }}
						visible={ this.state.visibleAction } 
						onClose={ this.handleCloseAction }
					>
						<Form
							key={ this.state.formKey }
							labelCol={ { span: 8 } }
							wrapperCol={ { span: 16 } }
							name='basic'
							initialValues={{
								remember: true,
							}}
							onFinish={ this.handleSubmitAction }
							onFinishFailed={ this.onFinishFailed }
						>
							{ this.formItems.map( item => 
								(
									<Form.Item
										key={ item.name }
										label={ item.label }
										name={ item.name }
										rules={ item.rules }
										initialValue={ "" }
									>
										{ item.input }
									</Form.Item>
								)
							) }
							<Divider />
							<div style={{ textAlign:'right' }} >
								<Button 
									onClick={ this.handleCloseAction } 
									style={{ marginRight: 8 }}
								>
									Cancel
								</Button>
								<Button 
									type='primary' 
									htmlType='submit'
								>
									Submit
								</Button>
							</div>
						</Form>
					</Drawer>
				</div>
				<div>
					<Drawer
						title="Edit A Case"
						width={ 618 }
						bodyStyle={{ paddingBottom: 80 }}
						visible={ this.state.visibleEdit } 
						onClose={ this.handleCloseEdit }
					>
						<Form
							key={ this.state.formKeyEdit }
							labelCol={ { span: 8 } }
							wrapperCol={ { span: 16 } }
							name='basic'
							initialValues={{
								remember: true,
							}}
							onFinish={ this.handleSubmitEdit }
							onFinishFailed={ this.onFinishFailedEdit }
						>
							{ this.formItemsEdit.map( item => 
								(
									<Form.Item
										key={ item.name }
										label={ item.label }
										name={ item.name }
										rules={ item.rules }
										initialValue={ this.props.record[item.name] }
									>
										{ item.input }
									</Form.Item>
								)
							) }
							<Divider />
							<div style={{ textAlign:'right' }} >
								<Button 
									onClick={ this.handleCloseEdit } 
									style={{ marginRight: 8 }}
								>
									Cancel
								</Button>
								<Button 
									type='primary' 
									htmlType='submit'
								>
									Submit
								</Button>
							</div>
						</Form>
					</Drawer>
				</div>
				<div>
					<Drawer
						title="Bind to An Account"
						width={ 618 }
						bodyStyle={{ paddingBottom: 80 }}
						visible={ this.state.visibleBind } 
						onClose={ this.handleCloseBind }
					>
						<Form
							key={ this.state.formKeyBind }
							labelCol={ { span: 8 } }
							wrapperCol={ { span: 16 } }
							name='basic'
							initialValues={{
								remember: true,
							}}
							onFinish={ this.handleSubmitBind }
							onFinishFailed={ this.onFinishFailedBind }
						>
							{ this.formItemsBind.map( item => 
								(
									<Form.Item
										key={ item.name }
										label={ item.label }
										name={ item.name }
										rules={ item.rules }
									>
										<Select>
											{ this.props.allRelatedAccounts.map( item => 
												<Option 
													key={ item.accountName }
													value={ item.accountName }
												>
													{ item.accountName }
												</Option>
											) }
										</Select>
									</Form.Item>
								)
							) }
							<Divider />
							<div style={{ textAlign:'right' }} >
								<Button 
									onClick={ this.handleCloseBind } 
									style={{ marginRight: 8 }}
								>
									Cancel
								</Button>
								<Button 
									type='primary' 
									htmlType='submit'
								>
									Submit
								</Button>
							</div>
						</Form>
					</Drawer>
				</div>
				<div>
					<Modal
						key={ this.state.modalKey }
						title={ this.titleModal() }
						width={ 900 }
						style={{ top: 20 }}
						bodyStyle={{ minHeight: 600, overflow: "auto" }}
						visible={ this.state.visibleModal }
						onCancel={ this.handleCancel }
						footer={ null }
					>
						<div
							style={{ margin: "16px 4px" }}
						>
							<Space>
								Search By
								<Radio.Group onChange={this.handleChangeRadio} value={this.state.valueRadio}>
									<Radio value={"title"}>Title</Radio>
									<Radio value={"body"}>Body</Radio>
								</Radio.Group>
								<SearchableInput
									allOptions={ this.allOptions }
									searchProperty={ this.state.searchProperty }
									onSearch={ this.handleSearch }
									placeholder={ "Search Templates by " + this.state.valueRadio }
								/>
							</Space>
						</div>
						<div>
							<Spin spinning={ this.state.loading }>
								<Collapse 
									expandIconPosition="left"
									accordion
								>
										{
											this.state.searchResults.map( item => (
												<Panel 
													id={ "panel"+item.key }
													header={ item.title }
													key={ item.key }
													extra={ this.genExtraModal(item) }
												>
													<RichTextOutput 
														body={ this.state.templateLang === "Chn" ?
															item.bodyChn : item.bodyEng }
													/>
												</Panel>
											) )
										}
								</Collapse>
							</Spin>
						</div>
					</Modal>
				</div>
			</div>
		);
	}
}

export default TableDrawer;
