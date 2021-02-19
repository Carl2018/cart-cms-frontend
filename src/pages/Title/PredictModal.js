import React, { Component } from 'react';

// import components from ant design
import { 
	Button, 
	Col, 
	Input, 
	Modal, 
	Row, 
} from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

// import shared and child components

// import services

// import helpers

// destructure imported components and objects
const { TextArea } = Input;

class PredictModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			titles: "",
			predictions: "",
			loading: false,
		};
	}
	
	// generate title for modal
	titleModal = () => (
		<Row>
			<Col span={ 8 }>
				Predict
			</Col>
		</Row>	
	)

	handleChangeInput = event => this.setState({ titles: event.target.value });

	onClickPredict = () => {
		let { titles } = this.state;
		titles = titles.split(/\r?\n/);
		this.setState({ loading: true }, async () => {
			const { entry } = await this.props.predict({ titles });
			let predictions = "";
			Object.entries(entry).forEach( item => {
				predictions = predictions.concat( `${item[0]}\nspam score: ${item[1][0]} probability: ${item[1][1]}\n` )
			});
			this.setState({ 
				loading: false,	
				predictions, 
			});
		});
	}

	// handler for Cancel
	onCancel = () => {
		this.props.onCancel();
	}

	render(){
		return (
			<div className="PredictModal">
					<Modal
						key={ this.props.modalKey }
						title={ this.titleModal() }
						width={ 900 }
						style={{ top: 20 }}
						bodyStyle={{ minHeight: 550, overflow: "auto" }}
						visible={ this.props.visible }
						onCancel={ this.onCancel }
						footer={ null }
					>
						<Row
							gutter={16}
							align="middle"
						>
							<Col
								span={9}
								offset={2}
							>
								<TextArea
									rows={22}
									style={{ width:200 }}
									value={ this.state.titles }
									onChange={ this.handleChangeInput }
								/>
							</Col>
							<Col 
								span={2}
								style={{ textAlign: "middle" }}
							>
								<Button
									type="text"
									loading={ this.state.loading }
									icon={ <ArrowRightOutlined /> }	
									onClick={ this.onClickPredict }
								>
								</Button>
							</Col>
							<Col
								span={9}
								offset={2}
							>
								<TextArea
									rows={22}
									style={{ width:300 }}
									value={ this.state.predictions }
								/>
							</Col>
						</Row>
					</Modal>
			</div>
		);
	}
}

export { PredictModal };
