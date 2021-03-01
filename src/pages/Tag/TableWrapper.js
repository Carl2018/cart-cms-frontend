import React, { Component } from 'react';

// import styling from ant desgin
import { Space, Button, Popconfirm, Row, Col,Select } from 'antd';
import { message, notification, Radio } from 'antd';
import { FileTextOutlined, EditOutlined } from '@ant-design/icons';

// import shared and child components
import { TableBody } from '_components'
import { TableDropdown } from './TableDropdown'
import { TableDrawer } from '_components'
import { TablePagination } from '_components'
const { Option } = Select

class TableWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedRowKeys: [], // for selecting rows in TableBody
			tableDrawerKey: Date.now(), // for refreshing the TableDrawer
			visible: false, // for opening or closing the TableDrawer
			record: {}, // for loading a record into the form in TableDrawer
            disabled: false, // for disabling the input fields in TableDrawer
            bannedOptions : [
                { label: 'ON', value: 'ON' },
                { label: 'OFF', value: 'OFF' },
                { label: 'ALL', value: 'ALL' },
            ]
		};
	}
	
	// define columns in TableBody
	columns = this.props.noAction ? [...this.props.columns] : [
		...this.props.columns,
		{
			title: 'Actions',
			key: 'action',
			render: (text, record) => (
				<Space size='small'>
					<Button 
						type='link' 
						icon={ <FileTextOutlined /> }
						onClick={ this.handleClickView.bind(this, record) }
					>
						View
					</Button>
					<Button 
						type='link' 
						icon={ <EditOutlined /> }
						onClick={ this.handleClickEdit.bind(this, record) }
					>
						Edit
					</Button>
					{/* <Button 
						type='link' 
						danger 
                        icon={ <DeleteOutlined /> }
                        disabled
					>
						Delete
					</Button> */}
				</Space>
			),
			width: '25%',
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

	handleClickDelete = record => this.props.delete(record.id);

	handleSelectChange = selectedRowKeys => this.setState({ selectedRowKeys });

	// handlers for actions in TableDropdown
  handleClickAdd = event => {
    this.setState({
      visible: true,
			disabled: false,
			record: {},
    });
  };

	handleClickRefreshTable = () => {
		this.props.refreshTable();
		message.info('the table has been refreshed');
	}

	handleClickBatchDelete = () => {
		const key = `open${Date.now()}`;
		const btn = (
			<Button 
				type='primary' 
				size='small' 
				onClick={ this.handleClickConfirm.bind(this, notification.close, key) }
			>
				Confirm
			</Button>
		);
		notification.open({
			message: 'About to delete multiple records',
			description:
				'Are you sure to delete these records?',
			btn,
			key,
			duration: 0,
			onClose: () => message.info('batch delete has been canceled'),
		});
	};

  handleClickConfirm = (closeNotification, notificationKey) => {
		this.props.delete(this.state.selectedRowKeys);
		closeNotification(notificationKey);
  };

	// handlers for actions in TableDrawer
  handleClose = () => {
    this.setState({
      visible: false,
			record: {},
			tableDrawerKey: Date.now(),
    });
  };

	handleSubmit = record => {
		if (this.state.record.id) // edit the entry
			this.props.edit(this.state.record.id, record);
		else // create an entry
			this.props.create(record);

		this.setState({
			record: {},
			visible: false,
			tableDrawerKey: Date.now(),
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
									onClickAdd={ this.handleClickAdd }
									// onClickRefreshTable={ this.handleClickRefreshTable }
									// onClickBatchDelete={ this.handleClickBatchDelete }
								/>
							</>)
						}
					</Col>
				</Row>
				<div>
					{ this.props.extraRow }
				</div>
                <div
                
                >
                    <Row gutter={16}
                    style={ 
                        {
                          textAlign: 'left',
                          margin: "90px 0px 30px 0px"
                        } 
                      } 
                    >
                        <Col span={4}>
                            { "Region: " }
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '70%' }}
                                placeholder="Please select"
                            >
                                {[
                                    <Option key={"HK"}>{"HK"}</Option>,
                                    <Option key={"TW"}>{"TW"}</Option>,
                                    <Option key={"MY"}>{"MY"}</Option>,
                                    <Option key={"CA"}>{"CA"}</Option>,

                                ]}
                            </Select>
                        </Col>
                        <Col span={3}>
                            { "Is Banned: " }
                            <Radio.Group
                                options={this.state.bannedOptions}
                                // onChange={this.onChange4}
                                // value={value4}
                                optionType="button"
                                buttonStyle="solid"
                                defaultValue="ALL"
                            />
                        </Col>
                        <Col span={3}>
                            { "Is Featured: " }
                            <Radio.Group
                                options={this.state.bannedOptions}
                                // onChange={this.onChange4}
                                // value={value4}
                                optionType="button"
                                buttonStyle="solid"
                                defaultValue="ALL"
                            />
                        </Col>
                    </Row>
                </div>
				<div>
					<TableBody 
						data={ this.props.data } 
						columns={ this.columns } 
						// selectedRowKeys={ this.props.noBatch ? 
						// 	null : this.state.selectedRowKeys 
						// }
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
			</div>
		);
	}
}

export { TableWrapper };
