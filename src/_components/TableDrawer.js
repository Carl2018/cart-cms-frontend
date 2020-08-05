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
import { Drawer, Button, Form, Divider } from 'antd';

// import shared components

class TableDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

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
					<Form
						{ ...this.layout }
						name='basic'
						initialValues={{
							remember: true,
						}}
						onFinish={ this.props.onSubmit }
						onFinishFailed={ this.onFinishFailed }
					>

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
				</Drawer>
			</div>
		);
	}
}

export { TableDrawer };
