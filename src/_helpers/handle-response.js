import { authenticationService } from '_services';

export function handleResponse(response) {
    return response.text().then(text => {
				let data = null
				try {
					data = text && JSON.parse(text);
				} catch {
					data = text;
				}
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                authenticationService.logout();
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
