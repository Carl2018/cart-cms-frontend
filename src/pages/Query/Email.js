import React, { Component } from 'react';

// import components from ant design
import { 
	Input, 
	Select,
	Tag, 
} from 'antd';
import { MailOutlined } from '@ant-design/icons';

// import shared and child components
import { TableWrapper } from '_components'

// destructure child components
const { Option } = Select;

class Email extends Component {
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
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			sorter: (a, b) => this.compare(a.email, b.email),
			sortDirection: ['ascend', 'descend'],
			width: '30%',
			setFilter: true
		},
		{
			title: 'Last Contacted At',
			dataIndex: 'updatedAt',
			key: 'updatedAt',
			sorter: (a, b) => this.compare(a.createdAt, b.createdAt),
			sortDirection: ['ascend', 'descend'],
			defaultSortOrder: 'descend',
			width: '40%',
			setFilter: true
		},
		{
			title: 'Labels',
			key: 'labels',
			dataIndex: 'labels',
			render: labels => !labels ? <></> : (
				<>
					{labels.map(tag => {
						let color = 'blue';
						switch (tag) {
							case 'burning' :
								color = 'magenta';
								break;
							case 'hot' :
								color = 'red';
								break;
							case 'temperate' :
								color = 'orange';
								break;
							case 'warm' :
								color = 'gold';
								break;
							case 'agreeable' :
								color = 'green';
								break;
							case 'cold' :
								color = 'blue';
								break;
							case 'icy' :
								color = 'geekblue';
								break;
							case 'freezing' :
								color = 'purple';
								break;
							default :
								color = 'lime';
								break;
						}
						return (
							<Tag color={color} key={tag}>
								{tag.toUpperCase()}
							</Tag>
						);
					})}
				</>
			),
			width: '20%',
		},
		{
			title: 'Created At',
			dataIndex: 'createdAt',
			key: 'createdAt',
			sorter: (a, b) => this.compare(a.createdAt, b.createdAt),
			sortDirection: ['ascend', 'descend'],
			width: '40%',
			setFilter: true
		},
	];

	// define form items for TableDrawer
	formItems = [
		{
			label: 'Email',
			name: 'email',
			rules: [
				{
					required: true,
					message: 'email cannot be empty',
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
			label: 'Labels',
			name: 'labels',
			rules: [
				{
					required: true,
					message: 'labels cannot be empty',
				}
			],
			editable: true,
			input: disabled => (
				<Select
					mode='multiple'
					disabled={ disabled }
				>
					<Option value="burning">burning</Option>
					<Option value="hot">hot</Option>
					<Option value="temperate">temperate</Option>
					<Option value="warm">warm</Option>
					<Option value="agreeable">agreeable</Option>
					<Option value="cold">cold</Option>
					<Option value="icy">icy</Option>
					<Option value="freezing">freezing</Option>
				</Select>
			)
		},
		{
			label: 'Created at',
			name: 'createdAt',
			rules: [
				{
					required: true,
					message: 'createdAt cannot be empty',
				}
			],
			editable: false,
			input: disabled => (
				<Input
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
			<MailOutlined />
			<strong>Known Email Accounts</strong>
		</>
	)

	// refresh table
	refreshTable = () => this.setState({ tableWrapperKey: Date.now() });

	render(){
		return (
			<div className='Email'>
				<TableWrapper
					key={ this.state.tableWrapperKey }
					// data props
					data={ this.props.data }
					// display props
					loading={ this.props.loading }
					tableHeader={ this.tableHeader }
					columns={ this.columns }
					formItems={ this.formItems }
					isSmall={ this.props.isSmall }
					showHeader={ this.props.showHeader }
					showDropdown={ this.props.showDropdown }
					drawerTitle='Create a new email'
					// api props
					create={ this.props.create }
					edit={ this.props.edit }
					delete={ this.props.delete }
					refreshTable={ this.refreshTable }
				>
				</TableWrapper>
			</div>
		);
	}
}

export default Email;
