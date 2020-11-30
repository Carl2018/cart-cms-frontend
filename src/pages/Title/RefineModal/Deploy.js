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

class Deploy extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	getExtra = (willDeploy, reDeploy) => (
		!willDeploy ? (<></>) : (
			<Button
				type="ghost"
				size="small"
				style={{
					color: "#262626", 
					fontWeight: "bold",
					border: "none",
				}}
				onClick={ this.props.deploy }
				disabled={ !willDeploy }
				loading={ this.props.loading }
			>	
				{ reDeploy ? "Re-deploy" : "Deploy" }
			</Button>
		)
	)

	render(){
		const {willDeploy, reDeploy} = this.props;
		return (
			<div className="Deploy">
				<Card
					title="Discard" 
					hoverable = { true }
					style={{ margin: "16px 0px" }}
					headStyle={{ 
						background: willDeploy ? "none" : "#4390f7" 
					}}
					bodyStyle={{ 
						background: willDeploy ? "none" : "#fafafa" 
					}}
					onClick = { this.props.changeDeploy.bind(this, false) }
				>
					<Descriptions column={ 1 }>
						<Descriptions.Item >
								{ "Discard the model that has just been trained" }
						</Descriptions.Item>
					</Descriptions>
				</Card>
				<Card
					title="Deploy" 
					hoverable = { true }
					style={{ margin: "16px 0px" }}
					headStyle={{ 
						background: !willDeploy ? "none" : "#4390f7" 
					}}
					bodyStyle={{ 
						background: !willDeploy ? "none" : "#fafafa" 
					}}
					onClick = { this.props.changeDeploy.bind(this, true) }
					extra={ this.getExtra(willDeploy, reDeploy) }
				>
					<Descriptions column={ 1 }>
						<Descriptions.Item>
								<span>
									{ "Deploy the model that has just been trained" }
								</span>
						</Descriptions.Item>
					</Descriptions>
				</Card>
			</div>
		);
	}
}

export { Deploy };
