import React, { Component } from 'react';

/*
		This component is a dropdown
		It requires 3 props

		function 'onClickAdd' for the Add Button
		function 'onClickRefreshTable' for the Refresh Table Button
		function 'onClickBatchDelete' for the Batch Delete Button
*/

// import styling from ant design
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

class TableDropdown extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	render(){
		return (
			<div className='TableDropdown'>
				<Button 
					onClick={ this.props.onClickAdd }
					// overlay={ this.menu }
				>
					<PlusOutlined />
					{ "Add" }
				</Button>
			</div>
		);
	}
}

export { TableDropdown };
