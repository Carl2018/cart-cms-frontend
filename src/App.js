import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import 'App.css';

// import customized component
import { 
	Login,
	Home,
	Query,
	Candidate,
	Flag,
	Word,
	Case,
	Account,
	Email,
	Profile,
	Label,
	Template,
	Title,
	Category,
	Log,
	AppTag,
	Stat,
	RedisLog
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
	Row
} from 'antd';
import {
  ContactsOutlined,
  CopyOutlined,
  FileSearchOutlined,
  HddOutlined,
  HomeOutlined,
  IdcardOutlined,
  FileExcelOutlined,
  FlagOutlined,
  LineChartOutlined,
  LogoutOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
  RobotOutlined,
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
			// fixed by kp, collapsed true becomes false.
			collapsed: false,
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
					<Layout style={{ minHeight: '100vh' }}>
						{ currentUser &&
						<Sider 
							trigger={null} 
							width={150} 
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
									key="100" 
									icon={<LineChartOutlined />}
								>
									<Link to="/stat">
										Stat
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
									icon={<IdcardOutlined />}
								>
									<Link to="/candidate">
										Candidates
									</Link>
								</Item>
								<Item 
									key="3" 
									icon={<FlagOutlined />}
								>
									<Link to="/flag">
										Flags
									</Link>
								</Item>
								<Item 
									key="4" 
									icon={<FileExcelOutlined />}
								>
									<Link to="/word">
										Words
									</Link>
								</Item>
								<Item 
									key="5" 
									icon={<FileSearchOutlined />}
								>
									<Link to="/case">
										Cases
									</Link>
								</Item>
								<Item 
									key="6" 
									icon={<TeamOutlined />}
								>
									<Link to="/account">
										Accounts
									</Link>
								</Item>
								<Item 
									key="7" 
									icon={<MailOutlined />}
								>
									<Link to="/email">
										Emails
									</Link>
								</Item>
								<Item 
									key="8" 
									icon={<ContactsOutlined />}
								>
									<Link to="/profile">
										Profiles
									</Link>
								</Item>
								<Item 
									key="9" 
									icon={<TagOutlined />}
								>
									<Link to="/label">
										Labels
									</Link>
								</Item>
								<Item 
									key="10" 
									icon={<CopyOutlined />}
								>
									<Link to="/template">
										Templates
									</Link>
								</Item>
								<Item 
									key="11" 
									icon={<HddOutlined />}
								>
									<Link to="/category">
										Categories
									</Link>
								</Item>
								<Item 
									key="12" 
									icon={<RobotOutlined />}
								>
									<Link to="/title">
										Titles
									</Link>
								</Item>
								<Item 
									key="13" 
									icon={<ProfileOutlined />}
								>
									<Link to="/log">
										Logs
									</Link>
								</Item>
								<Item 
									key="14" 
									icon={<TagOutlined />}
								>
									<Link to="/apptag" >
										Tags
									</Link>
								</Item>
								<Item 
									key="15" 
									icon={<ProfileOutlined />}
								>
									<Link to="/redislog" >
										Redis Logs
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
									<PrivateRoute path="/stat" component={ Stat }/>
									<PrivateRoute path="/query" component={ Query }/>
									<PrivateRoute path="/candidate" component={ Candidate }/>
									<PrivateRoute path="/flag" component={ Flag }/>
									<PrivateRoute path="/word" component={ Word }/>
									<PrivateRoute path="/case" component={ Case }/>
									<PrivateRoute path="/account" component={ Account }/>
									<PrivateRoute path="/email" component={ Email }/>
									<PrivateRoute path="/profile" component={ Profile }/>
									<PrivateRoute path="/label" component={ Label }/>
									<PrivateRoute path="/template" component={ Template }/>
									<PrivateRoute path="/category" component={ Category }/>
									<PrivateRoute path="/title" component={ Title }/>
									<PrivateRoute path="/log" component={ Log }/>
									<PrivateRoute path="/apptag" component={ AppTag }/>
									<PrivateRoute path="/redislog" component={ RedisLog }/>
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
