import React, { Component } from 'react';

// import components from ant design
import { 
	Button, Radio, Switch, Row, Col, Modal, 
	Collapse, Space, message, Spin, 
} from 'antd';
import { 
	CopyOutlined,
} from '@ant-design/icons';

// import shared and child components
import SearchableInput from '../../_components/SearchableInput'
import RichTextOutput from '../../_components/RichTextOutput'

// destructure child components
const { Panel } = Collapse;

class Template extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for template language
			templateLang: "Chn",
			// for search by
			searchBy: "title",
			searchProperty: "title",
			// for Spin
			loading: false,
			// for Collapse
			panels: this.allTemplates,
			allTemplates: this.allTemplates,
		};
	}
	
	allTemplates = [
		{
			key: '1',
			title: 'change of membership response',
			bodyEng: '<h2>By doing so, you will lose your privilge as abcdf</h2>',
			bodyChn: "<h2>QQQQQQQQQQDDDDDDDDDDD</h2>",
			stickTop: false,
			copiedCount: 0,
			updatedAt: 0,
		},
		{
			key: '2',
			title: 'unban response',
			bodyEng: `<h2>please behave yourself</h2>
						<p>or you will be banned permanetly
						I am not kidding
						<strong>seriously</strong>
						I mean it
						stop laughing</p>
						`,
			bodyChn: "<strong>TTTTT</strong><em>AAAAAAAAAAAAAAAAA</em>",
			stickTop: false,
			copiedCount: 0,
			updatedAt: 1,
		},
		{
			key: '3',
			title: 'change of password response',
			bodyEng: `<h2>please provide your credentials</h2>
						<p><em>please please please</em>
						please please please
						please please please</p>
						`,
			bodyChn: "<strong>ASDASDF</strong><h2>ASDFASDFASDFASDFASDF</h2>",
			stickTop: false,
			copiedCount: 0,
			updatedAt: 2,
		},
		{
			key: '4',
			title: 'terms and conditions',
			bodyEng: `<h2>terms and conditions<h2><ol>
						<li>clause 1</li>
						<li>clause 2</li>
						<li>clause 3</li>
						<li>clause 4</li></ol>
						`,
			bodyChn: "<em>ZZZ</em> <strong>ZZZ1234</strong>",
			stickTop: false,
			copiedCount: 0,
			updatedAt: 3,
		},
	];

	titleModal = () => (
		<Row>
			<Col span={ 8 }>
				Search templates
			</Col>
			<Col
				span={ 3 }
				offset={ 12 }
			>
				<Radio.Group 
					size="small"
					buttonStyle="solid"
					defaultValue="Chn"
					onChange={this.handleChangeRadioLang} 
					value={this.state.templateLang}
				>
					<Radio.Button value={"Chn"}>CHN</Radio.Button>
					<Radio.Button value={"Eng"}>ENG</Radio.Button>
				</Radio.Group>
			</Col>
		</Row>	
	)

	handleChangeRadioLang = event => {
		const templateLang = event.target.value;
		this.setState({ templateLang })
		const searchBy = this.state.searchBy;
		let searchProperty = searchBy;
		if (searchProperty === "body") {
				searchProperty += templateLang;
				this.setState({ searchProperty })
		}
		message.info("Template Bodies Shown in " + 
			( templateLang === "Chn" ? "Chinese" : "English" ) );
	}

	handleChangeRadioSearchBy = event => {
		const searchBy = event.target.value;
		let searchProperty = searchBy;
		if (searchProperty === "body")
				searchProperty += this.state.templateLang;
		this.setState({
			searchBy,
			searchProperty,
		});
		message.info("Search Templates by " + searchBy);
	};

	handleSearch = data => {
		this.setState({ loading: true });
		setTimeout( () => this.updateCollapse(data) , 1000 );
	}

	updateCollapse = data => {
		const searchProperty = this.state.searchProperty;
		const panels = this.state.allTemplates
			.filter( item => item[searchProperty].includes(data) );
		this.setState({ 
			panels,
			loading: false, 
		});
	}

	genExtraModal = item => (
		<div
			onClick={ event => event.stopPropagation() }
		>
		<Space size="middle">
			<Switch 
				checkedChildren="top"
				checked={ item.stickTop } 
				defaultChecked={ item.stickTop } 
				onChange={ this.handleChangeSwitchStickTop.bind(this, item.key) }
			/>
			<Button
				type="ghost"
				style={{ border: "none" }}
				size="small"
				onClick={ this.handleClickCopy.bind(this, item) }
			>
				<CopyOutlined />
			</Button>
		</Space>
		</div>
	);

	handleChangeSwitchStickTop = (key, checked) => {
		let allTemplates = this.state.allTemplates.map( item => {
			if (item.key === key) {
				item.stickTop = checked;
				item.updatedAt = Date.now();
			}
			return item;
		});

		// sort the arrays accordingly
		allTemplates.sort(this.dynamicSort("stickTop"));

		let panels = this.state.panels.slice();
		panels.sort(this.dynamicSort("stickTop"));

		this.setState({
			allTemplates,
			panels,
		});

		// emphasize the change with background color changes
		const panel = document.getElementById("panel" + key);
		const bgcolor = panel.style.backgroundColor;
		panel.style.backgroundColor = "#a9a9a9";
		setTimeout( () => {
			panel.style.backgroundColor = bgcolor;
			}, 500 );
	}

	handleClickCopy = template => {
		// copy to clipboard
		const key = "body" + this.state.templateLang;
		this.copyToClip( template[key] )

		// keep count
		const allTemplates = this.state.allTemplates.map( item => {
			if (item.key  === template.key)
				 item.copiedCount++;	
			return item;
		});
		this.setState({ allTemplates });

		message.success("Template Copied");
	}

	copyToClip(str) {
		function listener(e) {
			e.clipboardData.setData("text/html", str);
			e.clipboardData.setData("text/plain", str);
			e.preventDefault();
		}
		document.addEventListener("copy", listener);
		document.execCommand("copy");
		document.removeEventListener("copy", listener);
	};

	dynamicSort(property) {
			var sortOrder = 1;

			if(property[0] === "-") {
					sortOrder = -1;
					property = property.substr(1);
			}

			return function (a,b) {
					if (typeof a[property] === "string") {
						if(sortOrder === -1){
								return b[property].localeCompare(a[property]);
						}else{
								return a[property].localeCompare(b[property]);
						}        
					} else {
						if(sortOrder === -1){
								return a[property] - b[property];
						}else{
								return b[property] - a[property];
						}        
					}
			}
	}

	onCancel = event => {
		const sticktops = this.state.allTemplates
			.filter( item => item.stickTop );
		const rest = this.state.allTemplates
			.filter( item => !item.stickTop )
			.sort( this.dynamicSort("copiedCount") );
			
		this.setState({
			allTemplates: [...sticktops, ...rest],
			panels: [...sticktops, ...rest],
		});

		this.props.onCancel(event);
	}

	render(){
		return (
			<div className="Template">
				<Modal
					key={ this.props.modalKey }
					title={ this.titleModal() }
					width={ 900 }
					style={{ top: 20 }}
					bodyStyle={{ minHeight: 600, overflow: "auto" }}
					visible={ this.props.visible }
					onCancel={ this.onCancel }
					footer={ null }
				>
					<div
						style={{ margin: "16px 4px" }}
					>
						<Space>
							Search By
							<Radio.Group 
								onChange={this.handleChangeRadioSearchBy} 
								value={this.state.searchBy}
							>
								<Radio value={"title"}>Title</Radio>
								<Radio value={"body"}>Body</Radio>
							</Radio.Group>
							<SearchableInput
								allOptions={ this.allTemplates }
								searchProperty={ this.state.searchProperty }
								onSearch={ this.handleSearch }
								placeholder={ "Search Templates by " + this.state.searchBy }
							/>
						</Space>
					</div>
					<div>
						<Spin spinning={ this.state.loading }>
							<Collapse 
								expandIconPosition="left"
								accordion
							>
									{
										this.state.panels.map( item => (
											<Panel 
												id={ "panel"+item.key }
												header={ item.title }
												key={ item.key }
												extra={ this.genExtraModal(item) }
											>
												<RichTextOutput 
													body={ this.state.templateLang === "Chn" ?
														item.bodyChn : item.bodyEng }
												/>
											</Panel>
										) )
									}
							</Collapse>
						</Spin>
					</div>
				</Modal>
			</div>
		);
	}
}

export default Template;
