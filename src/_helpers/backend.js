// import components from ant design
import { message } from 'antd';

export const backend = {
	createSync,
	retrieveSync,
	listSync,
	updateSync,
	hideSync,
	uploadSync
};

// sync version
// interface for create sync
async function createSync(config, record) {
	this.setState({ spinning: true });
	const { service, create, retrieve, dataName, pageName } = config;
	// insert the record into the backend table
	let response = null;
	// strip spaces
	for (let key in record) 
		record[key] = typeof record[key] === 'string' ? 
			record[key].trim() : record[key];
	await service[create]({...record, pagename: pageName})
		.then( result => response = result )
		.catch( error => response = error );
	// update the frontend data accordingly
	if (response.skip) {
			this.setState({ spinning: false });
			return response; // for process drawer
		}
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
	this.setState({ spinning: false });
	return response; // for process drawer
}
// interface for retrieve sync
async function retrieveSync(config, params) {
	const { service, retrieve } = config;
	let response = null;
	await service[retrieve](params)
		.then( result => response = result )
		.catch( error => response = error );
	return response;
}
// interface for list sync
async function listSync(config, params) {
	this.setState({ spinning: true });
	const { service, list, dataName } = config;
	let response = null;
	await service[list](params)
		.then( result => {
			response = result;
			this.setState({ [dataName]: result.entry });
		})
		.catch( error => response = error );
	this.setState({ spinning: false });
	return new Promise(function(resolve, reject){
		resolve(response);
	});
}
// interface for update sync
async function updateSync(config, id, record, updateFrontend=true) {
	this.setState({ spinning: true });
	const { service, update, retrieve, dataName, pageName, editSuccessMsg } = config;
	// update the record in the backend table
	let response = null;
	// strip spaces
	for (let key in record) 
		record[key] = typeof record[key] === 'string' ? 
			record[key].trim() : record[key];
	await service[update]({ id, ...record, pagename: pageName })
		.then( result => response = result )
		.catch( error => response = error );
	// update the frontend data accordingly
	if (response.code === 200){
		if (updateFrontend) {
			let data = this.state[dataName].slice();
			const index = data.findIndex( item => item.id === id);
			let entry = {};
			await service[retrieve]({id})
				.then( result => entry = result.entry )
				.catch( error => entry = error );
			// data[index] = entry;
			if (entry)
				data = [ entry, ...data.slice(0,index), ...data.slice(index+1) ];
			else
				data = [ ...data.slice(0,index), ...data.slice(index+1) ];
			this.setState({ [dataName]: data });
			if (editSuccessMsg)
				message.success(editSuccessMsg);
			else
				message.success('The record has been edited');
			this.setState({ spinning: false });
			return response.entry; // for merge
		} else {
			this.setState({ spinning: false });
			return new Promise(function(resolve, reject){
				resolve(response);
			});
		}
	} else {
		message.error(response.en);
	this.setState({ spinning: false });
	}
}
// interface for hide sync
async function hideSync(config, ids) {
	this.setState({ spinning: true });
	const { service, hide, dataName, pageName } = config;
	// convert to array if ids is a string
	ids = Array.isArray(ids) ? ids : [ ids ];

	// hide the record in the backend table
	let response = null;
	await service[hide]({ids, pagename: pageName})
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
	this.setState({ spinning: false });
}

// interface for upload sync
async function uploadSync(config, file) {
	const { service, upload } = config;
	// insert the file into the backend table
	let response = null;
	await service[upload]({ file: file})
		.then( result => response = result )
		.catch( error => response = error );
	// update the frontend data accordingly
	if (response.code === 200){
		message.success('A record has been created');
	} else {
		message.error(response.en);
	}
	return response; // for process drawer
}