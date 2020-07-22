import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';

// import components from ant design
import { FileSearchOutlined } from '@ant-design/icons';
import { 
	Input, 
	Select, 
	Tag, 
} from 'antd';

// import shared and child components
import { TableWrapper } from './TableWrapper'

// import services

// import helpers
import { 
	helpers 
} from '_helpers';

// destructure imported components and objects
const { compare } = helpers;
const { Option } = Select

class Case extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
		};
	}
	
	componentDidMount() {
	}

	// define columns for TableBody
	columns = [
		{
			title: 'Case Name',
			dataIndex: 'casename',
			key: 'casename',
			sorter: (a, b) => compare(a.casename, b.casename),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: true
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			sorter: (a, b) => compare(a.status, b.status),
			sortDirection: ['ascend', 'descend'],
			width: '10%',
			render: status => {
				let color = 'geekblue';
				let text = 'Open';
				switch (status) {
					case 'o' :
						color = 'geekblue';
						text = 'Open';
						break;
					case 'q' :
						color = 'purple';
						text = 'Queried';
						break;
					case 'r' :
						color = 'cyan';
						text = 'Replied';
						break;
					case 'a' :
						color = 'green';
						text = 'Approved';
						break;
					case 'e' :
						color = 'red';
						text = 'Rejected';
						break;
					case 'd' :
						color = 'default';
						text = 'Deferred';
						break;
					default:
						color = 'geekblue';
						text = 'Open';
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
			title: 'Category',
			dataIndex: 'categoryname',
			key: 'categoryname',
			sorter: (a, b) => compare(a.categoryname, b.categoryname),
			sortDirection: ['ascend', 'descend'],
			width: '10%',
			setFilter: true
		},
		{
			title: 'Queried Email',
			dataIndex: 'email',
			key: 'email',
			sorter: (a, b) => compare(a.email, b.email),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: true
		},
		{
			title: 'Account Bound',
			dataIndex: 'accountname',
			key: 'accountname',
			sorter: (a, b) => compare(a.accountname, b.accountname),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: true
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Category',
			name: 'categoryname',
			rules: [
				{
					required: false,
					message: 'Category cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Select
					disabled={ disabled }
				>
					{
						this.props.categories.map( item => (
							<Option
								key={ item.id }
								value={ item.categoryname }
							>
								{ item.categoryname }
							</Option>
						))
					}
				</Select>
			)
		},
		{
			label: 'Case Name',
			name: 'casename',
			rules: [
				{
					required: true,
					message: 'casename cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Input
					maxLength={255}
					allowClear
					disabled={ disabled }
				/>
			)
		},
		{
			label: 'Remarks',
			name: 'remarks',
			rules: [
				{
					required: true,
					message: 'remarks cannot be empty',
				},
			],
			editable: true,
			input: disabled => (
				<Input.TextArea
					autoSize={{ minRows: 2, maxRows: 8 }}
					maxLength={255}
					allowClear
					disabled={ disabled }
				/>
			)
		},			
		{
			label: 'Status',
			name: 'status',
			rules: [
				{
					required: true,
					message: 'status cannot be empty',
				}
			],
			editable: false,
			input: disabled => (
				<Select
					disabled={ disabled }
				>
					<Option value="o">Open</Option>
					<Option value="q">Queried</Option>
					<Option value="r">Replied</Option>
					<Option value="a">Approved</Option>
					<Option value="e">Rejected</Option>
					<Option value="d">Deferred</Option>
				</Select>
			)
		},
		{
			label: 'Queried Email',
			name: 'email',
			rules: [
				{
					required: true,
					message: 'Queried email cannot be empty',
				}
			],
			editable: true,
			input: (disabled, record) => 
			record.email ?
			(
				<span style={{ marginLeft: "15px" }}>
					{ record.email }
				</span>
			) : 
			(
				<Select
					disabled={ disabled }
				>
					{
						this.props.dataEmail.map( item => (
							<Option
								key={ item.id }
								value={ item.email }
							>
								{ item.email }
							</Option>
						))
					}
				</Select>
			)
		},
	];

	// define table header
	tableHeader = this.props.tableHeader ? this.props.tableHeader : 
	(
		<>
			<FileSearchOutlined />
			<strong>Cases</strong>
		</>
	)

	// bind versions of CRUD

	// refresh table
	refreshTable = () => {
		this.setState({ tableWrapperKey: Date.now() })
	};

	render(){
		return (
			<div className='Case'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					// data props
					data={ this.props.data }
					accounts={ this.props.accounts }
					dataEmail={ this.props.dataEmail }
					dataAccount={ this.props.dataAccount }
					labels={ this.props.labels }
					// display props
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					drawerTitle='Create A New Case'
					loading={ this.props.loading }
					showHeader={ this.props.showHeader }
					showDropdown={ this.props.showDropdown }
					// api props
					create={ this.props.create }
					edit={ this.props.edit }
					bind={ this.props.bind }
					delete={ this.props.delete }
					refreshTable={ this.refreshTable }
					list={ this.props.list }
					refreshPage={ this.props.refreshPage }
				>
				</TableWrapper>
			</div>
		);
	}
}

export { Case };
