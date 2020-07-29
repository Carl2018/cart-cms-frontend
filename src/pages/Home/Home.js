import React from 'react';
import { Line } from 'react-chartjs-2';

// import styling from ant desgin
import { HomeOutlined } from '@ant-design/icons';
import { 
	Card, 
	Col, 
	Row, 
	Space, 
	Statistic, 
} from 'antd';

import { authenticationService } from '_services';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Created',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: 'rgba(75,192,192,1)',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55]
    },
    {
      label: 'Settled',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(0,191,255,0.4)',
      borderColor: 'rgba(0,191,255,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(0,191,255,1)',
      pointBackgroundColor: 'rgba(0,191,255,1)',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(0,191,255,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [56, 60, 91, 72, 42, 62]
    }
  ]
};

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
        };
    }

    componentDidMount() {
    }

    render() {
        //const { currentUser } = this.state;
        return (
            <div>
								<Card
									style={{
										marginLeft: "16px",
										fontSize: '24px',
										textAlign: 'left',
								 	}}
									bordered={ false }
								>
									<Space size="large">
										<HomeOutlined />
										<strong>Home</strong>
									</Space>
								</Card>
                <Card
									title="This Month"
									style={{ margin: "16px" }}
                >
									<Row gutter={16}>
										<Col span={4}>
												<Statistic
													title="Created"
													value={84}
												/>
										</Col>
										<Col span={4}>
											<Statistic
												title="Pending"
												value={21}
											/>
										</Col>
										<Col span={4}>
												<Statistic
													title="Approved"
													value={98}
													suffix="/ 112"
												/>
										</Col>
										<Col span={4}>
												<Statistic
													title="Rejected"
													value={12}
													suffix="/ 112"
												/>	
										</Col>
										<Col span={4}>
												<Statistic
													title="Deferred"
													value={2}
													suffix="/ 112"
												/>
										</Col>
										<Col span={4}>
												<Statistic
													title="Settled"
													value={112}
												/>
										</Col>
									</Row>
                </Card>
                <Card
									title="In the Past 6 Months"
									style={{ margin: "16px" }}
								>	
									<Line data={data} />
                </Card>
            </div>
        );
    }
}

export { Home };
