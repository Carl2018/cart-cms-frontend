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
			in_region: 1,
			in_is_banned: 1,
			in_is_featured:1,
			in_is_active:1,
			in_order_by_column:'count',
			in_order_by_order:'asc',
            bannedOptions : [
                { label: 'ON', value: 1 },
                { label: 'OFF', value: 0 },
                { label: 'ALL', value: '' },
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
    handleRegionChange = value => {
        this.setState({
            in_region: value
        });
        let filter = {
            in_region: value,
            in_is_banned: this.state.in_is_banned,
            in_is_featured:this.state.in_is_featured,
            in_is_active:this.state.in_is_active,
            in_order_by_column:this.state.in_order_by_column,
            in_order_by_order:this.state.in_order_by_order
        }
        this.props.list(filter)
    }
    handleBannedChange = value => {
		this.setState({
			in_is_banned: value.target.value
		});
		let filter = {
			in_is_banned: value.target.value,
			in_region: this.state.in_region,
			in_is_featured:this.state.in_is_featured,
			in_is_active:this.state.in_is_active,
			in_order_by_column:this.state.in_order_by_column,
			in_order_by_order:this.state.in_order_by_order
		}
		this.props.list(filter)
	}

    handleFeaturedChange = value => {
		this.setState({
			in_is_featured: value.target.value
		});
		let filter = {
			in_is_featured: value.target.value,
			in_region: this.state.in_region,
			in_is_banned:this.state.in_is_banned,
			in_is_active:this.state.in_is_active,
			in_order_by_column:this.state.in_order_by_column,
			in_order_by_order:this.state.in_order_by_order
		}
		this.props.list(filter)
	}

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
                        <Col xs={{span:6}} lg={{span:6}} xl={{span:5}} xl={{span:4}}  xxl={{span:3}}>
                            { "Region: " }
                            <Select
                                mode="single"
                                allowClear
                                style={{ width: '50%' }}
								placeholder="Select"
								size="small"
                                onChange={this.handleRegionChange}
                            >
                                {[
                                    <Option key={1}>{"HK"}</Option>,
                                    <Option key={2}>{"TW"}</Option>,
                                    <Option key={3}>{"MY"}</Option>,
                                    <Option key={4}>{"CA"}</Option>,
                                ]}
                            </Select>
                        </Col>
                        <Col xs={{span:9}} lg={{span:7}} xl={{span:6}} xl={{span:6}} xxl={{span:4}}> 
                            { "Is Banned: " }
                            <Radio.Group
                                options={this.state.bannedOptions}
                                onChange={this.handleBannedChange}
                                optionType="button"
                                buttonStyle="solid"
								defaultValue="ALL"
								size="small"
                            />
                        </Col>
                        <Col xs={{span:9}} lg={{span:7}} xl={{span:6}} xl={{span:6}} xxl={{span:4}}>
                            { "Is Featured: " }
                            <Radio.Group
                                options={this.state.bannedOptions}
                                onChange={this.handleFeaturedChange}
                                optionType="button"
                                buttonStyle="solid"
								defaultValue="ALL"
								size="small"
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
