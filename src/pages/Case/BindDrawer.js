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
const { list, listByEmail } = backend;
const { Search } = Input;

class BindDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for AutoComplete
			accounts: [],
			options: [],
			// accounts in the same profile
			inProfile: [],
		};
	}

	componentDidMount() {
		this.listAccounts();
		console.log(this.props.record);
		this.listByEmail({email: this.props.record.email});
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
					onSelect={ this.handleSearch }
					options={ this.state.options }
				>
					<Search
						onSearch={ this.handleSearch }
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
		console.log(this.state.inProfile);
		console.log('Failed:', errorInfo);
	};

	// filter AutoComplete options when input field changes
	handleChange = data => {
		const options = this.state.accounts
			.map( item => item.accountname )
			.filter( (item, index, array) => array.indexOf(item) === index )
			.filter( item => item.includes(data) )
			.map( item => ({ value: item }) );
		this.setState({ options });
	}

	// perform a search when the search button is pressed
	handleSearch = data => {
		console.log("search");
	}

	// bind versions of CRUD
	listAccounts = list.bind(this, accountService, 'accounts');
	listByEmail = listByEmail.bind(this, accountService, 'inProfile');

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
