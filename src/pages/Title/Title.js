import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	Input,
	Select,
	Spin,
	Tag,
} from 'antd';
import { RobotOutlined } from '@ant-design/icons';

// import shared and child components
import { TableWrapper } from './TableWrapper'

// import services
import { titleService } from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { createSync, retrieveSync, listSync, updateSync } = backend;
const { compare } = helpers;
const { Option } = Select;

class Title extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
			spinning: false,
			rowCount: 0,
			defaultPageSize: 10,
			defaultPage: 1,
		};
	}
	
	componentDidMount() {
		this.setState({ spinning: true }, async () => {
			const limit = this.state.defaultPageSize;
			const offset = (this.state.defaultPage - 1) * limit;
			await this.listSync({
				limit,
				offset,
			});
			const { entry: {row_count} } = await this.retrieveRowCount();
			this.setState({ 
				spinning: false, 
				rowCount: row_count, 
			});
		});
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Candidate ID',
			dataIndex: 'candidate_id',
			key: 'candidate_id',
			sorter: (a, b) => compare(a.candidate_id, b.candidate_id),
			sortDirection: ['ascend', 'descend'],
			width: '15%',
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Title',
			dataIndex: 'message',
			key: 'message',
			sorter: (a, b) => compare(a.message, b.message),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Tag',
			dataIndex: 'tag',
			key: 'tag',
			sorter: (a, b) => compare(a.tag, b.tag),
			sortDirection: ['ascend', 'descend'],
			width: '15%',
			ellipsis: true,
			//setFilter: true
			render: tag => {
				let color = 'green';
				let text = 'Normal';
				switch (tag) {
					case 0 :
						color = 'green';
						text = 'Normal';
						break;
					case 1 :
						color = 'red';
						text = 'Spammer';
						break;
					default:
						color = 'green';
						text = 'Normal';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ text }
					</Tag>
				);
			},
		},
		{
			title: 'Spam Score',
			dataIndex: 'score',
			key: 'score',
			sorter: (a, b) => compare(a.score, b.score),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			//setFilter: true
			render: score => {
				let color = '#00ff00';
				switch (score) {
					case 0 :
						color = '#00ff00';
						break;
					case 1 :
						color = '#2efc00';
						break;
					case 2 :
						color = '#5bf900';
						break;
					case 3 :
						color = '#88f700';
						break;
					case 4 :
						color = '#b3f400';
						break;
					case 5 :
						color = '#def200';
						break;
					case 6 :
						color = '#efd600';
						break;
					case 7 :
						color = '#eca800';
						break;
					case 8 :
						color = '#ea7b00';
						break;
					case 9 :
						color = '#e74f00';
						break;
					case 10 :
						color = '#e52400';
						break;
					default:
						color = '#00ff00';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ score }
					</Tag>
				);
			},
		},
		{
			title: 'Mistagged',
			dataIndex: 'mistagged',
			key: 'mistagged',
			sorter: (a, b) => compare(a.mistagged, b.mistagged),
			sortDirection: ['ascend', 'descend'],
			width: '15%',
			ellipsis: true,
			//setFilter: true
			render: mistagged => {
				let color = '#87d068';
				let text = 'No';
				switch (mistagged) {
					case 0 :
						color = '#87d068';
						text = 'No';
						break;
					case 1 :
						color = '#f50';
						text = 'Yes';
						break;
					default:
						color = '#87d068';
						text = 'No';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ text }
					</Tag>
				);
			},
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Candidate ID',
			name: 'candidate_id',
			rules: [
				{
					required: true,
					message: 'candidate id cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ true }
					placeholder={ "Candidate ID name must be unique" }
				/>
			)
		},
		{
			label: 'Title',
			name: 'message',
			rules: [
				{
					required: true,
					message: 'title cannot be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ true }
					placeholder={ "title" }
				/>
			)
		},			
		{
			label: 'Group',
			name: 'group',
			rules: [
				{
					required: true,
					message: 'group cannot be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Select
					disabled={ true }
					placeholder={ "Group" }
				>
							<Option
								key={ 0 }
								value={ 0 }
							>
								Normal
							</Option>
							<Option
								key={ 1 }
								value={ 1 }
							>
								Spammer
							</Option>
				</Select>
			)
		},			
		{
			label: 'Score',
			name: 'score',
			rules: [
				{
					required: true,
					message: 'score cannot be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ true }
					placeholder={ "score" }
				/>
			)
		},			
		{
			label: 'Mistagged',
			name: 'mistagged',
			rules: [
				{
					required: true,
					message: 'mistagged cannot be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Select
					disabled={ disabled }
					placeholder={ "Mistagged" }
				>
							<Option
								key={ 0 }
								value={ 0 }
							>
								No
							</Option>
							<Option
								key={ 1 }
								value={ 1 }
							>
								Yes
							</Option>
				</Select>
			)
		},			
	];

	// define table header
	tableHeader = (
		<>
			<RobotOutlined />
			<strong>Titles</strong>
		</>
	)

	// bind versions of CRUD
	config = {
		service: titleService,
		retrieve: "retrieve",
		list: "list",
		update: "update",
		dataName: "data",
	};
	retrieveRowCount = retrieveSync.bind(this, {
		...this.config, 
		retrieve: "retrieveRowCount",
	});
	listSync = listSync.bind(this, this.config);
	updateSync = updateSync.bind(this, this.config);
	downloadVectorizerSync = retrieveSync.bind(this, {
		...this.config, 
		retrieve: "downloadVectorizer",
	});
	downloadClfSync = retrieveSync.bind(this, {
		...this.config, 
		retrieve: "downloadClf",
	});
	predictSync = createSync.bind(this, {
		...this.config,
		create: "predict",
		dataName: "unknown",
	});

	// refresh table
	refreshTable = () => {
		this.setState({ spinning: true }, async () => {
			await this.listSync();
			this.setState({ spinning: false });
			this.setState({ tableWrapperKey: Date.now() })
		});
	};

	// handlers for downloading classifer 
	download = (name, stream) => {
		const url = window.URL.createObjectURL(new Blob([stream]));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', name);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	handleClickDownload = async () => {
		const streamVectorizer = await this.downloadVectorizerSync();
		const nameVectorizer = "title_vectorizer.pkl"
		this.download(nameVectorizer, streamVectorizer);

		const streamClf = await this.downloadClfSync();
		const nameClf = "title_clf.pkl"
		this.download(nameClf, streamClf);
	}

	render(){
		return (
			<div className='Title'>
				<Spin spinning={ this.state.spinning }>
					<TableWrapper
						key={ this.state.tableWrapperKey }
						// data props
						data={ this.state.data }
						rowCount={ this.state.rowCount }
						defaultPageSize={ this.state.defaultPageSize }
						defaultPage={ this.state.defaultPage}
						// display props
						columns={ this.columns }
						formItems={ this.formItems }
						tableHeader={ this.tableHeader }
						drawerTitle='A Title'
						pagination={ false }
						noBatch={ true }
						// api props
						list={ this.listSync }
						edit={ this.updateSync }
						predict={ this.predictSync }
						refreshTable={ this.refreshTable }
						onClickDownload={ this.handleClickDownload }
					>
					</TableWrapper>
				</Spin>
			</div>
		);
	}
}

export { Title };
