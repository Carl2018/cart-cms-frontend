// import components from ant design
import { message } from 'antd';

export const backend = {
    create,
    list,
    update,
    hide,
};

// create api
async function create(service, record) {
	// insert the record into the backend table
	let response = null;
	await service.create(record)
		.then( result => response = result )
		.catch( error => response = error );
	// update the frontend data accordingly
	if (response.code === 200){
		const data = this.state.data.slice();
		record.id = response.entry.id;
		data.push(record);
		this.setState({ data });
		message.success('A record has been created');
	} else {
		message.error(response.en);
	}
}

// list api
async function list(service) {
	service.list()
		.then( ({ entry: data }) => this.setState({ data }) );
}

// update api
async function update(service, id, record) {
	// update the record in the backend table
	let response = null;
	await service.update({ id, ...record })
		.then( result => response = result )
		.catch( error => response = error );
	// update the frontend data accordingly
	if (response.code === 200){
		let data = this.state.data.slice();
		let index = data.findIndex( item => item.id === id);
		Object.keys(record).forEach(item => data[index][item] = record[item])
		this.setState({ data });
		message.success('The record has been edited');
	} else {
		message.error(response.en);
	}
}

// hide api
async function hide(service, ids) {
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
		this.setState({ data });
	} else {
			message.error(response.en);
		}
}
