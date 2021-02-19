import React, { Component } from 'react';

// import styling from ant desgin
import { 
	Col,
	Dropdown,
	Menu,
	Row, 
	Space, 
	message, 
} from 'antd';
import { FileTextOutlined, EditOutlined } from '@ant-design/icons';

// import shared components
import { TableBody } from '_components'
import { TableDropdown } from './TableDropdown'
import { TableDrawer } from '_components'
import { TablePagination } from '_components'
import { RefineModal } from './RefineModal/RefineModal'
import { PredictModal } from './PredictModal'

class TableWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedRowKeys: [], // for selecting rows in TableBody
			tableDrawerKey: Date.now(), // for refreshing the TableDrawer
			visible: false, // for opening or closing the TableDrawer
			record: {}, // for loading a record into the form in TableDrawer
			disabled: false, // for disabling the input fields in TableDrawer
			// for the refine modal
			visibleRefine: false,
			modalKeyRefine: Date.now(),
			// for the predict modal
			visiblePredict: false,
			modalKeyPredict: Date.now(),
		};
	}
	
	// customised menu for more actions
	getMenu = record => (
		<Menu >
			<Menu.Item 
				key='1' 
				style={{ color:'#5a9ef8' }} 
				icon={ <EditOutlined /> }
				onClick={ this.handleClickEdit.bind(this, record) }
			>
				Edit
			</Menu.Item>
		</Menu>
	);
	
	// define columns in TableBody
	columns = this.props.noAction ? [...this.props.columns] : [
		...this.props.columns,
		{
			title: 'Actions',
			key: 'action',
			render: (text, record) => (
				<Space size='small'>
					<Dropdown.Button 
						type='link' 
						overlay={ this.getMenu(record) }
						onClick={ this.handleClickView.bind(this, record) }
					>
						{ <div><FileTextOutlined />  View</div> }
					</Dropdown.Button>
				</Space>
			),
			width: '15%',
			setFilter: false
		},
	];

	// handlers for actions in TableBody
	handleClickView = record => {
		this.setState({
			visible: true, 
			disabled: true,
			record,
		});
	}

	handleClickEdit = record => {
		this.setState({
			visible: true, 
			disabled: false,
			record,
		});
	}

	// handlers for actions in TableDropdown
	handleClickRefine = event => {
		this.setState({
			visibleRefine: true,
		});
	}

	handleClickPredict = event => {
		this.setState({
			visiblePredict: true,
		});
	}

	handleClickRefreshTable = () => {
		this.props.refreshTable();
		message.info('the table has been refreshed');
	}

	// handlers for actions in TableDrawer
  handleClose = () => {
    this.setState({
      visible: false,
			record: {},
			tableDrawerKey: Date.now(),
    });
  };

	handleSubmit = record => {
		this.props.edit(this.state.record.id, record);

		this.setState({
			record: {},
			visible: false,
			tableDrawerKey: Date.now(),
		});
	}

	// handlers for RefineModal
	handleCloseRefine = event => {
		this.setState({
			visibleRefine: false,
			modalKeyRefine: Date.now(),
		});
	}

	// handlers for PredictModal
	handleClosePredict = event => {
		this.setState({
			visiblePredict: false,
			modalKeyPredict: Date.now(),
		});
	}
	render(){
		return (
			<div className='TableWrapper'>
				<Row style={{ margin: this.props.isSmall ? "8px" : "16px" }}>
					<Col 
						style={{ 
							fontSize: this.props.isSmall ? 
							'20px' : '24px', textAlign: 'left' 
						}}
						span={ 12 } 
					>
						<Space size="large">
							{ this.props.tableHeader }
						</Space>
					</Col>
					<Col 
						style={{ 
							fontSize: this.props.isSmall ? 
							'20px' : '24px', textAlign: 'right' 
						}}
						span={ 12 } 
					>
						{ this.props.showDropdown === false ? (<></>) : (<>
								<TableDropdown 
									dropdownName={ this.props.dropdownName }
									onClickRefine={ this.handleClickRefine }
									onClickPredict={ this.handleClickPredict }
									onClickRefreshTable={ this.handleClickRefreshTable }
								/>
							</>)
						}
					</Col>
				</Row>
				<div>
					{ this.props.extraRow }
				</div>
				<div>
					<TableBody 
						data={ this.props.data } 
						columns={ this.columns } 
						selectedRowKeys={ this.props.noBatch ? 
							null : this.state.selectedRowKeys 
						}
						onSelectChange={ this.handleSelectChange }
						isSmall={ this.props.isSmall }
						showHeader={ this.props.showHeader }
						loading={ this.props.loading }
						pagination={ this.props.pagination }
						scroll={ this.props.scroll }
					/>
				</div>
				<div style={ {textAlign: 'right'} }>
					{ this.props.pagination === false ? 
						<TablePagination 
							rowCount={ this.props.rowCount }
							defaultPageSize={ this.props.defaultPageSize }
							defaultPage={ this.props.defaultPage }
							list={ this.props.list }
							filters={ this.props.filters }
						/> 
						: <></> 
					}
				</div>
				{ this.props.formItems ? 
							<div>
								<TableDrawer 
									tableDrawerKey={ this.state.tableDrawerKey }
									visible={ this.state.visible } 
									onClose={ this.handleClose }
									record={ this.state.record }
									formItems={ this.props.formItems }
									disabled={ this.state.disabled } 
									onSubmit={ this.handleSubmit }
									drawerWidth={ this.props.drawerWidth }
									drawerTitle={ this.props.drawerTitle }
									formLayout={ this.props.formLayout }
								/>
							</div>
						:
							<></>
				}
				<div>
					<RefineModal
						modalKey={ this.state.modalKeyRefine }
						visible={ this.state.visibleRefine }
						onCancel={ this.handleCloseRefine }
					>
					</RefineModal>
				</div>
				<div>
					<PredictModal
						modalKey={ this.state.modalKeyPredict }
						predictions={ this.props.predictions }
						visible={ this.state.visiblePredict }
						predict={ this.props.predict }
						onCancel={ this.handleClosePredict }
					>
					</PredictModal>
				</div>
			</div>
		);
	}
}

export { TableWrapper };
