import React, { Component } from 'react';

// import components from ant design
import { FileSearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

// import shared and child components
import TableWrapper from './TableWrapper'

// destructure child components

class Case extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
		};
	}
	
//	componentWillReceiveProps(nextProps) {
//		this.setState({ data: nextProps.data });
//	}

//	static getDerivedStateFromProps(nextProps, prevState) {
//		return { data: nextProps.data };
//	}
	
	// define columns for TableBody
	compare = (a, b) => {
		if (a >  b) return 1;
		if (a ===  b) return 0;
		if (a <  b) return -1;
	}

	columns = [
		{
			title: 'Case Name',
			dataIndex: 'casename',
			key: 'casename',
			sorter: (a, b) => this.compare(a.casename, b.casename),
			sortDirection: ['ascend', 'descend'],
			width: '25%',
			setFilter: true
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			sorter: (a, b) => this.compare(a.status, b.status),
			sortDirection: ['ascend', 'descend'],
			width: '5%',
			setFilter: true
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			sorter: (a, b) => this.compare(a.createdAt, b.createdAt),
			sortDirection: ['ascend', 'descend'],
			defaultSortOrder: 'descend',
			width: '20%',
			setFilter: true
		},
		{
			title: 'Related Email',
			dataIndex: 'relatedEmail',
			key: 'relatedEmail',
			sorter: (a, b) => this.compare(a.relatedEmail, b.relatedEmail),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: true
		},
		{
			title: 'Related Account',
			dataIndex: 'relatedAccount',
			key: 'relatedAccount',
			sorter: (a, b) => this.compare(a.relatedAccount, b.relatedAccount),
			sortDirection: ['ascend', 'descend'],
			width: '20%',
			setFilter: true
		},
	];

	// define form items for TableDrawer
	formItems = [
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
					autoSize={{ minRows: 4, maxRows: 8 }}
					maxLength={255}
					allowClear
					disabled={ disabled }
				/>
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

	// refresh table
	refreshTable = () => this.setState({ tableWrapperKey: Date.now() });

	render(){
		return (
			<div className='Case'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					// data props
					data={ this.props.data }
					dataEmail={ this.props.dataEmail }
					dataAccount={ this.props.dataAccount }
					email={ this.props.email }
					// display props
					loading={ this.props.loading }
					tableHeader={ this.tableHeader }
					columns={ this.columns }
					formItems={ this.formItems }
					isSmall={ this.props.isSmall }
					showHeader={ this.props.showHeader }
					showDropdown={ this.props.showDropdown }
					drawerTitle='Create a new case'
					// api props
					create={ this.props.create }
					edit={ this.props.edit }
					delete={ this.props.delete }
					refreshTable={ this.refreshTable }
					onClickBan={ this.props.onClickBan }
					onClickUnban={ this.props.onClickUnban }
				>
				</TableWrapper>
			</div>
		);
	}
}

export default Case;
