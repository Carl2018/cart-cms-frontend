import React, { Component } from 'react';

// import components from ant design
import { Drawer, Button, Form, Divider, Input } from 'antd';

// import shared and child components

// destructure child components

class ProcessDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	// define form items for edit drawer
	formItems = [
		{
			label: 'Process',
			name: 'process',
			rules: [
				{
					required: true,
					message: 'process cannot be empty',
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
			label: 'Details',
			name: 'details',
			rules: [
				{
					required: true,
					message: 'details cannot be empty',
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

	// listeners for forms
	onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};

	render(){
		return (
			<div className="ProcessDrawer">
				<Drawer
					title="Process A Case"
					width={ 618 }
					bodyStyle={{ paddingBottom: 80 }}
					visible={ this.props.visible } 
					onClose={ this.props.onClose }
				>
					<Form
						key={ this.props.formKeyEdit }
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

export { ProcessDrawer };
