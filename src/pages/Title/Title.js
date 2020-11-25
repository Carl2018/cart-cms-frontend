import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	Input,
	Spin,
	Tag,
} from 'antd';
import { HddOutlined } from '@ant-design/icons';

// import shared and child components
import { TableWrapper } from '_components'

// import services
import { titleService } from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { retrieveSync, listSync, updateSync } = backend;
const { compare } = helpers;

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
			width: '15%',
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Group',
			dataIndex: 'group',
			key: 'group',
			sorter: (a, b) => compare(a.group, b.group),
			sortDirection: ['ascend', 'descend'],
			width: '15%',
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Spam Score',
			dataIndex: 'score',
			key: 'score',
			sorter: (a, b) => compare(a.score, b.score),
			sortDirection: ['ascend', 'descend'],
			width: 80,
			//setFilter: true
			render: score => {
				let color = '#00ff00';
				switch (score) {
					case 0 :
						color = '#00ff00';
						break;
					case 1 :
						color = '#1bff00';
						break;
					case 2 :
						color = '#54ff00';
						break;
					case 3 :
						color = '#8dff00';
						break;
					case 4 :
						color = '#c6ff00';
						break;
					case 5 :
						color = '#ffff00';
						break;
					case 6 :
						color = '#ffe400';
						break;
					case 7 :
						color = '#ffab00';
						break;
					case 8 :
						color = '#ff7200';
						break;
					case 9 :
						color = '#ff3900';
						break;
					case 10 :
						color = '#ff0000';
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
			setFilter: true
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Title',
			name: 'titlename',
			rules: [
				{
					required: true,
					message: 'title cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
					placeholder={ "Title name must be unique" }
				/>
			)
		},
		{
			label: 'Description',
			name: 'description',
			rules: [
				{
					required: true,
					message: 'description cannot be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Input.TextArea
					autoSize={{ minRows: 2, maxRows: 8 }}
					maxLength={255}
					allowClear
					disabled={ disabled }
					placeholder={ "Title description" }
				/>
			)
		},			
	];

	// define table header
	tableHeader = (
		<>
			<HddOutlined />
			<strong>Categories</strong>
		</>
	)

	// bind versions of CRUD
	config = {
		service: titleService,
		create: "create",
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

	// refresh table
	refreshTable = () => {
		this.setState({ spinning: true }, async () => {
			await this.listSync();
			this.setState({ spinning: false });
			this.setState({ tableWrapperKey: Date.now() })
		});
	};

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
						// api props
						create={ this.createSync }
						list={ this.listSync }
						edit={ this.updateSync }
						delete={ this.hideSync }
						refreshTable={ this.refreshTable }
					>
					</TableWrapper>
				</Spin>
			</div>
		);
	}
}

export { Title };
