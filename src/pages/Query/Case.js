import React, { Component } from 'react';

// import styling from ant desgin
import { FileSearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

// import shared components
import TableWrapper from './TableWrapper'
import { success } from '../../_components/Message'

class Case extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableWrapperKey: Date.now(),
			// populate the table body with data
			data: [],
		};
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState({ data: nextProps.data });
	}

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

	// create api
  create = record => {
		const data = this.state.data.slice();
		record.key = Date.now();
		record.status = "pending";
		record.createdAt = new Date().toISOString().split('.')[0].replace('T', ' ');
		data.push(record);
		if (200) success('create_success');
		console.log(data);
		this.setState({ data });
	}

	// edit api
  edit = (key, record) => {
		let data = this.state.data.slice();

		let originalRecord = data.find( item => item.key === key);
		let index = data.findIndex( item => item.key === key);
		Object.keys(record).forEach(item => originalRecord[item] = record[item])
		console.log(originalRecord);
		data[index] = originalRecord;
		if (200) success('edit_success');
		this.setState({ data });
	}

	// delete api
  delete = keys => {
		let data = this.state.data.slice(); // do not mutate the data in state
		if (Array.isArray(keys)) {
			data = data.filter( 
				item => !keys.includes(item.key)
			);
			if (200) success('batch_delete_success');
		} else {
			data = data.filter( 
				item => item.key !== keys
			);
			if (200) success('delete_success');
		}
		this.setState({ data });
	}

	refreshTable = () => this.setState({ tableWrapperKey: Date.now() });
	render(){
		return (
			<div className='Case'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					data={ this.state.data }
					columns={ this.columns }
					formItems={ this.formItems }
					tableHeader={ this.tableHeader }
					drawerTitle='Create a new case'
					create={ this.create }
					edit={ this.edit }
					delete={ this.delete }
					refreshTable={ this.refreshTable }
					isSmall={ this.props.isSmall }
					dataEmail={ this.props.dataEmail }
					dataCase={ this.props.data }
					dataAccount={ this.props.dataAccount }
					email={ this.props.email }
					showHeader={ this.props.showHeader }
					loading={ this.props.loading }
				>
				</TableWrapper>
			</div>
		);
	}
}

export default Case;
