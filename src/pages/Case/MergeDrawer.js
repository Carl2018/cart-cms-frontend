import React, { Component } from 'react';

// import components from ant design
import { 
	Button, 
	Card, 
	Checkbox, 
	Collapse, 
	Descriptions, 
	Divider, 
	Drawer, 
} from 'antd';

// import shared and child components

// destructure child components
const { Panel } = Collapse;

class MergeDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			change: false,
		};
	}
	
	// define the checkbox a
	genCheckboxA = () => (
		<Checkbox
			type="ghost"
			checked={ !this.state.change }
			onClick={ event => this.setState({ change: false}) }
		>
		</Checkbox>
	);

	// define the checkbox b
	genCheckboxB = () => (
		<Checkbox
			type="ghost"
			checked={ this.state.change }
			onClick={ event => this.setState({ change: true }) }
		>
		</Checkbox>
	);

	// handler for submit
	onSubmit = event => this.props.onSubmit(this.state.change);

	render(){
		return (
			<div 
				className="MergeDrawer"
				key={ this.props.mergeModalKey }
			>
				<Drawer
					title="Edit Merged Profile"
					width={ 618 }
					bodyStyle={{ paddingBottom: 80 }}
					visible={ this.props.visible } 
					onClose={ this.props.onClose }
				>
					<Card
						title="Merge Completed"
						size="small"
						style={{ marginBottom: "16px" }}
					>
						<br />
						<p>
							{ `Which of the following profiles
								would you like to keep?` }
						</p>
						<p>
							{ `If you do not choose one, the profile information 
								will be set to Profile A` }
						</p>
					</Card>
					{ Object.keys(this.props.record).length === 0 ? (<></>) :
						(
							<Collapse 
								activeKey={['1','2']} 
								expandIconPosition="left"
							>
									<Panel 
										header="Profile A" 
										key="1"
										showArrow = { false }
										extra = { this.genCheckboxA() }
									>
										<Descriptions 
											column={ 1 }
											style={{ 
												background: this.state.change ? "none" : "#fafafa" 
											}}
										>
											<Descriptions.Item label="Profile Name">
													{ this.props.record.profile_to.profilename }
											</Descriptions.Item>
											<Descriptions.Item label="Description">
													{ this.props.record.profile_to.description }
											</Descriptions.Item>
										</Descriptions>
									</Panel>
									<Panel 
										header="Profile B" 
										key="2"
										showArrow = { false }
										extra = { this.genCheckboxB() }
									>
										<Descriptions 
											column={ 1 }
											style={{ 
												background: !this.state.change ? "none" : "#fafafa" 
											}}
										>
											<Descriptions.Item label="Profile Name">
													{ this.props.record.profile_from.profilename }
											</Descriptions.Item>
											<Descriptions.Item label="Description">
													{ this.props.record.profile_from.description }
											</Descriptions.Item>
										</Descriptions>
									</Panel>
							</Collapse>
						)
					}
					<Divider />
					<div style={{ textAlign:'right' }} >
						<Button 
							onClick={ this.props.onClose } 
							style={{ marginRight: 8 }}
						>
							Cancel
						</Button>
						<Button 
							type='primary' 
							onClick={ this.onSubmit } 
						>
							Submit
						</Button>
					</div>
				</Drawer>
			</div>
		);
	}
}

export { MergeDrawer };
