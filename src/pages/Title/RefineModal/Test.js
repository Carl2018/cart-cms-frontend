import React, { Component } from 'react';

// import components from ant design
import { 
	Button, 
	Card, 
	Descriptions, 
} from 'antd';

// import shared and child components

// import services

// import helpers

// destructure imported components and objects

// get test name
class Test extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	getExtra = reTest => (
		<Button
			type="ghost"
			size="small"
			style={{
				color: "#4390f7", 
				fontWeight: "bold",
				border: "none",
			}}
			onClick={ this.props.test }
			loading={ this.props.loading }
		>	
			{ reTest ? "Re-test" : "Test" }
		</Button>
	)

	render(){
		const { didTest, reTest } = this.props;
		return (
			<div className="Test">
				<Card
					title="Test the Model" 
					hoverable = { true }
					style={{ margin: "16px 0px" }}
					extra={ this.getExtra(reTest) }
				>
					<Descriptions
						column={ 1 }
						bordered
					>
						<Descriptions.Item label="Accuracy">
							{ didTest ? this.props.accuracy : "TBD" }
						</Descriptions.Item>
						<Descriptions.Item label="Precision">
							{ didTest ? this.props.precision: "TBD" }
						</Descriptions.Item>
						<Descriptions.Item label="Recall">
							{ didTest ? this.props.recall: "TBD" }
						</Descriptions.Item>
						<Descriptions.Item label="F1">
							{ didTest ? this.props.f1: "TBD" }
						</Descriptions.Item>
					</Descriptions>
				</Card>
			</div>
		);
	}
}

export { Test };
