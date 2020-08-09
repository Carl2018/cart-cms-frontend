import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { TeamOutlined } from '@ant-design/icons';
import { 
	Select, 
	Spin, 
	Tag, 
	message, 
} from 'antd';

// import shared and child components
import { TableWrapper } from './TableWrapper';

// import services

// import helpers
import { helpers } from '_helpers';

// destructure imported components and objects
const { compare } = helpers;
const { Option } = Select;

class Account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			spinning: false,
		};
	}
	
	componentDidMount() {
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Account Name',
			dataIndex: 'accountname',
			key: 'accountname',
			sorter: (a, b) => compare(a.accountname, b.accountname),
			sortDirection: ['ascend', 'descend'],
			width: '15%',
			setFilter: true
		},
		{
			title: 'Account Type',
			key: 'account_type',
			dataIndex: 'account_type',
			sorter: (a, b) => compare(a.account_type, b.account_type),
			sortDirection: ['ascend', 'descend'],
			render: account_type => {
				let color = 'gold';
				let text = 'Phone';
				switch (account_type) {
					case 'f' :
						color = 'blue';
						text = 'Facebook';
						break;
					case 'p' :
						color = 'gold';
						text = 'Phone';
						break;
					case 'a' :
						color = 'red';
						text = 'Apple';
						break;
					case 'g' :
						color = 'green';
						text = 'Google';
						break;
					default:
						color = 'gold';
						text = 'Phone';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ text }
					</Tag>
				);
			},
			width: '15%',
		},
		{
			title: 'Candidate ID',
			dataIndex: 'candidate_id',
			key: 'candidate_id',
			sorter: (a, b) => compare(a.candidate_id, b.candidate_id),
			sortDirection: ['ascend', 'descend'],
			width: '15%',
			setFilter: true
		},
		{
			title: 'Status',
			key: 'status',
			dataIndex: 'status',
			sorter: (a, b) => compare(a.status, b.status),
			sortDirection: ['ascend', 'descend'],
			render: status => {
				let color = 'default';
				let text = 'Unknown';
				switch (status) {
					case 'h' :
						color = 'red';
						text = 'Hard Banned';
						break;
					case 's' :
						color = 'orange';
						text = 'Soft Banned';
						break;
					case 'u' :
						color = 'green';
						text = 'Unbanned';
						break;
					default:
						color = 'default';
						text = 'Unknown';
						break;
				};	
				return (
					<Tag color={ color } key={ uuidv4() }>
						{ text }
					</Tag>
				);
			},
			width: '10%',
		},
		{
			title: 'Region',
			dataIndex: 'region',
			key: 'region',
			sorter: (a, b) => compare(a.region, b.region),
			sortDirection: ['ascend', 'descend'],
			width: '10%',
			setFilter: true
		},
		{
			title: 'Physicla Region',
			dataIndex: 'physical_region',
			key: 'physical_region',
			sorter: (a, b) => compare(a.physical_region, b.physical_region),
			sortDirection: ['ascend', 'descend'],
			width: '15%',
			setFilter: true
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Profile ID',
			name: 'profilename',
			rules: [
				{
					required: true,
					message: 'Profile cannot be empty',
				}
			],
			editable: true,
			input: (disabled, record) => 
			!this.props.profilename ? (<></>) :
			(
				record.id ?
				(
					<span style={{ marginLeft: "15px" }}>
						{ record.profilename }
					</span>
				) : 
				( 
					<Select
						disabled={ disabled }
						placeholder={ "Profile must be the current searched profile" }
						showSearch
						optionFilterProp="children"
						filterOption={(input, option) =>
							option.children.trim().toLowerCase()
								.indexOf(input.trim().toLowerCase()) >= 0
						}
					>
						<Option value={ this.props.profilename }>
							{ this.props.profilename }
						</Option>
					</Select>
				) 
			) 
		},
	];

	// define table header
	tableHeader = this.props.tableHeader ? this.props.tableHeader : 
	(
		<>
			<TeamOutlined />
			<strong>Accounts</strong>
		</>
	)

	// bind versions of CRUD
	banSync = async (id, record) => {
		this.setState({ spinning: true });
		if (record.status !== "u")
			await this.props.ban(id, record);
		else
			message.info("The ban button has been temporarily disabled");

		this.setState({ spinning: false });
	}

	// refresh table
	refreshTable = () => {
		this.setState({ tableWrapperKey: Date.now() })
	};

	render(){
		return (
			<div className='Account'>
				<Spin spinning={ this.state.spinning }>
					<TableWrapper
						key={ this.state.tableWrapperKey }
						// data props
						data={ this.props.data }
						profilename={ this.props.profilename }
						// display props
						columns={ this.columns }
						formItems={ this.formItems }
						tableHeader={ this.tableHeader }
						drawerTitle='An Account'
						loading={ this.props.loading }
						isSmall={ this.props.isSmall }
						showHeader={ this.props.showHeader }
						showDropdown={ this.props.showDropdown }
						// api props
						create={ this.props.create }
						edit={ this.props.edit }
						ban={ this.banSync }
						delete={ this.props.delete }
						refreshTable={ this.refreshTable }
					>
					</TableWrapper>
				</Spin>
			</div>
		);
	}
}

export { Account };
