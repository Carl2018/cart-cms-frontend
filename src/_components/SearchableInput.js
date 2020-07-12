import React, { Component } from 'react';

import { AutoComplete, Input } from 'antd';

const { Search } = Input;

class SearchableInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allOptions: [],
			options: [],
			searchProperty : "",
		};
		
	}
	
	static getDerivedStateFromProps(nextProps, prevState) {
		return { 
			allOptions: nextProps.allOptions,
			searchProperty: nextProps.searchProperty,
		};
	}
	
	handleChange = data => {
		const options = this.state.allOptions
		.map( item => item[this.state.searchProperty] )
		.filter( item => item.includes(data) )
		.map( entry => ({ value:entry }) )
		this.setState({ options });
	}

	render(){
		return (
			<div 
				className="SearchableInput"
			>
				<AutoComplete
					onChange={ this.handleChange }
					onSelect={ this.props.onSearch }
					options={ this.state.options }
					style={{ width: 320 }}
				>
					<Search
						onSearch={ this.props.onSearch }
						placeholder={ this.props.placeholder || "Search Profile by Email" }
						size="middle"
						allowClear
					/>
				</AutoComplete>
			</div>
		);
	}
}

export { SearchableInput };
