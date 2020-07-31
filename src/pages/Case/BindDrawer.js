import React, { Component } from 'react';

// import components from ant design
import { 
	AutoComplete, 
	Button, 
	Divider, 
	Drawer, 
	Form, 
	Input,
} from 'antd';

// import shared and child components

// import services
import { 
	accountService,
 } from '_services';

// import helpers
import { backend } from '_helpers';

// destructure imported components and objects
const { listSync } = backend;

class BindDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for AutoComplete
			accounts: [],
			options: [],
		};
	}

	componentDidMount() {
		this.listAccounts();
	}

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Account',
			name: 'accountname',
			rules: [
				{
					required: true,
					message: 'Account cannot be empty',
				}
			],
			editable: true,
			input: disabled => 
			(
				<AutoComplete
					onChange={ this.handleChange }
					options={ this.state.options }
				>
					<Input
						placeholder="Search Email"
						size="middle"
						allowClear
					/>
				</AutoComplete>
			)
		},
	];

	// listeners for forms
	onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};

	// filter AutoComplete options when input field changes
	handleChange = data => {
		const options = this.state.accounts
			.map( item => item.accountname )
			.filter( (item, index, array) => array.indexOf(item) === index )
			.filter( item => item.trim().toLowerCase()
				.includes(data.trim().toLowerCase()) 
			)
			.map( item => ({ value: item }) );
		this.setState({ options });
	}

	// bind versions of CRUD
	config = {
		service: accountService,
		list: "list",
		dataName: "accounts",
	};
	listAccounts = listSync.bind(this, this.config);

	render(){
		return (
			<div 
				className="BindDrawer"
				key={ this.props.tableDrawerKey }
			>
				<Drawer
					title="Bind to An Account"
					width={ 618 }
					bodyStyle={{ paddingBottom: 80 }}
					visible={ this.props.visible } 
					onClose={ this.props.onClose }
				>
					<Form
						labelCol={ { span: 8 } }
						wrapperCol={ { span: 16 } }
						name='basic'
						initialValues={{
							remember: true,
						}}
						onFinish={ this.props.onSubmit }
						onFinishFailed={ this.onFinishFailed }
					>
						{ this.formItems.map( item => 
							(
								<Form.Item
									key={ item.name }
									label={ item.label }
									name={ item.name }
									rules={ item.rules }
									initialValue={ this.props.record[item.name] }
								>
									{ item.input( this.props.disabled ) }
								</Form.Item>
							)
						) }
						<Divider />
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
					</Form>
				</Drawer>
			</div>
		);
	}
}

export { BindDrawer };
