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
	Button, 
	Divider, 
	Drawer, 
	Form, 
	Input, 
	Select, 
	Spin, 
	message 
} from 'antd';

// import shared components
import { Choice } from './Choice';

// import services
import { candidateService } from '_services';

// import helpers
import { backend } from '_helpers';

// destructure imported components and objects
const { listSync } = backend;
const { Option } = Select;

class TableDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			candidates: [],
			spnning: false,
			// for Choice modal
			candidateIds: [],
			allCandidates: [],
			modalKeyChoice: Date.now(), 
			visibleChoice: false,
		};
	}

	formRef = React.createRef();

	// listeners for forms
	onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};

	// layout for forms
	layout = this.props.formLayout || {
		labelCol: {
			span: 8,
		},
		wrapperCol: {
			span: 16,
		},
	};
	tailLayout = {
		wrapperCol: {
			offset: 8,
			span: 16,
		},
	};

	// handler for candidate id search
	handleSearch = async data => {
		this.setState({ spnning: true });
		const response = await this.listSync({
			accountname: data,
			db: this.formRef.current.getFieldValue('db'),
		});
		this.setState({ spnning: false });
		if (response.code === 200) {
			let entry = response.entry;
			if (entry.length === 1) {
				entry = entry.pop();
				this.formRef.current.setFieldsValue({
					candidate_id: entry.candidate_id,
					status: entry.status,
					account_type: entry.account_type,
					region: entry.region,
					physical_region: entry.physical_region,
				});
				message.success("Candidate ID found");
			} else {
				message.success("Multiple Candidate IDs found");
				const candidateIds = entry.map( item => item.candidate_id );
				this.setState({ 
					candidateIds,
					allCandidates: entry,
					visibleChoice: true,
				});
			}
		} else {
			this.formRef.current.setFieldsValue({
				candidate_id: null,
				status: null,
				account_type: null,
				region: null,
				physical_region: null,
			});
			message.error("Candidate ID not found");
		}
	}

	// handle db change
	handleChange = value => {
		this.formRef.current.setFieldsValue({
			candidate_id: null,
			status: null,
			account_type: null,
			region: null,
			physical_region: null,
		});
	}

	// handlers for Choice modal
	handleSubmitChoice = choice => {
		const entry = this.state.allCandidates.find( item => 
		 item.candidate_id === choice );
		this.formRef.current.setFieldsValue({
			candidate_id: entry.candidate_id,
			status: entry.status,
			account_type: entry.account_type,
			region: entry.region,
			physical_region: entry.physical_region,
		});
		this.setState({
			visibleChoice: false,
			modalKeyChoice: Date.now(),
			candidateIds: [],
			allCandidates: [],
		});
	}

	handleCancelChoice = event => {
		this.setState({
			visibleChoice: false,
			modalKeyChoice: Date.now(),
			candidateIds: [],
			allCandidates: [],
		});
	}

	// bind versions of CRUD
	config = {
		service: candidateService,
		list: "retrieveDetails",
		dataName: "candidates",
	};
	listSync = listSync.bind(this, this.config);

	render(){
		return (
			<div 
				className='TableDrawer'
				key={ this.props.tableDrawerKey } 
			>
				<Drawer
					title={ Object.keys(this.props.record).length === 0 
						|| this.props.isCreate ? 
						`Create ${this.props.drawerTitle}` :
						this.props.disabled ? `View ${this.props.drawerTitle}` :
						`Edit ${this.props.drawerTitle}`
				 	}
					width={ this.props.drawerWidth || 618 }
					bodyStyle={{ paddingBottom: 80 }}
					visible={ this.props.visible }
					onClose={ this.props.onClose }
				>
					<Spin spinning={this.state.spnning}>
						<Form
							ref={ this.formRef }
							{ ...this.layout }
							name='basic'
							initialValues={{
								remember: true,
							}}
							onFinish={ this.props.onSubmit }
							onFinishFailed={ this.onFinishFailed }
						>

							<Form.Item
								key={ "db" }
								label={ "DB" }
								name={ "db" }
								rules={[  
									{
										required: true,
										message: 'db cannot be empty',
									}
								]}
								initialValue={ this.props.record.db || "ea" }
							>
								<Select
									disabled={ this.props.disabled }
									onChange={ this.handleChange }
								>
									<Option value="ea">Asia</Option>
									<Option value="na">NA</Option>
								</Select>
							</Form.Item>
							<Form.Item
								key={ "accountname" }
								label={ "Account Name" }
								name={ "accountname" }
								rules={[  
									{
										required: true,
										message: 'Account name cannot be empty',
									}
								]}
								initialValue={ this.props.record.accountname }
							>
								<Input.Search
									onSearch={ this.handleSearch }
									maxLength={255}
									allowClear
									disabled={ this.props.disabled }
									placeholder={ "Account name must be unique" }
								/>
							</Form.Item>
							<Form.Item
								key={ "candidate_id" }
								label={ "Candidate ID" }
								name={ "candidate_id" }
								rules={[  
									{
										required: true,
										message: 'candidate_id cannot be empty',
									}
								]}
								initialValue={ this.props.record.candidate_id }
							>
								<Input
									maxLength={255}
									allowClear
									disabled
									placeholder={ "Use the search above to autofill this field" }
								/>
							</Form.Item>
							<Form.Item
								key={ "status" }
								label={ "Status" }
								name={ "status" }
								rules={[  
									{
										required: true,
										message: 'status cannot be empty',
									}
								]}
								initialValue={ this.props.record.status }
							>
								<Select
									disabled
									placeholder={ "Use the search above to autofill this field" }
								>
									<Option value="u">Unbanned</Option>
									<Option value="h">Hard Banned</Option>
									<Option value="s">Soft Banned</Option>
								</Select>
							</Form.Item>
							<Form.Item
								key={ "account_type" }
								label={ "Account Type" }
								name={ "account_type" }
								rules={[  
									{
										required: true,
										message: 'Account Type cannot be empty',
									}
								]}
								initialValue={ this.props.record.account_type}
							>
								<Select
									disabled
									placeholder={ "Use the search above to autofill this field" }
								>
									<Option value="f">Facebook</Option>
									<Option value="p">Phone</Option>
									<Option value="a">Apple</Option>
									<Option value="g">Google</Option>
								</Select>
							</Form.Item>
							<Form.Item
								key={ "region" }
								label={ "Region" }
								name={ "region" }
								rules={[  
									{
										required: true,
										message: 'region cannot be empty',
									}
								]}
								initialValue={ this.props.record.region }
							>
								<Input
									maxLength={255}
									allowClear
									disabled
									placeholder={ "Use the search above to autofill this field" }
								/>
							</Form.Item>
							<Form.Item
								key={ "physical_region" }
								label={ "Physical Region" }
								name={ "physical_region" }
								rules={[  
									{
										required: true,
										message: 'physical_region cannot be empty',
									}
								]}
								initialValue={ this.props.record.physical_region }
							>
								<Input
									maxLength={255}
									allowClear
									disabled
									placeholder={ "Use the search above to autofill this field" }
								/>
							</Form.Item>
							{ this.props.formItems.map( item => 
								item.editable || this.props.disabled ? (
									<Form.Item
										key={ item.name }
										label={ item.label }
										name={ item.name }
										rules={ item.rules }
										initialValue={ this.props.record[item.name] }
									>
										{ item.input(this.props.disabled, this.props.record) }
									</Form.Item>
								) : (<span key={ item.name }></span>)
							)}
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
					</Spin>
				</Drawer>
				<div>
					<Choice
						candidateIds={ this.state.candidateIds }
						modalKey={ this.state.modalKeyChoice }
						visible={ this.state.visibleChoice }
						onSubmit={ this.handleSubmitChoice }
						onCancel={ this.handleCancelChoice }
					>
					</Choice>
				</div>
			</div>
		);
	}
}

export { TableDrawer };
