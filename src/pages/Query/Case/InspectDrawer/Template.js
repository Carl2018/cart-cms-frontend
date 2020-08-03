import React, { Component } from 'react';

// import components from ant design
import { 
	AutoComplete, 
	Button, 
	Col, 
	Collapse, 
	Modal, 
	Input,
	Pagination,
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
import { 
	backend, 
	helpers, 
} from "_helpers";

// destructure imported components and objects
const { listSync, updateSync } = backend;
const { dynamicSort } = helpers;
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
			// for pagination
			currentPage: 1,
			currentPanels: [],
			pageSize: 5,
			// for toggle
			emphasized: 0,
		};
	}
	
	componentDidMount() {
		this.listSync();
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
		const searchProperty = this.state.searchProperty;
		let options = [];
		if (searchProperty === "categoryname" ) {
			const categories = this.state.categories
				.map( item => item.categoryname );
			categories.push( "Uncategorized" );
			options = categories
				.filter( (item, index, array) => array.indexOf(item) === index )
				.filter( item => item.trim().toLowerCase()
					.includes(data.trim().toLowerCase()) 
				)
				.map( item => ({ value: item }) );
		} else {
			options = this.state.categories
				.map( item => { return {label: item.categoryname, options: []}; });
			options.push( {label:'Uncategorized', options:[]} );
			this.state.templates
				.filter( item => item[searchProperty].trim().toLowerCase()
					.includes(data.trim().toLowerCase())
				)
				.forEach( item => {
					options.forEach( option => {
						if (option.label === item.categoryname)
							option.options.push( {value: item[searchProperty]} );
					})
				});
			// remove empty category
			options = options.filter( item => item.options.length !== 0 );
		}
		this.setState({ options });
	}

	handleSearch = data => {
		this.setState({ loading: true });
		setTimeout( () => this.updateCollapse(data.trim().toLowerCase()) , 500 );
	}

	updateCollapse = data => {
		const searchProperty = this.state.searchProperty;
		const panels = this.state.templates
			.filter( item => item[searchProperty].trim().toLowerCase().includes(data) );
		panels.sort(dynamicSort("-sticktop"));
		const currentPanels = panels.slice(0, this.state.pageSize);
		this.setState({ 
			currentPage: 1,
			currentPanels,
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
		const templates = this.state.templates.slice();
		let index = templates.findIndex( item => item.id === id );
		templates[index].sticktop = sticktop;
		templates.sort(dynamicSort("-sticktop"));
		console.log(templates);
		this.setState({ templates });
		const panels = this.state.panels.slice();
		index = panels.findIndex( item => item.id === id );
		panels[index].sticktop = sticktop;
		panels.sort(dynamicSort("-sticktop"));
		const currentPage = this.state.currentPage;
		const pageSize = this.state.pageSize;
		const currentPanels = panels
			.slice(pageSize*(currentPage - 1), pageSize*currentPage);
		this.setState({ 
			panels,
			currentPanels,
		});

		// emphasize the change with background color changes
		this.setState({ emphasized: id });
		setTimeout( () => this.setState({ emphasized: 0 }), 500 );
	}

	handleClickCopy = template => {
		// copy to clipboard
		this.copyToClip( template["body_" + this.state.templateLang] )
		// keep count
		this.incrementCount( template.id );
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

	// handler for click close
	onCancel = event => {
		this.listSync();
		this.setState({ 
			currentPage: 1,
			templateLang: "eng",
			searchBy: "title",
			searchProperty: "title",
		});
		this.props.onCancel();
	}

	// handler for page change
	handleChangePage = currentPage => {
		const pageSize = this.state.pageSize
		const currentPanels = this.state.panels
			.slice(pageSize*(currentPage - 1), pageSize*currentPage);
		this.setState({ 
			currentPage,
			currentPanels,
		});
	}

	// handler for show size change
	handleShowSizeChange = (page, pageSize) => {
		const currentPanels = this.state.panels.slice(0, pageSize);
		this.setState({ 
			currentPage: 1,
			currentPanels,
			pageSize,
		});
	}

	// bind versions of CRUD
	configTemplate = {
		service: templateService,
		retrieve: "retrieve",
		list: "list",
		update: "toggleSticktop",
		dataName: "templates",
		editSuccessMsg: "Template has been fixed to top",
	};
	listTemplates = listSync.bind(this, this.configTemplate);
	listSync = async () => {
		const response = await this.listTemplates(); 
		if (response.code === 200) {
			const panels = response.entry;
			const currentPanels = panels.slice(0, this.state.pageSize);
			this.setState({ 
				panels,
				currentPanels,
			});
		}
	}
	toggleSticktop = updateSync.bind(this, this.configTemplate);
	incrementCount = updateSync.bind(this, 
		{
			...this.configTemplate, 
			update:"incrementCount", 
			editSuccessMsg: "Template Coplied"
		}
	);

	configCategory = {
		service: categoryService,
		list: "list",
		dataName: "categories",
	};
	listCategories= listSync.bind(this, this.configCategory);

	render(){
		const emphasized = this.state.emphasized;
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
								<Radio value={"categoryname"}>Category</Radio>
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
										this.state.currentPanels.map( item => (
											<Panel 
												id={ "panel"+item.id }
												header={ item.title }
												key={ item.id }
												extra={ this.genExtraModal(item) }
												style={{ backgroundColor: emphasized === item.id ? 
													"#a9a9a9" : "transparent" }}
											>
												<RichTextOutput 
													lang={ this.state.templateLang }
													body={ this.state.templateLang === "chn" ?
														item.body_chn : item.body_eng }
												/>
											</Panel>
										) )
									}
							</Collapse>
							<Row>
								<Col
									span={ 12 }
									offset={ 12 }
									style={{ textAlign: "right" }}
								>
									<Pagination
										defaultCurrent={1}
										size={ "small" }
										style={{ marginTop: "20px" }}
										pageSize={ this.state.pageSize }
										showSizeChanger={ true }
										pageSizeOptions={ [5, 10] }
										onShowSizeChange={ this.handleShowSizeChange }
										showQuickJumper
										total={ this.state.panels.length }
										current={ this.state.currentPage }
										onChange = { this.handleChangePage }
									/>
								</Col>
							</Row>
						</Spin>
					</div>
				</Modal>
			</div>
		);
	}
}

export default Template;
