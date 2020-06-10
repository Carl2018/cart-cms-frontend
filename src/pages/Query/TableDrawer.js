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
	Button, Form, Divider, Input, Select, Popconfirm, Descriptions, Radio,
	Switch, Row, Col, Card, Modal, Drawer, Tag, Collapse, Space, message,
	Spin,
} from 'antd';
import { 
	FormOutlined, 
	UserAddOutlined, 
	UserDeleteOutlined,
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
			// opening and closing of the process drawer
			visibleAction: false,
			formKey: Date.now(),
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

	static getDerivedStateFromProps(nextProps, prevState) {
		return {
			dataCase: nextProps.dataCase ? [ nextProps.dataCase ] : [],
			dataEmail: nextProps.dataEmail ? [ nextProps.dataEmail ] : [],
			dataAccount: nextProps.dataAccount ? [ nextProps.dataAccount ] : [],
			dataAction: nextProps.dataCase ? nextProps.dataCase.actions: [],
		};
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
			width: '15%',
			setFilter: false
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: '5%',
			setFilter: false
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: '15%',
			setFilter: false
		},
		{
			title: 'Actions',
			key: 'action',
			render: (text, record) => (
				<Space size='small'>
					<Button 
						type='link' 
						icon={ <FormOutlined /> }
						onClick={ this.handleClickAction.bind(this, record) }
					>
						action
					</Button>
				</Space>
			),
			width: '10%',
			setFilter: false
		},
	];

	// define form items for TableDrawer
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
					autoSize={{ minRows: 4, maxRows: 8 }}
					maxLength={255}
					allowClear
				/>
			)
		},
	];

	handleClickAction = record => {
		console.log("Process");
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

	handleSubmitProcess = record => {
		console.log(record);
		message.success("The action has been peformed on the case successfully");
		this.setState({
			visibleAction: false, 
			formKey: Date.now(),
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
			width: '30%',
			setFilter: false
		},
		{
			title: 'Last Contacted At',
			dataIndex: 'updatedAt',
			key: 'updatedAt',
			width: '40%',
			setFilter: false
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: '40%',
			setFilter: false
		},
		{
			title: 'Actions',
			key: 'action',
			render: (text, record) => (
				<Space size='small'>
					<Button 
						type='link' 
						icon={ <CopyOutlined /> }
						onClick={ this.handleClickSearchTemplates }
					>
						Search Templates
					</Button>
				</Space>
			),
			width: '10%',
			setFilter: false
		},
	];

	handleClickSearchTemplates = event => {
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
			width: '15%',
			setFilter: false
		},
		{
			title: 'Account Name',
			dataIndex: 'accountName',
			key: 'accountName',
			width: '20%',
			setFilter: false
		},
		{
			title: 'Labels',
			key: 'labels',
			dataIndex: 'labels',
			render: labels => !labels ? <></> : (
				<>
					{labels.map(tag => {
						let color = 'blue';
						switch (tag) {
							case 'normal' :
								color = 'blue';
								break;
							case 'banned' :
								color = 'red';
								break;
							case 'spammer' :
								color = 'purple';
								break;
							case 'VIP' :
								color = 'gold';
								break;
							default :
								color = 'blue';
								break;
						}
						return (
							<Tag color={color} key={tag}>
								{tag.toUpperCase()}
							</Tag>
						);
					})}
				</>
			),
			width: '20%',
		},
		{
			title: 'Actions',
			key: 'action',
			render: (text, record) => (
				<Space size='small'>
					<Popconfirm
						title='Are you sure to UN-ban this account ?'
						onConfirm={ this.handleClickUnban.bind(this, record) }
						onCancel={ () => console.log('cancel') }
						okText='Confirm'
						cancelText='Cancel'
						placement='left'
					>
					<Button 
						type='link' 
						icon={ <UserAddOutlined /> }
					>
						Unban
					</Button>
					</Popconfirm>
					<Popconfirm
						title='Are you sure to Ban this account ?'
						onConfirm={ this.handleClickBan.bind(this, record) }
						onCancel={ () => console.log('cancel') }
						okText='Confirm'
						cancelText='Cancel'
						placement='left'
					>
					<Button 
						type='link' 
						danger 
						icon={ <UserDeleteOutlined /> }
					>
						Ban
					</Button>
					</Popconfirm>
				</Space>
			),
			width: '10%',
			setFilter: false
		},
	];

	handleClickBan = record => {
		console.log(record);
		message.success("the account has been Banned successfully");
	}

	handleClickUnban = record => {
		console.log(record);
		message.success("the account has been UN-banned successfully");
	}

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

	genExtra = () => (
		<Button
			type="ghost"
			style={{ border: "none" }}
			size="small"
			onClick={event => {
				event.stopPropagation();
			}}
		>
			<NodeIndexOutlined />
			Bind
		</Button>
	);

	title = (
		<Row>
			<Col span={ 8 }>
				Case Details
			</Col>
			<Col
				span={ 2 }
				offset={ 12 }
			>
				<TableDropdown 
					onClickAdd={ () => console.log("click") }
					onClickRefreshTable={ () => console.log("click") }
					onClickBatchDelete={ () => console.log("click") }
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
		const newIndex = searchResults.findIndex( item => item.key === key);
		const panel = document.getElementById("panel" + newIndex);
		const bgcolor = panel.style.backgroundColor;
		panel.style.backgroundColor = "#a9a9a9";
		console.log( panel.style.backgroundColor );
		setTimeout( () => panel.style.backgroundColor = bgcolor, 500 );
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
						style={{ marginBottom: "16px" }}
					>
						<Descriptions title="Case"
							column={ 2 }
						>
							<Item label="Casename"> { "Alice's Case" }</Item>
							<Item label="Status">{ "pending" }</Item>
							<Item label="Created At">{ "2020-05-25 14:27:46" }</Item>
							<Item label="Labels">{ "banned" }</Item>
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
								header="Case" 
								key="1"
							>
								{ this.props.disabled ? (
									<TableBody
										columns={ this.columnsCase } 
										data={ this.state.dataCase } 
										isSmall={ true }
										pagination={ false }
									/>) : (
										this.props.formItems.map( item => 
											(
												<Form.Item
													key={ item.name }
													label={ item.label }
													name={ item.name }
													rules={ item.rules }
													initialValue={ this.props.record[item.name] }
												>
													{ item.input(this.props.disabled) }
												</Form.Item>
											)
										)
									)
								}
							</Panel>
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
						tableDrawerKey={ this.state.tableDrawerKey }
						title="Perform An Action on A Case"
						width={ 500 }
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
							onFinish={ this.handleSubmitProcess }
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
									defaultActiveKey={
										[]
									} 
									expandIconPosition="left"
								>
										{
											this.state.searchResults.map( (item, index) => (
												<Panel 
													id={ "panel"+index }
													header={ item.title }
													key={ index }
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
