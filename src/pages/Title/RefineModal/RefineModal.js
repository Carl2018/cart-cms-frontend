import React, { Component } from 'react';

// import components from ant design
import { 
	Button, 
	Col, 
	Modal, 
	Row, 
	Spin, 
	Steps, 
	message, 
	notification, 
} from 'antd';

// import shared and child components
import { Collect } from "./Collect"
import { Preprocess } from "./Preprocess"
import { Fit } from "./Fit"
import { Test } from "./Test"
import { Deploy } from "./Deploy"

// import services
import { titleService } from '_services';

// import helpers
import { backend } from '_helpers';

// destructure imported components and objects
const { retrieveSync } = backend;
const { Step } = Steps;

class RefineModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for Spin
			loading: false,
			// for Steps
			current:  0,
			// for Collect
			willCollect: false,
			didCollect: false,
			reCollect: false,
			months: 6,
			loadingCollect: false,
			dataPointN: 0,
			// for Split
			dataPointO: 6000,
			didPreprocess: false,
			rePreprocess: false,
			loadingPreprocess: false,
			split: 0.7,
			trainingBgColor: "#fff",
			testBgColor: "#fff",
			frontWeightPreprocess: "normal",
			// for Fit
			didFit: false,
			reFit: false,
			loadingFit: false,
			percent: 0,
			timeTaken: 0,
			// for Test
			didTest: false,
			reTest: false,
			loadingTest: false,
			accuracy: 0,
			precision: 0,
			recall: 0,
			f1: 0,
			// for Deploy
			willDeploy: true,
			didDeploy: false,
			reDeploy: false,
			loadingDeploy: false,
		};
	}
	
	componentDidMount() {
	}

	// define number of steps
	steps = [
		{
			title: 'Collect',
			content: 'Collecting',
		},
		{
			title: 'Preprocess',
			content: 'Preprocessing',
		},
		{
			title: 'Fit',
			content: 'training',
		},
		{
			title: 'Test',
			content: 'testing',
		},
		{
			title: 'Deploy',
			content: 'Deploying',
		},
	];

	// generate title for modal
	titleModal = () => (
		<Row>
			<Col span={ 8 }>
				Refine the Title Classifier
			</Col>
		</Row>	
	)

	// get content
	getContent = current => {
		let content = null;
		switch(current) {
			case 0:
				content = (
					<Collect 
						willCollect={ this.state.willCollect }
						didCollect={ this.state.didCollect }
						reCollect={ this.state.reCollect }
						months={ this.state.months }
						loading={ this.state.loadingCollect }
						dataPointN ={ this.state.dataPointN }
						collect={ this.collect }
						changeCollect={ this.changeCollect }
						onChangeMonths={ this.handleChangeMonths }
					/>
				);
				break;
			case 1:
				content = (
					<Preprocess
						dataPointN ={ this.state.dataPointN }
						dataPointO ={ this.state.dataPointO }
						split={ this.state.split}
						didPreprocess={ this.state.didPreprocess }
						rePreprocess={ this.state.rePreprocess }
						loading={ this.state.loadingPreprocess }
						trainingBgColor={ this.state.trainingBgColor }
						testBgColor={ this.state.testBgColor }
						frontWeightPreprocess={ this.state.frontWeightPreprocess }
						onChangeSplit={ this.handleChangeSplit}
						preprocess={ this.preprocess }
					/>
				);
				break;
			case 2:
				content = (
					<Fit
						percent={ this.state.percent }
						timeTaken={ this.state.timeTaken }
						didFit={ this.state.didFit }
						reFit={ this.state.reFit }
						loading={ this.state.loadingFit }
						fit={ this.fit }
					/>
				);
				break;
			case 3:
				content = (
					<Test
						accuracy={ this.state.accuracy }
						precision={ this.state.precision }
						recall={ this.state.recall }
						f1={ this.state.f1 }
						didTest={ this.state.didTest }
						reTest={ this.state.reTest }
						loading={ this.state.loadingTest }
						test={ this.test }
					/>
				);
				break;
			case 4:
				content = (
					<Deploy 
						willDeploy={ this.state.willDeploy }
						didDeploy={ this.state.didDeploy }
						reDeploy={ this.state.reDeploy }
						loading={ this.state.loadingDeploy }
						deploy={ this.deploy }
						changeDeploy={ this.changeDeploy }
					/>
				);
				break;
			default:
				content = null;
				break;
		}
		return content;
	}

	// handlers for steps
	handleClickNext = () => {
		const { 
			current,
			willCollect,
			didCollect,
			didPreprocess,
			didFit,
			didTest,
		} = this.state;
		if (current === 0 && willCollect && !didCollect) {
			const msg = this.state.reCollect ? 
				"Please re-collect since you have made some changes" :
				"Please collect data before preprocessing"
			message.error(msg);
			return;
		}
		if (current === 1 && !didPreprocess) {
			const msg = this.state.rePreprocess ? 
				"Please re-preprocess since you have made some changes" :
				"Please preprocess the data before fitting"
			message.error(msg);
			return;
		}
		if (current === 2 && !didFit) {
			const msg = this.state.reFit ? 
				"Please re-fit since you have made some changes" :
				"Please fit the model before testing"
			message.error(msg);
			return;
		}
		if (current === 3 && !didTest) {
			const msg = this.state.reTest ? 
				"Please re-test since you have made some changes" :
				"Please test the model before deploying"
			message.error(msg);
			return;
		}
		
		this.setState({ current: current + 1 });
	}

	handleClickDone = () => {
		const { 
			willDeploy,
			didDeploy,
			reDeploy,
		} = this.state;
		if (willDeploy) {
			if (!didDeploy) {
				const msg = reDeploy ? 
					"Please re-deploy since you have made some changes" :
					"Please deploy the model before exiting"
				message.error(msg);
				return;
			}
			this.resetState();
			this.props.onCancel();
			message.success("Refinement completed");
		} else {
			this.onCancel();
		}
	}

	handleClickPrevious = () => this.setState({ current: this.state.current - 1 });

	// handlers for the collect
	collect = () => {
		const { months, reCollect } = this.state; // request paramter
		if ( months !== parseInt(months, 10) || months < 1 ) {
			message.error("months must be a positive integer");
			this.setState({ months: 6 });
			return;
		}
		if (!reCollect)
			message.info("Collecting");
		else
			message.info("Re-collecting");
		this.setState({ loadingCollect: true, loading: true }, async () => {
			const { entry } = await this.collectSync({past: months});
			message.success("Done");
			this.setState({
				dataPointN: entry.new_normal_titles + entry.new_spammy_titles,
				loading: false,
				loadingCollect: false,
				didCollect: true,
				reCollect: true,
			});
		});
	};

	changeCollect = option => {
		const { willCollect } = this.state;
		if (willCollect !== option) {
			this.setState({ 
				dataPointN: 0,
				didCollect: false,
				didPreprocess: false,
				didFit: false,
				didTest: false,
				didDeploy: false,
			});
		}
		this.setState({ willCollect: option });
	}

	handleChangeMonths = months => this.setState({ months });

	// handlers for Preprocess
	handleChangeSplit = split => {
		if (split === null || split === "")
			split = 0.5;
		if ( !isFinite(split)) {
			message.error("split must be a number between 0.5 and 1");
			this.setState({ split: 0.7 });
			return;
		}
		split = split > 0.99 ? 0.99 : split;
		split = split < 0.5 ? 0.5 : split;
		this.setState({ 
			split,
			trainingBgColor: "#fff",
			testBgColor: "#fff",
			frontWeightPreprocess: "normal",
			didPreprocess: false,
			didFit: false,
			didTest: false,
			didDeploy: false,
		});
	}
	
	preprocess = () => {
		const { rePreprocess, willCollect } = this.state;

		if (!rePreprocess)
			message.info("Preprocessing");
		else
			message.info("Re-preprocessing");
		this.setState({ loadingPreprocess: true, loading: true }, async () => {
			const retrain = willCollect ? 'y' : 'n';
			await this.preprocessSync({retrain});
			message.success("Done");
			this.setState({
				trainingBgColor: "#7cb06d",
				testBgColor: "#ad5049",
				frontWeightPreprocess: "bold",
				loading: false,
				loadingPreprocess: false,
				didPreprocess: true,
				rePreprocess: true,
			});
		});
	};

	// handlers for fit
	fit = () => {
		const { reFit } = this.state;

		if (!reFit)
			message.info("Fitting");
		else
			message.info("Re-fitting");
		this.setState({ loadingFit: true, loading: true, percent: 0 }, 
			async() => {
				const { entry } = await this.fitSync();
				message.success("Done");
				this.setState({
					percent: 100,
					timeTaken: entry.time_taken.toFixed(2),
					loading: false,
					loadingFit: false,
					didFit: true,
					reFit: true,
				});
			}
		);
	};

	// handlers for test
	test = () => {
		const { reTest } = this.state;

		if (!reTest)
			message.info("Testing");
		else
			message.info("Re-testing");
		this.setState({ loadingTest: true, loading: true, percent: 0 }, 
			async () => {
				const { entry } = await this.testSync();
				message.success("Done");
				this.setState({
					accuracy: entry.accuracy,
					precision: entry.precision,
					recall: entry.recall,
					f1: entry.f1,
					loading: false,
					loadingTest: false,
					didTest: true,
					reTest: true,
				});
			}
		);
	};

	// handlers for the deploy
	deploy = () => {
		const { reDeploy } = this.state;

		if (!reDeploy)
			message.info("Deploying");
		else
			message.info("Re-deploying");
		this.setState({ loadingDeploy: true, loading: true }, async () => {
			await this.deploySync();
			message.success("Done");
			this.setState({
				loading: false,
				loadingDeploy: false,
				didDeploy: true,
				reDeploy: true,
			});
		});
	};

	changeDeploy = option => this.setState({ willDeploy: option });

	// handlers for cancel
	resetState = () => {
		// reset state
		this.setState({
			// for Spin
			loading: false,
			// for Steps
			current:  0,
			// for Collect
			willCollect: false,
			didCollect: false,
			reCollect: false,
			months: 6,
			loadingCollect: false,
			dataPointN: 0,
			// for Split
			dataPointO: 6000,
			didPreprocess: false,
			rePreprocess: false,
			loadingPreprocess: false,
			split: 0.7,
			trainingBgColor: "#fff",
			testBgColor: "#fff",
			frontWeightPreprocess: "normal",
			// for Fit
			didFit: false,
			reFit: false,
			loadingFit: false,
			percent: 0,
			timeTaken: 0,
			// for Test
			didTest: false,
			reTest: false,
			loadingTest: false,
			accuracy: 0,
			precision: 0,
			recall: 0,
			f1: 0,
			// for Deploy
			willDeploy: true,
			didDeploy: false,
			reDeploy: false,
			loadingDeploy: false,
		});
	}

	handleClickConfirm = (closeNotification, notificationKey) => {
		this.resetState();
		this.props.onCancel();
		closeNotification(notificationKey);
		message.info("model discarded");
	};

	onCancel = () => {
		// prompt for confirmation
		const key = `open${Date.now()}`;
		const btn = (
			<Button 
				type='primary' 
				size='small' 
				onClick={ this.handleClickConfirm.bind(this, notification.close, key) }
			>
				Confirm
			</Button>
		);
		notification.open({
			message: 'About to discard the model',
			description:
				'Are you sure to discard the model?',
			btn,
			key,
			duration: 0,
			onClose: () => message.info('discard cancelled'),
		});
	}

	// bind versions of CRUD
	collectSync = retrieveSync.bind(this, {
		service: titleService, 
		retrieve: "collect",
	});
	preprocessSync = retrieveSync.bind(this, {
		service: titleService, 
		retrieve: "preprocess",
	});
	fitSync = retrieveSync.bind(this, {
		service: titleService, 
		retrieve: "fit",
	});
	testSync = retrieveSync.bind(this, {
		service: titleService, 
		retrieve: "test",
	});
	deploySync = retrieveSync.bind(this, {
		service: titleService, 
		retrieve: "deploy",
	});

	render(){
		return (
			<div className="RefineModal">
					<Modal
						key={ this.props.modalKey }
						title={ this.titleModal() }
						width={ 1000 }
						style={{ top: 20 }}
						bodyStyle={{ minHeight: 600, overflow: "auto" }}
						visible={ this.props.visible }
						onCancel={ this.onCancel }
						footer={ null }
					>
						<Spin spinning={ this.state.loading }>
							<Steps current={this.state.current}>
								{this.steps.map(item => (
									<Step key={item.title} title={item.title} />
								))}
							</Steps>
							<div className="steps-content">
								{ this.getContent(this.state.current) }
							</div>
							<div
								className="steps-action"
								style={{ textAlign: "right" }}
							>
								{ this.state.current < this.steps.length - 1 && (
									<Button type="primary" onClick={ this.handleClickNext } >
										Next
									</Button>
								) }
								{ this.state.current === this.steps.length - 1 && (
									<Button type="primary" onClick={ this.handleClickDone }>
										Done
									</Button>
								) }
								{ this.state.current > 0 && (
									<Button style={{ margin: '0 8px' }} onClick={this.handleClickPrevious}>
										Previous
									</Button>
								) }
							</div>
						</Spin>
					</Modal>
			</div>
		);
	}
}

export { RefineModal };
