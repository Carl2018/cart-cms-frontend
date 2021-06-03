import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { 
	Input,
	Select, 
	Spin,
	Tag, 
} from 'antd';
import { ContactsOutlined } from '@ant-design/icons';

// import shared and child components
import { TableWrapper } from './TableWrapper'

// import services
import { 
	labelService,
	profileService,
} from '_services';

// import helpers
import { 
	backend,
	helpers 
} from '_helpers';

// destructure imported components and objects
const { 
	createSync, 
	retrieveSync, 
	listSync, 
	updateSync, 
	hideSync 
} = backend;
const { compare } = helpers;
const { Option } = Select

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
			labels: [],
			spinning: false,
			rowCount: 0,
			defaultPageSize: 25,
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
			await this.listLabels();
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
			title: 'Profile ID',
			dataIndex: 'profilename',
			key: 'profilename',
			sorter: (a, b) => compare(a.profilename, b.profilename),
			sortDirection: ['ascend', 'descend'],
			width: '10%',
			setFilter: true
		},
		{
			title: 'Profile Description',
			dataIndex: 'description',
			key: 'description',
			sorter: (a, b) => compare(a.description, b.description),
			sortDirection: ['ascend', 'descend'],
			width: '30%',
			ellipsis: true,
			setFilter: true
		},
		{
			title: 'Label',
			key: 'labelname',
			dataIndex: 'labelname',
			sorter: (a, b) => compare(a.labelname, b.labelname),
			sortDirection: ['ascend', 'descend'],
			render: labelname => {
				const labels = this.state.labels.slice();
				const elements = labelname === undefined 
					|| labelname[0] === null 
					|| labels.length === 0 
					? <></> : 
					labelname.map( (item, index) => {
						const label_color = labels
							.find( label => label.labelname === item ).label_color;
						return (
							<Tag color={ label_color } key={ uuidv4() }>
								{ item }
							</Tag>
						);
					});
				return elements;
			},
			width: '20%',
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Profile ID',
			name: 'profile_id',
			rules: [
				{
					required: true,
					message: 'profile_id cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled
					placeholder={ "Profile ID" }
				/>
			)
		},
		{
			label: 'Profile Description',
			name: 'description',
			rules: [
				{
					message: 'Profile description can be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
					placeholder={ "Profile description" }
				/>
			)
		},
		{
			label: 'Labels',
			name: 'labelname',
			rules: [
				{
					required: false,
					message: 'Labels cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Select
					disabled={ disabled }
					mode="multiple"
					placeholder={ "Labels" }
					showSearch
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children.trim().toLowerCase()
							.indexOf(input.trim().toLowerCase()) >= 0
					}
				>
					{
						this.state.labels.map( item => (
							<Option
								key={ item.id }
								value={ item.labelname }
							>
								{ item.labelname }
							</Option>
						))
					}
				</Select>
			)
		},
	];

	// define table header
	tableHeader = (
		<>
			<ContactsOutlined />
			<strong>Profiles</strong>
		</>
	)

	// bind versions of CRUD
	config = {
		service: profileService,
		create: "create",
		retrieve: "retrieve",
		list: "list",
		update: "update",
		hide: "hide",
		dataName: "data",
	};
	createSync = createSync.bind(this, this.config);
	retrieveRowCount = retrieveSync.bind(this, {
		...this.config, 
		retrieve: "retrieveRowCount",
	});
	listSync = listSync.bind(this, this.config);
	retrieveNextId = retrieveSync.bind(this, {
		...this.config,
		retrieve: "retrieveNextId",
	});
	updateSync = updateSync.bind(this, this.config);
	hideSync = hideSync.bind(this, this.config);

	configLabel = {
		service: labelService,
		list: "list",
		dataName: "labels",
	};
	listLabels = listSync.bind(this, this.configLabel);

	// refresh table
	refreshTable = () => {
		this.setState({ spinning: true }, async () => {
			await this.listSync();
			await this.listLabels();
			this.setState({ spinning: false });
			this.setState({ tableWrapperKey: Date.now() })
		});
	};

	render(){
		return (
			<div className='Profile'>
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
						drawerTitle='A Profile'
						pagination={ false }
						size={ "small" }
						// api props
						create={ this.createSync }
						list={ this.listSync }
						retrieveNextId={ this.retrieveNextId }
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

export { Profile };
