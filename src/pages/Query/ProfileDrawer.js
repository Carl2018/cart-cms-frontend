import React, { Component } from 'react';

// import components from ant design
import { 
	Input,
	Select, 
} from 'antd';

// import shared and child components
import { TableDrawer } from '_components'

// import services

// import helpers

// destructure imported components and objects
const { Option } = Select

class ProfileDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	// define form items for TableDrawer
	formItems = [
		{
			label: 'Profile Name',
			name: 'profilename',
			rules: [
				{
					required: true,
					message: 'Profile name cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
				/>
			)
		},
		{
			label: 'Profile Description',
			name: 'description',
			rules: [
				{
					required: true,
					message: 'Profile description cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
				/>
			)
		},
		{
			label: 'Labels',
			name: 'labelname',
			rules: [
				{
					required: false,
					message: 'Labels cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Select
					disabled={ disabled }
					mode="multiple"
				>
					{
						this.props.labels.map( item => (
							<Option
								key={ item.id }
								value={ item.labelname }
							>
								{ item.labelname }
							</Option>
						))
					}
				</Select>
			)
		},
		{
			label: 'Email',
			name: 'email',
			rules: [
				{
					required: true,
					message: 'email cannot be empty',
				}
			],
			editable: true,
			input: disabled => 
			(
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
				/>
			)
		},
	];

	render(){
		return (
			<div className='ProfileDrawer'>
				<TableDrawer 
					tableDrawerKey={ this.props.tableDrawerKey }
					record={ this.props.record }
					visible={ this.props.visible } 
					formItems={ this.formItems }
					onSubmit={ this.props.onSubmit }
					onClose={ this.props.onClose }
				/>
			</div>
		);
	}
}

export { ProfileDrawer };