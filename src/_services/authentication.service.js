import { BehaviorSubject } from 'rxjs';
import { config, ml } from 'config';

//import config from 'config';
import { handleResponse } from '_helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    signin,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function signin(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${config.apiUrl}/user/signin`, requestOptions)
        .then(handleResponse)
				.then( async user => {

						// get token to access ml instance
						// temp solution
						// should do it in backend
						const mlRequestOptions = {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ 
									username: 'cms@gmail.com', 
									password: 'xh4HLpScUKkDzJyv',
								})
						};

						await fetch(`${ml.domain}/api-token-auth/`, mlRequestOptions)
							.then( response => response.json() )
							.then( data => user.mlToken = data.token )
						console.log(user)

            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
