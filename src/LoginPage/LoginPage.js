import React from 'react';

import { Form, Input, Button, Checkbox } from 'antd';

import { authenticationService } from '../_services/authentication.service';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        // redirect to home if already logged in
        if (authenticationService.currentUserValue) { 
            this.props.history.push('/');
        }
    }

		layout = {
			labelCol: {
				span: 8,
			},
			wrapperCol: {
				span: 16,
			},
		};
		tailLayout = {
			wrapperCol: {
				offset: 8,
				span: 16,
			},
		};

		onFinish = ({ username, password }) => {
				authenticationService.login(username, password)
						.then(
								user => {
										const { from } = this.props.location.state || { from: { pathname: "/" } };
										this.props.history.push(from);
								},
								error => console.log(error)
						);
		}

		onFinishFailed = errorInfo => {
			console.log('Failed:', errorInfo);
		};

    render() {
        return (
            <div>
                <div className="alert alert-info">
                    Username: test<br />
                    Password: test
                </div>
                <h2>Login</h2>
								<Form
									{...this.layout}
									name="basic"
									initialValues={{
										remember: true,
									}}
									onFinish={this.onFinish}
									onFinishFailed={this.onFinishFailed}
								>
									<Form.Item
										label="Username"
										name="username"
										rules={[
											{
												required: true,
												message: 'Please input your username!',
											},
										]}
									>
										<Input />
									</Form.Item>

									<Form.Item
										label="Password"
										name="password"
										rules={[
											{
												required: true,
												message: 'Please input your password!',
											},
										]}
									>
										<Input.Password />
									</Form.Item>

									<Form.Item {...this.tailLayout} name="remember" valuePropName="checked">
										<Checkbox>Remember me</Checkbox>
									</Form.Item>

									<Form.Item {...this.tailLayout}>
										<Button type="primary" htmlType="submit">
											Submit
										</Button>
									</Form.Item>
								</Form>
            </div>
        )
    }
}

export { LoginPage }; 
