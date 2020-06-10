import React, { Component } from 'react';

/*
		This component is a dropdown
		It requires 3 props

		function 'onClickAction' for the Add Button
		function 'onClickEdit' for the Refresh Table Button
		function 'onClickUnban' for the Batch Delete Button
*/

// import styling from ant design
import { Menu, Dropdown } from 'antd';
import { 
	AuditOutlined, 
	EditOutlined, 
	UserAddOutlined,
	UserDeleteOutlined,
	CopyOutlined,
} from '@ant-design/icons';

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
				icon={ <EditOutlined /> }
				onClick={ this.props.onClickEdit }
			>
				Edit
			</Menu.Item>
			<Menu.Item 
				key='2' 
				style={{ color:'#5a9ef8' }} 
				icon={ <UserAddOutlined /> }
				onClick={ this.props.onClickUnban }
			>
				Unban
			</Menu.Item>
			<Menu.Item 
				key='3' 
				style={{ color:'#ec5f5b' }} 
				icon={ <UserDeleteOutlined /> }
				onClick={ this.props.onClickBan }
			>
				Ban
			</Menu.Item>
			<Menu.Item 
				key='4' 
				style={{ color:'#5a9ef8' }} 
				icon={ <CopyOutlined /> }
				onClick={ this.props.onClickTemplates}
			>
				Templates
			</Menu.Item>
		</Menu>
	);
	
	render(){
		return (
			<div className='TableDropdown'>
				<Dropdown.Button 
					onClick={ this.props.onClickAction }
					overlay={ this.menu }
				>
					<AuditOutlined />Action
				</Dropdown.Button>
			</div>
		);
	}
}

export default TableDropdown;
