import React from 'react';
import { Line } from 'react-chartjs-2';

// import styling from ant desgin
import { LineChartOutlined } from '@ant-design/icons';
import { 
	Card, 
	Col, 
	Row, 
  Space,
  DatePicker
} from 'antd';

import { authenticationService,statisticService } from '_services';
import moment from 'moment';
import { backend } from '_helpers';
const { RangePicker } = DatePicker;

// destructure imported components and objects
const { listSync } = backend;

class Stat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: authenticationService.currentUserValue,
            invitation_start_date: "2020-08-01",
            invitation_end_date: "2020-08-17",
            invitation_date_range: this.generateDateRangeArray(this.getDaysBefore(-7),this.getDaysBefore(-1) ),
            data: {},
        };
        
    }

    componentDidMount() {
      this.setState( async (state) => {
        let start_date = state.invitation_start_date;
        let end_date = state.invitation_end_date;
        await this.listSync({
          start_date,
          end_date,
        });
      });
    }
    dateToString = (selectedDate) => {
      let currentDate = new Date(selectedDate)
      let stringStartDate = currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDate()
      return stringStartDate
    }
    onChange = (dateStrings) => {
      this.setState({
        invitation_start_date: dateStrings[0],
        invitation_end_date: dateStrings[1]
      })
      this.setDateRange(dateStrings[0],dateStrings[1])
      this.setState( async () => {
        let start_date = this.dateToString(dateStrings[0])
        let end_date = this.dateToString(dateStrings[1])
        await this.listSync({
          start_date,
          end_date,
        });
      });
    }
    // bind versions of CRUD
    config = {
      service: statisticService,
      list: "list",
      dataName:"data"
    };
    listSync = listSync.bind(this, this.config);

    setDateRange = (startDate, endDate) => {
      let dateArray = this.generateDateRangeArray(startDate, endDate);
      let stringStartDate = this.dateToString(startDate)
      let stringEndDate = this.dateToString(endDate)
      this.setState({
        invitation_date_range: dateArray
      })
      this.listSync({
          start_date:stringStartDate,
          end_date:stringEndDate
        });
    }

    generateDateRangeArray = (startDate, endDate) => {
      let dateArray = []
      let currentDate = new Date(startDate)
      endDate = new Date(endDate)
      let stringCurrentDate = this.dateToString(startDate)
      while (currentDate <= endDate) {
          dateArray.push(stringCurrentDate)
          //stringCurrentDate = (currentDate.getMonth()+1)+"-"+(currentDate.getDate()+1)
          currentDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate()+1)
          stringCurrentDate = (currentDate.getMonth()+1) + "-" + currentDate.getDate()
      }
      return dateArray
    }

    getDaysBefore = (day_diff) =>{
      let currentDate = new Date()
      let day = currentDate.getDate()
      day = day + day_diff
      return new Date(currentDate.getFullYear(),currentDate.getMonth(), day)
    }

    getLabels = () => {
      
      return this.state.invitation_date_range
    }
    dataEntry = (customed_label,customed_color,data_type) => {
      return {
        label: customed_label,
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: customed_color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: customed_color,
        pointBackgroundColor: customed_color,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: customed_color,
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: this.getDataArrayBasedOnType(data_type)
      }
    }
    getDataSets = (data_type) => {
      return [
        this.dataEntry('HK','rgba(255,69,0,1)','hk_'+data_type),
        this.dataEntry('TW','rgba(255,140,0,1)','tw_'+data_type),
        this.dataEntry('MY','rgba(30,144,255,1)','my_'+data_type),
        this.dataEntry('CA','rgba(75,192,192,1)','ca_'+data_type)
      ]
    }

    getDataArrayBasedOnType = (region) =>{
      switch(region){
        case 'hk_invitation_count':
          return this.state.data.hk_invitation_count
        case 'tw_invitation_count':
          return this.state.data.tw_invitation_count
        case 'my_invitation_count':
          return this.state.data.my_invitation_count
        case 'ca_invitation_count':
          return this.state.data.ca_invitation_count
        case 'hk_conversation_count':
          return this.state.data.hk_conversation_count
        case 'tw_conversation_count':
          return this.state.data.tw_conversation_count
        case 'my_conversation_count':
          return this.state.data.my_conversation_count
        case 'ca_conversation_count':
          return this.state.data.ca_conversation_count
        case 'hk_match_rate':
          return this.state.data.hk_match_rate
        case 'tw_match_rate':
          return this.state.data.tw_match_rate
        case 'my_match_rate':
          return this.state.data.my_match_rate
        case 'ca_match_rate':
          return this.state.data.ca_match_rate
        default:
          break
      }
      
    }
    render() {
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
                <Row gutter={16}>
                <Col span={2}>
									<Space size="large">
										<LineChartOutlined />
										<strong>Stat</strong>
                  </Space>
                </Col>
                <Col span={22}>
                  <RangePicker
                    ranges={{
                     'Past 7 days': [moment().subtract(7,'days'), moment().subtract(1,'days')],
                      'Past 14 days': [moment().subtract(14,'days'), moment().subtract(1,'days')],
                      'Past Month': [moment().subtract(1,'months').startOf('month'), moment().subtract(1,'months').endOf('month')],
                    }}
                    onChange={this.onChange}
                  />
                </Col>
                </Row>
                </Card>
                <Row gutter={16}>
                  <Col span={12}>
                    <Card
                      title="Invitation Count"
                      style={{ margin: "16px" }}
                    >
                      <Line data={{
                        labels: this.getLabels(),
                        datasets: this.getDataSets('invitation_count')
                      }} />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      title="Conversation Count"
                      style={{ margin: "16px" }}
                    >
                      <Line data={{
                        labels: this.getLabels(),
                        datasets: this.getDataSets('conversation_count')
                      }} />
                    </Card>
									</Col>
                </Row>
            </div>
        );
    }
}

export { Stat };
