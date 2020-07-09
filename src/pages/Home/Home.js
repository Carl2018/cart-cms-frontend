import React from 'react';

import { authenticationService } from '../../_services/authentication.service';
import { userService } from '../../_services/user.service';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            users: null
        };
    }

    componentDidMount() {
        userService.getAll().then(users => this.setState({ users }));
    }

    render() {
        const { currentUser } = this.state;
        return (
            <div>
                <h1>Hi {currentUser.firstName}!</h1>
                <p>Use the sidebar to navigate</p>
            </div>
        );
    }
}

export default Home;
