import React, { Component } from 'react';

// import styling from ant design
import { 
	Menu, 
	Dropdown, 
} from 'antd';
import { 
	PlusOutlined, 
	ReloadOutlined, 
	ShareAltOutlined, 
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
				icon={ <ShareAltOutlined /> }
				onClick={ this.props.onClickPredict }
			>
				Predict
			</Menu.Item>
			<Menu.Item 
				key='2' 
				style={{ color:'#5a9ef8' }} 
				icon={ <ReloadOutlined /> }
				onClick={ this.props.onClickRefreshTable }
			>
				Refresh Table
			</Menu.Item>
		</Menu>
	);
	
	render(){
		return (
			<div className='TableDropdown'>
				<Dropdown.Button 
					onClick={ this.props.onClickRefine }
					overlay={ this.menu }
				>
					<PlusOutlined />
					{ "Refine" }
				</Dropdown.Button>
			</div>
		);
	}
}

export { TableDropdown };
