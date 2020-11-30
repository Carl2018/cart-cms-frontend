import React, { Component } from 'react';

// import components from ant design
import { 
	Button, 
	Card, 
	Descriptions, 
	InputNumber, 
} from 'antd';

// import shared and child components

// import services

// import helpers

// destructure imported components and objects

class Collect extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	render(){
		const { willCollect, didCollect, reCollect } = this.props;
		return (
			<div className="Collect">
				<Card
					title="Use the Original Dataset Only" 
					hoverable = { true }
					style={{ margin: "16px 0px" }}
					headStyle={{ 
						background: willCollect ? "none" : "#4390f7" 
					}}
					bodyStyle={{ 
						background: willCollect ? "none" : "#fafafa" 
					}}
					onClick = { this.props.changeCollect.bind(this, false) }
				>
					<Descriptions column={ 1 }>
						<Descriptions.Item label="Source">
								<div
									style={ willCollect ? null : { 
										color: "#4390f7", 
										fontWeight: "bold"
									}}
								>
									{ `The original dataset \xa0` }
								</div>
						</Descriptions.Item>
						<Descriptions.Item label="New Data Points">
								{ "0" }
						</Descriptions.Item>
					</Descriptions>
				</Card>
				<Card
					title="Collect An Additional Dataset" 
					hoverable = { true }
					style={{ margin: "16px 0px" }}
					headStyle={{ 
						background: !willCollect ? "none" : "#4390f7" 
					}}
					bodyStyle={{ 
						background: !willCollect ? "none" : "#fafafa" 
					}}
					onClick = { this.props.changeCollect.bind(this, true) }
				>
					<Descriptions column={ 1 }>
						<Descriptions.Item label="Source">
								<span
									style={ !willCollect? null : { 
										color: "#4390f7", 
										fontWeight: "bold"
									}}
								>
									{ "The original dataset" }
								</span>
								<span style={{margin: "0px 8px"}}>
									AND
								</span>
								<span
									style={ !willCollect? null : { 
										color: "#4390f7", 
										fontWeight: "bold"
									}}
								>
									{ "an additional dataset" }
								</span>
								<span style={{marginLeft: "8px"}}>
									collected from Wowo database
								</span>
						</Descriptions.Item>
						<Descriptions.Item label="New Data Points">
								{ didCollect ? this.props.dataPointN : "To be collected" }
						</Descriptions.Item>
						<Descriptions.Item label="In the past(months)">
								<InputNumber
									value={ this.props.months }
									min={ 1 }
									style={ {marginRight: "16px" }}
									disabled={ !willCollect }
									onChange={ this.props.onChangeMonths }
								/>
								<Button
									onClick={ this.props.collect }
									disabled={ !willCollect }
									loading={ this.props.loading }
								>	
									{ reCollect ? "Re-collect" : "Collect" }
								</Button>
						</Descriptions.Item>
					</Descriptions>
				</Card>
			</div>
		);
	}
}

export { Collect };
