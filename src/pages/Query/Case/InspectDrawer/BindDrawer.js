import React, { Component } from 'react';

// import components from ant design
import { Drawer, Button, Form, Divider, Select } from 'antd';

// import shared and child components

// destructure child components
const { Option } = Select;

class BindDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	// define form items for edit drawer
	formItems = [
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
		},
	];

	// listeners for forms
	onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};

	render(){
		return (
			<div className="BindDrawer">
				<Drawer
					title="Bind to An Account"
					width={ 618 }
					bodyStyle={{ paddingBottom: 80 }}
					visible={ this.props.visible } 
					onClose={ this.props.onClose }
				>
					<Form
						key={ this.props.formKey }
						labelCol={ { span: 8 } }
						wrapperCol={ { span: 16 } }
						name='basic'
						initialValues={{
							remember: true,
						}}
						onFinish={ this.props.onFinish }
						onFinishFailed={ this.onFinishFailed }
					>
						{ this.formItems.map( item => 
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

export default BindDrawer;
