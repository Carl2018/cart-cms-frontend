import React, { Component } from 'react';

// import components from ant design
import { 
	Button, 
	Card, 
	Col, 
	Progress, 
	Row, 
} from 'antd';

// import shared and child components

// import services

// import helpers

// destructure imported components and objects

// get test name
class Fit extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	handleFormat = (percent, timeTaken) => {
		let format = `0s`;
		if (percent === 100)
			format = `${timeTaken}s`;
		return format;
	}

	render(){
		const { reFit, percent, timeTaken } = this.props;
		return (
			<div className="Fit">
				<Card
					title="Fit the Model" 
					hoverable = { true }
					style={{ margin: "16px 0px", position: "relative" }}
				>
					<Row>
						<Col span={8} offset={8}>
							<Progress
								type="circle"
								strokeColor={{
									'0%': '#108ee9',
									'100%': '#87d068',
								}}
								percent={percent}
								width={200}
								format={ this.handleFormat.bind(this, percent, timeTaken) }
							/>
						</Col>
					</Row>
					<Button
						type="ghost"
						size="small"
						style={{
							color: "#4390f7", 
							fontWeight: "bold",
							border: "none",
							position: "absolute", 
							left: reFit ? "400px" : "408px", 
							top: "216px",
						}}
						onClick={ this.props.fit }
						loading={ this.props.loading }
					>	
						{ reFit ? "Re-fit" : "Fit" }
					</Button>
				</Card>
			</div>
		);
	}
}

export { Fit };
