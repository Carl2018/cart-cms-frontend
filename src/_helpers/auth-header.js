import { authenticationService } from '_services';

export function authHeader() {
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return { 
					'Authorization': `Bearer ${currentUser.token}`,
					'Content-Type': 'application/json'
				};
    } else {
        return {};
    }
}

export function mlAuthHeader() {
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.mlToken) {
        return { 
					'Authorization': `Token ${currentUser.mlToken}`,
					'Content-Type': 'application/json'
				};
    } else {
        return {};
    }
}

export function authHeaderWithoutContentType() {
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return { 
					'Authorization': `Bearer ${currentUser.token}`,
				};
    } else {
        return {};
    }
}
