// import components from ant design
import { message } from 'antd';

// import helpers
import { helpers } from './helpers';

// destructure imported components and objects
const { getCurrentDatetime } = helpers;

export const backend = {
    create,
    list,
    listCombined,
    listFiltered,
    listByEmail,
    update,
    bind,
    ban,
    hide,
};

// create apis
// interface for create
async function create(service, objectName, record) {
	// insert the record into the backend table
	let response = null;
	await service.create(record)
		.then( result => response = result )
		.catch( error => response = error );
	// update the frontend data accordingly
	if (response.code === 200){
		const data = this.state[objectName].slice();
		record.id = response.entry.id;
		record.created_at = getCurrentDatetime();
		record.updated_at = getCurrentDatetime();
		data.push(record);
		this.setState({ [objectName]: data });
		message.success('A record has been created');
	} else {
		message.error(response.en);
	}
}

// list apis
// interface for list
async function list(service, objectName) {
	service.list()
		.then( ({ entry: data }) => this.setState({ [objectName]: data }) );
}
// interface for list with combined attributes
async function listCombined(service, objectName, keys) {
	service.list()
		.then( ({ entry: data }) => {
			const ids = data.map( item => item.id );
			ids.forEach( (item, index, array) => {
				const first = array.indexOf(item);
				if (first === index) {
					keys.forEach( key => data[index][key] = [ data[index][key] ] );
				} else {
					keys.forEach( key => data[first][key].push(data[index][key]) )
					data[index] = null;
				}
			});
			data = data.filter( item => item !== null )
			this.setState({ [objectName]: data });
		});
}
// interface for list with filter
async function listFiltered(service, objectName, filters) {
	service.list(filters)
		.then( ({ entry: data }) => this.setState({ [objectName]: data }) );
}
// interface for list by email
async function listByEmail(service, objectName, filters) {
	service.listByEmail(filters)
		.then( ({ entry: data }) => this.setState({ [objectName]: data }) );
}

// update apis
// interface for update
async function update(service, objectName, id, record) {
	// update the record in the backend table
	let response = null;
	await service.update({ id, ...record })
		.then( result => response = result )
		.catch( error => response = error );
	// update the frontend data accordingly
	if (response.code === 200){
		let data = this.state[objectName].slice();
		let index = data.findIndex( item => item.id === id);
		Object.keys(record).forEach(item => data[index][item] = record[item])
		this.setState({ [objectName]: data });
		message.success('The record has been edited');
	} else {
		message.error(response.en);
	}
}
// interface for bind
async function bind(service, objectName, id, record) {
	// update the record in the backend table
	let response = null;
	await service.bind({ id, ...record })
		.then( result => response = result )
		.catch( error => response = error );
	// update the frontend data accordingly
	if (response.code === 200){
		let data = this.state[objectName].slice();
		let index = data.findIndex( item => item.id === id);
		Object.keys(record).forEach(item => data[index][item] = record[item])
		this.setState({ [objectName]: data });
		message.success('The case has been bound to an account');
	} else {
		message.error(response.en);
	}
}
// interface for ban
async function ban(service, objectName, record) {
		console.log(record);
	// update the record in the backend table
	let response = null;
	await service.ban( record )
		.then( result => response = result )
		.catch( error => response = error );
	// update the frontend data accordingly
	if (response.code === 200){
		const toggle = { u: 'b', b: 'u' };
		let data = this.state[objectName].slice();
		let index = data.findIndex( item => item.id === record.id);
		data[index].status = toggle[data[index].status];
		this.setState({ [objectName]: data });
		data[index].status === 'u' ?
			message.success('The account has been unbanned') :
			message.success('The account has been banned');
	} else {
		message.error(response.en);
	}
}

// hide apis
// interface for hide
async function hide(service, objectName, ids) {
	// convert to array if ids is a string
	ids = Array.isArray(ids) ? ids : [ ids ];

	// hide the record in the backend table
	let response = null;
	await service.hide(ids)
		.then( result => response = result )
		.catch( error => { response = error; console.log(error) } );
	// hide the frontend data accordingly
	if (response.code === 200){
		let data = this.state.data.slice(); 
		data = data.filter( item => !ids.includes(item.id) );
		message.success('The records have been deleted');
		this.setState({ [objectName]: data });
	} else {
			message.error(response.en);
		}
}
