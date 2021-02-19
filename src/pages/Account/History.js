import React, { Component } from 'react';

// import components from ant design
import { 
	Col,
	Modal,
	Row,
} from 'antd';

// import shared and child components
import { TableBody } from '_components'

// import services

// import helpers
import { helpers } from "_helpers";

// destructure imported components and objects
const { compare } = helpers;

class History extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	componentDidMount() {
	}

	// for related email panel
	columns = [
		{
			title: 'Product ID',
			dataIndex: 'product_id',
			key: 'product_id',
			width: '60%',
			sorter: (a, b) => compare(a.product_id, b.product_id),
			setFilter: true
		},
		{
			title: 'Expiry Date',
			dataIndex: 'expiry_date',
			key: 'expiry_date',
			width: '40%',
			sorter: (a, b) => compare(a.expiry_date, b.expiry_date),
			setFilter: true
		},
	];

	titleModal = () => (
		<Row>
			<Col span={ 8 }>
				History
			</Col>
		</Row>	
	)

	render(){
		return (
			<div className="History">
				<Modal
					key={ this.props.modalKey }
					title={ this.titleModal() }
					width={ 600 }
					style={{ top: 20 }}
					bodyStyle={{ minHeight: 600, overflow: "auto" }}
					visible={ this.props.visible }
					onCancel={ this.props.onClose }
					footer={ null }
				>
					<div>
						<div>
							<TableBody
								columns={ this.columns } 
								data={ this.props.history ? this.props.history : [] }
								isSmall={ true }
							/>
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}

export { History };
