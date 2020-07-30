import React from 'react';

import { 
	Button, 
	Card, 
	Col, 
	Form, 
	Input, 
	Row, 
	message, 
} from 'antd';

import { authenticationService } from '_services';

class Login extends React.Component {
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
				authenticationService.signin(username, password)
						.then(
								user => {
										const { from } = this.props.location.state || { from: { pathname: "/" } };
										this.props.history.push(from);
								},
								error => message.error("Error: Invalid username or password")
						);
		}

		onFinishFailed = errorInfo => {
			console.log('Failed:', errorInfo);
		};

    render() {
        return (
            <div>
								<Row>
									<Col
										span={ 8 }
										offset={ 8 }
									>
										<Card
											style={{ 
												marginTop: "80px",
												padding: "40px 40px 40px 20px" 
											}}
										>
											<div
												style={{ 
													textAlign: "center",
													marginTop: "20px",
													marginBottom: "50px",
												}}
											>
												<h2>{"  Heymandi CMS"}</h2>
											</div>
											<Form
												{...this.layout}
												name="basic"
												onFinish={this.onFinish}
												onFinishFailed={this.onFinishFailed}
											>
												<Form.Item
													label="Username"
													name="username"
													rules={[
														{
															required: true,
															message: 'Username cannot be empty',
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
															message: 'Password cannot be empty',
														},
													]}
												>
													<Input.Password />
												</Form.Item>

												<Form.Item {...this.tailLayout}>
													<Button type="primary" htmlType="submit">
														Login
													</Button>
												</Form.Item>
											</Form>
										</Card>
									</Col>
								</Row>
            </div>
        )
    }
}

export { Login }; 
