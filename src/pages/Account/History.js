import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	Col,
	Modal,
	Row,
	Tag,
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
			title: 'Category',
			dataIndex: 'product_id',
			key: 'product_id',
			width: '20%',
			sorter: (a, b) => compare(a.product_id, b.product_id),
			// setFilter: true,
			render: product_id => {
				const match = product_id.match(/gold|silver|adfree/);
				const category = match ? match[0] : "none";
				let color = 'default';
				switch (category) {
					case 'gold':
						color = 'gold';
						break;
					case 'silver':
						color = '#c0c0c0';
						break;
					case 'adfree':
						color = 'cyan';
						break;
					case 'none':
						color = 'purple';
						break;
					default:
						color = 'purple';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ category }
					</Tag>
				);
			},
		},
		{
			title: 'Periodicity',
			dataIndex: 'product_id',
			key: 'product_id',
			width: '20%',
			sorter: (a, b) => compare(a.product_id, b.product_id),
			// setFilter: true,
			render: product_id => {
				const match = product_id.match(/quarter|halfyear|monthly/);
				const periodicity = match ? match[0] : "none";
				let color = 'default';
				switch (periodicity) {
					case 'quarter' :
						color = 'gold';
						break;
					case 'halfyear' :
						color = '#c0c0c0';
						break;
					case 'monthly' :
						color = 'cyan';
						break;
					default:
						color = 'cyan';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ periodicity }
					</Tag>
				);
			},
		},
		{
			title: 'Expiry Date',
			dataIndex: 'expiry_date',
			key: 'expiry_date',
			width: '60%',
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
