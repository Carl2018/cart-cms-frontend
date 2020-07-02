import React, { Component } from 'react';

// import styling from ant design
import { Drawer, Button, Form, Divider, Select, Input } from 'antd';

const { Option } = Select;

class ActionDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	// define form items for action drawer
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

	// listeners for forms
	onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};

	render(){
		return (
			<div className="ActionDrawer">
				<Drawer
					key={ this.props.drawerKey }
					title="Perform An Action on A Case"
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
									initialValue={ "" }
								>
									{ item.input }
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

export default ActionDrawer;
