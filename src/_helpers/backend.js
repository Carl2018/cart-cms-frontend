// import components from ant design
import { message } from 'antd';

export const backend = {
    createSync,
    listSync,
    updateSync,
    hideSync,
};

// sync version
// interface for create sync
async function createSync(config, record) {
	const { service, create, retrieve, dataName } = config;
	// insert the record into the backend table
	let response = null;
	await service[create](record)
		.then( result => response = result )
		.catch( error => response = error );
	// update the frontend data accordingly
	if (response.code === 200){
		let data = this.state[dataName].slice();
		let entry = {};
		await service[retrieve]({id: response.entry.id})
			.then( result => entry = result.entry )
			.catch( error => entry = error );
		data = [ entry, ...data ];
		this.setState({ [dataName]: data });
		message.success('A record has been created');
	} else {
		message.error(response.en);
	}
	return response; // for process drawer
}
// interface for list sync
async function listSync(config, params) {
	const { service, list, dataName } = config;
	await service[list](params)
		.then( ({ entry: data }) => 
			this.setState({ [dataName]: data }, () => {return;} ) 
		);
}
// interface for update sync
async function updateSync(config, id, record) {
	const { service, update, retrieve, dataName, editSuccessMsg } = config;
	// update the record in the backend table
	let response = null;
	await service[update]({ id, ...record })
		.then( result => response = result )
		.catch( error => response = error );
	// update the frontend data accordingly
	if (response.code === 200){
		let data = this.state[dataName].slice();
		const index = data.findIndex( item => item.id === id);
		let entry = {};
		await service[retrieve]({id})
			.then( result => entry = result.entry )
			.catch( error => entry = error );
		// data[index] = entry;
		data = [ entry, ...data.slice(0,index), ...data.slice(index+1) ];
		this.setState({ [dataName]: data });
		if (editSuccessMsg)
			message.success(editSuccessMsg);
		else
			message.success('The record has been edited');
		return response.entry; // for merge
	} else {
		message.error(response.en);
	}
}
// interface for hide sync
async function hideSync(config, ids) {
	const { service, hide, dataName } = config;
	// convert to array if ids is a string
	ids = Array.isArray(ids) ? ids : [ ids ];

	// hide the record in the backend table
	let response = null;
	await service[hide](ids)
		.then( result => response = result )
		.catch( error => { response = error; console.log(error) } );
	// hide the frontend data accordingly
	if (response.code === 200){
		let data = this.state[dataName].slice(); 
		data = data.filter( item => !ids.includes(item.id) );
		this.setState({ [dataName]: data });
		message.success('The records have been deleted');
	} else {
			message.error(response.en);
		}
}
