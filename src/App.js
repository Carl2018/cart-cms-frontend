import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import 'App.css';

// import customized component
import { 
	Login,
	Home,
	Query,
	Case,
	Account,
	Email,
	Profile,
	Label,
	Template,
	Category,
} from 'pages';

import { history } from '_helpers';
import { authenticationService } from '_services';
import { PrivateRoute } from '_components';

// import styling from ant design
import 'antd/dist/antd.css';
import { 
	Button,
	Col,
	Dropdown,
	Layout, 
	Menu,
	Row,
} from 'antd';
import {
  ContactsOutlined,
  CopyOutlined,
  FileSearchOutlined,
  HddOutlined,
  HomeOutlined,
  LogoutOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  TagOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Header, Sider, Footer, Content } = Layout;

const { Item } = Menu;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser: null,
			// for sidebar menu
			menuKey: Date.now(),
			collapsed: true,
		};
	}
	
	componentDidMount() {
			authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
	}

	// for profile menu
	menu = (
		<Menu>
			<Item 
				key='1' 
			>
				<Link to="/">
					<Button
					type="ghost"
					style={{ 
						border: "none",
						color:'#5a9ef8' 
					}} 
					icon={ <HomeOutlined /> }
					onClick={ this.handleClickHome.bind(this) }
					>
						Home
					</Button>
				</Link>
			</Item>
			<Item 
				key='2' 
			>
				<Link to="/">
					<Button
					type="ghost"
					style={{ 
						border: "none",
						color:'#ec5f5b'
					}} 
					icon={ <LogoutOutlined /> }
					onClick={ this.handleClickLogout }
					>
						Logout
					</Button>
				</Link>
			</Item>
		</Menu>
	);

	// home button handler
	handleClickHome() {
		history.push('/');
		this.setState({ menuKey: Date.now() }); // refresh menu
	}

	// logout button handler
	handleClickLogout() {
		authenticationService.logout();
		history.push('/login');
	}

	// toggle the sidebar
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
						{ currentUser &&
						<Sider 
							trigger={null} 
							collapsible 
							collapsed={this.state.collapsed}
						>
							<div className="logo" />
							<Menu 
								key={ this.state.menuKey }
								theme="dark" 
								mode="inline" 
							>
								<Item 
									key="0" 
									icon={<HomeOutlined />}
								>
									<Link to="/">
										Home
									</Link>
								</Item>
								<Item 
									key="1" 
									icon={<QuestionCircleOutlined />}
								>
									<Link to="/query">
										Queries
									</Link>
								</Item>
								<Item 
									key="2" 
									icon={<FileSearchOutlined />}
								>
									<Link to="/case">
										Cases
									</Link>
								</Item>
								<Item 
									key="3" 
									icon={<TeamOutlined />}
								>
									<Link to="/account">
										Accounts
									</Link>
								</Item>
								<Item 
									key="4" 
									icon={<MailOutlined />}
								>
									<Link to="/email">
										Known Emails
									</Link>
								</Item>
								<Item 
									key="5" 
									icon={<ContactsOutlined />}
								>
									<Link to="/profile">
										Profiles
									</Link>
								</Item>
								<Item 
									key="6" 
									icon={<TagOutlined />}
								>
									<Link to="/label">
										Labels
									</Link>
								</Item>
								<Item 
									key="7" 
									icon={<CopyOutlined />}
								>
									<Link to="/template">
										Templates
									</Link>
								</Item>
								<Item 
									key="8" 
									icon={<HddOutlined />}
								>
									<Link to="/category">
										Categories
									</Link>
								</Item>
							</Menu>
						</Sider> }
						<Layout className="site-layout">
							{ currentUser &&
							<Header 
								className="site-layout-background" 
								style={{ padding: 0 }}
							>
								<Row>
									<Col span={ 4 }>
										{ React.createElement(
											this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, 
											{
												className: 'trigger',
												onClick: this.toggle,
											}
										) }
									</Col>
									<Col 
										span={ 2 }
										offset={ 18 }
										style={{ textAlign: "center" }}
									>
										<Dropdown 
											overlay={ this.menu }
										>
											<Button
												type="ghost"
												style={{ border: "none" }}
												size="large"
												onClick={ event => console.log('profile clicked')}
											>
												{ currentUser.alias }
												<UserOutlined />
											</Button>
										</Dropdown>
									</Col>
								</Row>
							</Header> }
							<Content
								className="site-layout-background"
								style={{
									margin: '24px 16px',
									padding: 24,
									minHeight: 600,
									backgroundColor: currentUser ? "#fff":"transparent",
								}}
							>
									<Route path="/login" component={ Login } />
									<PrivateRoute exact path="/" component={ Home } />
									<PrivateRoute path="/query" component={ Query }/>
									<PrivateRoute path="/case" component={ Case }/>
									<PrivateRoute path="/account" component={ Account }/>
									<PrivateRoute path="/email" component={ Email }/>
									<PrivateRoute path="/profile" component={ Profile }/>
									<PrivateRoute path="/label" component={ Label }/>
									<PrivateRoute path="/template" component={ Template }/>
									<PrivateRoute path="/category" component={ Category }/>
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
