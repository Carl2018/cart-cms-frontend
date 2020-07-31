import React, { Component } from 'react';

// import components from ant design
import { 
	Button, 
	Divider, 
	Drawer, 
	Form, 
	Input,
	Select,
} from 'antd';

// import shared and child components

// destructure child components
const { Option } = Select;

class SecondaryDrawer extends Component {
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
			input: (disabled, record) => 
				(
					<Select
						disabled={ disabled || record.process ? true : false }
						showSearch
						optionFilterProp="children"
						filterOption={(input, option) =>
							option.children.trim().toLowerCase()
								.indexOf(input.trim().toLowerCase()) >= 0
						}
					>
						{ !record.process ? <></> :
							<Option value="o">Open</Option>
						}
						<Option value="q">Query</Option>
						<Option value="r">Reply</Option>
						<Option value="a">Approve</Option>
						<Option value="e">Reject</Option>
						<Option value="d">Defer</Option>
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
				},
			],
			editable: true,
			input: (disabled, record) => (
				<Input.TextArea
					autoSize={{ minRows: 6, maxRows: 10 }}
					maxLength={255}
					allowClear
					disabled={ disabled }
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
			<div 
				className="SecondaryDrawer"
				key={ this.props.tableDrawerKey }
			>
				<Drawer
					title="Process A Case"
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
									{ item.input(this.props.disabled, this.props.record) }
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

export { SecondaryDrawer };
