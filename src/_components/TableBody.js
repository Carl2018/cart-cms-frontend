import React, { Component } from 'react';

/*
		This component is a table
		It requires 4 props

		variable 'columns' for defining the columns
		variable 'data' for populating the table
		variable 'selectedRowKeys' for row selection
		function 'onSelectChange' for change the selectedRowKeys
*/

// import styling from ant design
import { Table, Input, AutoComplete, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

// import shared components

class TableBody extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchText: '', // for highlighting the searched text
			searchedColumn: '', // for highlighting the column
			AutoCompleteKey: Date.now(), // for refreshing the search field
		};
	}
	
	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ 
			setSelectedKeys, 
			selectedKeys, 
			confirm, 
			clearFilters 
		}) => (
			<div style={{ padding: 8 }} >
				<AutoComplete 
					key={ this.state.AutoCompleteKey }
					options={ this.props.data
						.map( item => item[dataIndex] )
						.filter( (item, index, array) => array.indexOf(item) === index )
						.map( entry => ({value:entry}) )
					} 
					onSelect={ data => setSelectedKeys(data ? [data] : []) }
					filterOption={ (inputValue, option) =>
						option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
					}
				>
					<Input
						ref={node => {
							this.searchInput = node;
						}}
						placeholder={ `Search ${dataIndex}` }
						value={ selectedKeys[0] }
						onChange={ e => setSelectedKeys(e.target.value ? [e.target.value] : []) }
						onPressEnter={ () => this.handleSearch(selectedKeys, confirm, dataIndex) }
						style={{ width: 188, marginBottom: 8, display: 'block' }}
					/>
				</AutoComplete>
				<div>
					<Space>
						<Button
							type='primary'
							onClick={ () => this.handleSearch(selectedKeys, confirm, dataIndex) }
							icon={ <SearchOutlined /> }
							size='small'
							style={{ width: 90 }}
						>
							Search
						</Button>
						<Button 
							onClick={ () => this.handleReset(clearFilters) } 
							size='small' 
							style={{ width: 90 }}
						>
							Reset
						</Button>
					</Space>
				</div>
			</div>
		),
		filterIcon: filtered => 
			<SearchOutlined 
				style={{ color: filtered ? '#1890ff' : undefined }} 
			/>,
		onFilter: (value, record) =>
			record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
		onFilterDropdownVisibleChange: visible => {
			if (visible) {
				setTimeout(() => this.searchInput.select());
			}
		},
		render: text =>
			this.state.searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={ [this.state.searchText] }
					autoEscape
					textToHighlight={ text.toString() }
				/>
			) : (
				text
			),
	});

	handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		this.setState(state => ({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		}));
	};

	handleReset = clearFilters => {
		clearFilters();
		this.setState({ 
			searchText: '', 
			AutoCompleteKey: Date.now(),
		});
	};

	
	render(){
		// columns and data
		const columns = this.props.columns.map( column => 
			column.setFilter ? 
			{ ...column, ...this.getColumnSearchProps(column.dataIndex) } :
			column 
		);
		const data = this.props.data;
		
		// row selection
		const { selectedRowKeys } = this.props;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.props.onSelectChange,
			hideDefaultSelections: true,
			selections: [
				Table.SELECTION_ALL,
				Table.SELECTION_INVERT,
			]
		};

		return (
			<div className='TableDropdown'>
				<Table 
					columns={ columns } 
					dataSource={ data } 
					rowSelection={ rowSelection } 
				/>
			</div>
		);
	}
}

export default TableBody;
