import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';

// import customized component
import Query from './pages/Query/Query';
import Case from './pages/Case';
import Account from './pages/Account';
import Email from './pages/Email';
import Label from './pages/Label';
import Template from './pages/Template';
import Category from './pages/Category';

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
			collapsed: true,
		};
	}
	
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

	render(){
		return (
			<div className="App">
				<Router>
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
									<Link to="/">
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
									<Route exact path="/" component={ Query }/>
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
