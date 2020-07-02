import React, { Component } from 'react';

// import styling from ant design
import { Drawer, Button, Form, Divider, Input } from 'antd';

class EditDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	// define form items for edit drawer
	formItems = [
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

	// listeners for forms
	onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};

	render(){
		return (
			<div className="EditDrawer">
				<Drawer
					title="Edit A Case"
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
									initialValue={ this.props.record[item.name] }
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

export default EditDrawer;
