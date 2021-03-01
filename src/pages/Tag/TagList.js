import React, { Component } from 'react';

// import components from ant design
// import shared and child components
// import services
// import helpers
// destructure imported components and objects

class TagList extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	componentDidMount() {
		this.setState({ spinning: true }, async () => {
		});
    }
    render(){
        return (
            <div> This is tag list</div>
        );
    }
}

export { TagList };
