import React, { Component } from 'react';

// import components from ant design
import { 
	AutoComplete, 
	Button, 
	Col, 
	Collapse, 
	Modal, 
	Input,
	Radio, 
	Row, 
	Space, 
	Spin, 
	Switch, 
	message, 
} from 'antd';
import { 
	CopyOutlined,
} from '@ant-design/icons';

// import shared and child components
import { RichTextOutput } from '_components'

// import services
import { 
	categoryService,
	templateService,
} from '_services';

// import helpers
import { backend } from "_helpers";

// destructure imported components and objects
const { list, toggleSticktop, incrementCount } = backend;
const { Panel } = Collapse;
const { Search } = Input;

class Template extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// for template language
			templateLang: "eng",
			// for search by
			searchBy: "title",
			searchProperty: "title",
			// for Spin
			loading: false,
			// for Collapse
			panels: [],
			// for AutoComplete
			options: [],
			categories: [],
			// for template search
			templates: [],
		};
	}
	
	componentDidMount() {
		this.listTemplates();
		this.listPanels();
		this.listCategories();
	}

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
					defaultValue="eng"
					onChange={this.handleChangeRadioLang} 
					value={this.state.templateLang}
				>
					<Radio.Button value={"eng"}>Eng</Radio.Button>
					<Radio.Button value={"chn"}>Chn</Radio.Button>
				</Radio.Group>
			</Col>
		</Row>	
	)

	handleChangeRadioLang = event => {
		// update template language
		const templateLang = event.target.value;
		this.setState({ 
			templateLang,
			options: [],
		});
		// update search property 
		const searchBy = this.state.searchBy;
		if (searchBy === "body")
				this.setState({ searchProperty: searchBy + '_' + templateLang });
		message.info("Template Bodies Shown in " + 
			( templateLang === "chn" ? "Chinese" : "English" ) );
	}

	handleChangeRadioSearchBy = event => {
		// update search by
		const searchBy = event.target.value;
		this.setState({ 
			searchBy,
			options: [],
		});
		// update search property
		const templateLang = this.state.templateLang;
		if (searchBy === "body")
				this.setState({ searchProperty: searchBy + '_' + templateLang });
		else
				this.setState({ searchProperty: searchBy });
		message.info("Search Templates by " + searchBy);
	};

	// filter AutoComplete options when input field changes
	handleChange = data => {
		const options = this.state.categories
			.map( item => { return {label: item.categoryname, options: []}; });
		options.push( {label:'Uncategorized', options:[]} );
		console.log(options);
		this.state.templates
			.filter( item => item[this.state.searchProperty].includes(data) )
			.forEach( item => {
				options.forEach( option => {
					if (option.label === item.categoryname)
						option.options.push( {value: item[this.state.searchProperty]} );
				})
			});
		console.log(options);
		this.setState({ options });
	}

	handleSearch = data => {
		this.setState({ loading: true });
		setTimeout( () => this.updateCollapse(data) , 1000 );
	}

	updateCollapse = data => {
		const searchProperty = this.state.searchProperty;
		const panels = this.state.templates
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
				checked={ (item.sticktop === "t" ? true : false) } 
				defaultChecked={ (item.sticktop === "t" ? true : false) } 
				onChange={ this.handleToggleSticktop.bind(this, item.id) }
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

	handleToggleSticktop = (id, checked) => {
		
		// backend
		const sticktop = checked ? 't' : 'f';
		this.toggleSticktop(id, {sticktop});

		// frontend
		const toggle = { t: "f", f: "t" }
		const templates = this.state.templates.slice();
		let index = templates.findIndex( item => item.id === id );
		templates[index].sticktop = toggle[ templates[index].sticktop ];
		templates.sort(this.dynamicSort("-sticktop"));
		this.setState({ templates });
		const panels = this.state.panels.slice();
		index = panels.findIndex( item => item.id === id );
		panels[index].sticktop = toggle[ panels[index].sticktop ];
		panels.sort(this.dynamicSort("-sticktop"));
		this.setState({ panels });

		// emphasize the change with background color changes
		const panel = document.getElementById("panel" + id);
		const bgcolor = panel.style.backgroundColor;
		panel.style.backgroundColor = "#a9a9a9";
		setTimeout( () => {
			panel.style.backgroundColor = bgcolor;
			}, 500 );
	}

	handleClickCopy = template => {
		// copy to clipboard
		this.copyToClip( template["body_" + this.state.templateLang] )
		// keep count
		this.incrementCount( template.id );
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

	// handler for click close
	onCancel = event => {
		this.listPanels();
		this.setState({ 
			templateLang: "eng",
			searchBy: "title",
			searchProperty: "title",
		});
		this.props.onCancel();
	}

	// bind versions of CRUD
	listTemplates = list.bind(this, templateService, 'templates');
	listPanels = list.bind(this, templateService, 'panels');
	listCategories= list.bind(this, categoryService, 'categories');
	toggleSticktop = toggleSticktop.bind(this, templateService, 'templates');
	incrementCount = incrementCount.bind(this, templateService, 'templates');

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
							<AutoComplete
								onChange={ this.handleChange }
								onSelect={ this.handleSearch }
								options={ this.state.options }
								style={{ width: 320 }}
							>
								<Search
									onSearch={ this.handleSearch }
									placeholder={ "Search Templates by "+this.state.searchBy }
									size="middle"
									allowClear
								/>
							</AutoComplete>
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
												id={ "panel"+item.id }
												header={ item.title }
												key={ item.id }
												extra={ this.genExtraModal(item) }
											>
												<RichTextOutput 
													body={ this.state.templateLang === "chn" ?
														item.body_chn : item.body_eng }
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
