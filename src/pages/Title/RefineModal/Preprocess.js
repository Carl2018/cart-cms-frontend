import React, { Component } from 'react';

// import components from ant design
import { 
	Button, 
	Card, 
	Descriptions, 
	InputNumber, 
	Slider, 
} from 'antd';

// import shared and child components

// import services

// import helpers

// destructure imported components and objects

// get test name
class Preprocess extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	getWidth = portion => {
		let width = 250;
		if (portion > 0.85)
			width = 425;
		else if (portion < 0.15)
			width = 75;
		else
			width = Math.round(500 * portion);
		return width;
	}

	getTestName = split => {
		const percent = Math.round( (1 - split) * 100 );
		let name = "Test Set " + percent + '%';
		if (split > 0.78)
			name = "TS " + percent + '%';
		return name;
	}

	render(){
		const { 
			split, 
			rePreprocess, 
			dataPointO, 
			dataPointN,
			frontWeightPreprocess,
		} = this.props;
		const total = dataPointO + dataPointN;
		const training = Math.round( total * split );
		const test = total - training;
		return (
			<div className="Preprocess">
				<Card
					title="Split and Preprocess the Dataset" 
					hoverable = { true }
					style={{ margin: "16px 0px" }}
				>
					<Descriptions column={ 1 }>
						<Descriptions.Item label="Original Data Points">
							{ dataPointO }
						</Descriptions.Item>
						<Descriptions.Item label="New Data Points">
							{ dataPointN }
						</Descriptions.Item>
						<Descriptions.Item label="Total Data Points">
							<div
								style={{ 
									color: "#4390f7", 
									fontWeight: "bold"
								}}
							>
								{ total }
							</div>
						</Descriptions.Item>
						<Descriptions.Item label="Training Set">
							<div
								style={{ 
									color: "#7cb06d", 
									fontWeight: frontWeightPreprocess
								}}
							>
								{ training }
							</div>
						</Descriptions.Item>
						<Descriptions.Item label="Test Set">
							<div
								style={{ 
									color: "#ad5049", 
									fontWeight: frontWeightPreprocess
								}}
							>
								{ test }
							</div>
						</Descriptions.Item>
						<Descriptions.Item label="Sets">
							<Button
								style={{
									width: this.getWidth(split),
									background: this.props.trainingBgColor,
									borderColor: "#7cb06d",
								}}
							>
								{ "Training Set " + Math.round(split * 100) + '%' }
							</Button>
							<Button
								style={{
									width: this.getWidth( 1 - split),
									background: this.props.testBgColor ,
									borderColor: "#ad5049",
								}}
							>
								{ this.getTestName(split) }
							</Button>
						</Descriptions.Item>
						<Descriptions.Item label="Split">
							<Slider
								style={{ width: 500, marginRight: "16px" }}
								min={0.5}
								max={0.99}
								step={0.01}
								onChange={this.props.onChangeSplit}
								value={typeof split === 'number' ? split : 0.7}
							/>
							<InputNumber
								min={0.5}
								max={0.99}
								step={0.01}
								style={{ margin: '0 16px' }}
								value={split}
								onChange={this.props.onChangeSplit}
							/>
							<Button
								onClick={ this.props.preprocess }
								loading={ this.props.loading }
							>	
								{ rePreprocess ? "Re-preprocess" : "Preprocess" }
							</Button>
						</Descriptions.Item>
					</Descriptions>
				</Card>
			</div>
		);
	}
}

export { Preprocess };
