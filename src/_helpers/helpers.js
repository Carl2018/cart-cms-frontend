export const helpers = {
    compare,
    getCurrentDatetime,
		dynamicSort,
};

function compare(a, b) {
		if (a >  b) return 1;
		if (a ===  b) return 0;
		if (a <  b) return -1;
}

function getCurrentDatetime() {
	const today = new Date();
	const date = today.getFullYear()+'-'
		+padZero( today.getMonth()+1 )+'-'
		+padZero( today.getDate() );
	const time = padZero( today.getHours() ) + ":" 
		+ padZero( today.getMinutes() ) + ":" 
		+ padZero( today.getSeconds() );
	return date+' '+time;
}

function padZero(string) {
	return ( '0' + string ).slice(-2);
}

function dynamicSort(property) {
		var sortOrder = 1;

		if(property[0] === "-") {
				sortOrder = -1;
				property = property.substr(1);
		}

		return function (a,b) {
				if (typeof a[property] === "string") {
					if(sortOrder === -1){
							return b[property].localeCompare(a[property]);
					}else{
							return a[property].localeCompare(b[property]);
					}        
				} else {
					if(sortOrder === -1){
							return a[property] - b[property];
					}else{
							return b[property] - a[property];
					}        
				}
		}
}
