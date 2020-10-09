import React, { Component } from 'react';

// import styling from ant design
import { Pagination } from 'antd';

class TablePagination extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage: this.props.defaultPage,
			pageSize: this.props.defaultPageSize,
		};
	}

	// handler for page change and page size change
	handleChange = (current, pageSize) => {
		if (pageSize === this.state.pageSize ) {
			this.setState({ currentPage: current });
		} else { 
			current = 1;
			this.setState({ currentPage: current, pageSize });
		}
		const limit = pageSize;
		const offset = (current - 1) * pageSize;
		this.props.list({ limit, offset });
	}

	render(){
		return (
			<div className='TablePagination'>
				<Pagination
					current={ this.state.currentPage }
					pageSize={ this.state.pageSize }
					total={ this.props.rowCount }
					size={ "default" }
					style={{ marginTop: "20px" }}
					showSizeChanger={ true }
					pageSizeOptions={ [5, 10, 20, 50, 100] }
					showQuickJumper
					onShowSizeChange={ this.handleChange }
					onChange = { this.handleChange}
				/>
			</div>
		);
	}
}

export { TablePagination };