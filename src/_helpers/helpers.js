export const helpers = {
    compare,
    getCurrentDatetime,
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
