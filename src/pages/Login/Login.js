import React from 'react';

import { 
	Button, 
	Col, 
	Checkbox,
	Form, 
	Input, 
	Row, 
} from 'antd';

import { authenticationService } from '../../_services/authentication.service';

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
								<Row>
									<Col
										span={ 8 }
										offset={ 8 }
									>
										<div
											style={{ 
												textAlign: "center",
												marginTop: "100px",
												marginBottom: "50px",
											}}
										>
											<h2>Heymandi CMS</h2>
										</div>
									</Col>
								</Row>
								<Row>
									<Col
										span={ 8 }
										offset={ 8 }
									>
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
									</Col>
								</Row>
            </div>
        )
    }
}

export default Login; 
