import React, { Component } from 'react';

// import components from ant design
import { 
	Col,
	Modal,
	Row,
	Select,
	Space,
} from 'antd';

// import shared and child components

// import services

// import helpers

// destructure imported components and objects
const { Option } = Select;

class Choice extends Component {
	constructor(props) {
		super(props);
		this.state = {
			choice: "",
		};
	}
	
	componentWillUpdate(nextProps) {
			if (nextProps.candidateIds.length > 0 && this.state.choice === "") {
				const defaultChoice = Math.max(...nextProps.candidateIds);
				this.setState({ choice: defaultChoice });
			}
	}

	// modal title
	titleModal = () => (
		<Row>
			<Col span={ 16 }>
				Choose A Candidate ID
			</Col>
		</Row>	
	)

	// handle choice change
	handleChange = choice => this.setState({ choice });

	// handle submit choice
	onSubmit = event => this.props.onSubmit(this.state.choice);

	render(){
		return (
			<div className="Choice">
				<Modal
					key={ this.props.modalKey }
					title={ this.titleModal() }
					width={ 500 }
					style={{ top: 200 }}
					bodyStyle={{ minHeight: 200, overflow: "auto" }}
					visible={ this.props.visible }
					onOk={ this.onSubmit }
					onCancel={ this.props.onCancel }
				>
					<p style={{ fontSize: "16px"}} >
						{ `The account name corresponds 
									to multiple Candidate IDs` }
					</p>
					<br />
					<Space>
						<span style={{ fontSize: "16px" }} >
							{ "Fill the drawer with candidate:  " }
						</span>
						<Select
							placeholder={ "Choose A Candidate ID" }
							value={ this.state.choice }
							onChange={ this.handleChange }
							style={ { width: 150 } }
						>
							{ 
								this.props.candidateIds.map( item => 
									<Option
										key={ item }
										value={ item }
									>
											{ item }
									</Option>
								)
							}
						</Select>
					</Space>
				</Modal>
			</div>
		);
	}
}

export { Choice };
