import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';

// import customized component
import Query from './pages/Query/Query';
import Case from './pages/Case/Case';
import Account from './pages/Account/Account';
import Email from './pages/Email/Email';
import Label from './pages/Label/Label';
import Template from './pages/Template/Template';
import Category from './pages/Category/Category';

import { history } from './_helpers/history';
import { authenticationService } from './_services/authentication.service';
import { PrivateRoute } from './_components/PrivateRoute';
import { HomePage } from './HomePage/HomePage';
import { LoginPage } from './LoginPage/LoginPage';

// import styling from ant design
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  QuestionCircleOutlined,
  FileSearchOutlined,
  TeamOutlined,
  MailOutlined,
  TagOutlined,
  CopyOutlined,
  HddOutlined,
} from '@ant-design/icons';

const { Header, Sider, Footer, Content } = Layout;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser: null,
			collapsed: true,
		};
	}
	
	componentDidMount() {
			authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
	}

	logout() {
			authenticationService.logout();
			history.push('/login');
	}

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

	render(){
		const { currentUser } = this.state;
		return (
			<div className="App">
				<Router history={history}>
					<Layout>
						<Sider 
							trigger={null} 
							collapsible 
							collapsed={this.state.collapsed}
						>
							<div className="logo" />
							<Menu 
								theme="dark" 
								mode="inline" 
							>
								<Menu.Item 
									key="1" 
									icon={<QuestionCircleOutlined />}
								>
									<Link to="/query">
										Queries
									</Link>
								</Menu.Item>
								<Menu.Item 
									key="2" 
									icon={<FileSearchOutlined />}
								>
									<Link to="/case">
										Cases
									</Link>
								</Menu.Item>
								<Menu.Item 
									key="3" 
									icon={<TeamOutlined />}
								>
									<Link to="/account">
										Accounts
									</Link>
								</Menu.Item>
								<Menu.Item 
									key="4" 
									icon={<MailOutlined />}
								>
									<Link to="/email">
										Emails
									</Link>
								</Menu.Item>
								<Menu.Item 
									key="5" 
									icon={<TagOutlined />}
								>
									<Link to="/label">
										Labels
									</Link>
								</Menu.Item>
								<Menu.Item 
									key="6" 
									icon={<CopyOutlined />}
								>
									<Link to="/template">
										Templates
									</Link>
								</Menu.Item>
								<Menu.Item 
									key="7" 
									icon={<HddOutlined />}
								>
									<Link to="/category">
										Categories
									</Link>
								</Menu.Item>
							</Menu>
						</Sider>
						<Layout className="site-layout">
							<Header 
								className="site-layout-background" 
								style={{ padding: 0 }}
							>
								{ React.createElement(
									this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, 
									{
										className: 'trigger',
										onClick: this.toggle,
									}
								) }
							</Header>
							<Content
								className="site-layout-background"
								style={{
									margin: '24px 16px',
									padding: 24,
									minHeight: 540,
								}}
							>
									<div>{ currentUser }</div>
									<PrivateRoute exact path="/" component={HomePage} />
									<Route path="/login" component={LoginPage} />
									<Route path="/query" component={ Query }/>
									<Route path="/case" component={ Case }/>
									<Route path="/account" component={ Account }/>
									<Route path="/email" component={ Email }/>
									<Route path="/label" component={ Label }/>
									<Route path="/template" component={ Template }/>
									<Route path="/category" component={ Category }/>
							</Content>
							<Footer style={{textAlign: "center", color:"#a1a1a1"}}>
								Copyright &copy; {new Date().getFullYear()} Heymandi 
								All rights reserved.
							</Footer>
						</Layout>
					</Layout>
				</Router>
			</div>
		);
	}
}

export default App;
