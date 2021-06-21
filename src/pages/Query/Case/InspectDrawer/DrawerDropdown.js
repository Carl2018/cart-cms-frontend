import React, { Component } from 'react';

// import components from ant design
import { Menu, Dropdown } from 'antd';
import { 
	CommentOutlined,
	CopyOutlined,
	EditOutlined, 
	ExceptionOutlined, 
	FlagOutlined,
	HistoryOutlined, 
	ShakeOutlined,
	UserAddOutlined,
	UserDeleteOutlined,
} from '@ant-design/icons';

// import shared and child components

// destructure child components

class DrawerDropdown extends Component {
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
				key='33' 
				style={{ color:'#ec5f5b' }} 
				icon={ <ExceptionOutlined /> }
				onClick={ this.props.onClickDeviceBan }
			>
				Device Ban
			</Menu.Item>
			<Menu.Item 
				key='4' 
				style={{ color:'#5a9ef8' }} 
				icon={ <CopyOutlined /> }
				onClick={ this.props.onClickTemplates}
			>
				Templates
			</Menu.Item>
			<Menu.Item 
				key='5' 
				style={{ color:'#5a9ef8' }} 
				icon={ <FlagOutlined /> }
				onClick={ this.props.onClickFlags }
			>
				Flags
			</Menu.Item>
			<Menu.Item 
				key='6' 
				style={{ color:'#5a9ef8' }} 
				icon={ <CommentOutlined /> }
				onClick={ this.props.onClickConversations }
			>
				Conversations
			</Menu.Item>
			<Menu.Item 
				key='7' 
				style={{ color:'#5a9ef8' }} 
				icon={ <ShakeOutlined /> }
				onClick={ this.props.onClickInvitations }
			>
				Invitations
			</Menu.Item>
			<Menu.Item 
				key='8' 
				style={{ color:'#5a9ef8' }} 
				icon={ <ShakeOutlined /> }
				onClick={ this.props.onClickLoginLogs }
			>
				Login Logs
			</Menu.Item>
			<Menu.Item 
				key='9' 
				style={{ color:'#5a9ef8' }} 
				icon={ <ShakeOutlined /> }
				onClick={ this.props.onClickPayments }
			>
				Payments
			</Menu.Item>
			<Menu.Item 
				key='10' 
				style={{ color:'#5a9ef8' }} 
				icon={ <ShakeOutlined /> }
				onClick={ this.props.onClickRedisLogs }
			>
				Redis Logs
			</Menu.Item>
		</Menu>
	);
	
	render(){
		return (
			<div className='DrawerDropdown'>
				<Dropdown.Button 
					onClick={ this.props.onClickProcess }
					overlay={ this.menu }
				>
					<HistoryOutlined />Process
				</Dropdown.Button>
			</div>
		);
	}
}

export default DrawerDropdown;
