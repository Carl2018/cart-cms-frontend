import React, { Component } from 'react';

/*
		This component is a dropdown
		It requires 3 props

		function 'onClickAdd' for the Add Button
		function 'onClickRefreshTable' for the Refresh Table Button
		function 'onClickBatchDelete' for the Batch Delete Button
*/

// import styling from ant design
import { Menu, Dropdown } from 'antd';
import { PlusOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';

class TableDropdown extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	// menu for dropdown
	menu = (
		<Menu >
			<Menu.Item 
				key='1' 
				style={{ color:'#5a9ef8' }} 
				icon={ <ReloadOutlined /> }
				onClick={ this.props.onClickRefreshTable }
			>
				Refresh Table
			</Menu.Item>
			<Menu.Item 
				key='2' 
				style={{ color:'#ec5f5b' }} 
				icon={ <DeleteOutlined /> }
				onClick={ this.props.onClickBatchDelete }
			>
				Batch Delete
			</Menu.Item>
		</Menu>
	);
	
	render(){
		return (
			<div className='TableDropdown'>
				<Dropdown.Button 
					onClick={ this.props.onClickAdd }
					overlay={ this.menu }
				>
					<PlusOutlined />Add
				</Dropdown.Button>
			</div>
		);
	}
}

export default TableDropdown;
