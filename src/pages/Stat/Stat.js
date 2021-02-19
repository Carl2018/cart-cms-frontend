import React from 'react';
import { Line } from 'react-chartjs-2';
// import styling from ant desgin
import { LineChartOutlined } from '@ant-design/icons';
import { 
	Card, 
	Col, 
	Row, 
  Space,
  DatePicker,
  Statistic,
  Cascader
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
            invitation_start_date: this.dateToString(this.getDaysBefore(-7)),
            invitation_end_date: this.dateToString(this.getDaysBefore(-1)),
            invitation_date_range: this.generateDateRangeArray(this.getDaysBefore(-7),this.getDaysBefore(-1) ),
            data: {},
            dataSubscriber: {},
            dataSubscription: {},
            dataYesterday: {},
            line_chart_options:{
              tooltips: {
                mode: 'index',
                intersect: true,
              },
              scales: {
                xAxes: [{
                  ticks: {
                    stepSize: 3,
                  }
                }],
              }
            },
            regions:[
              {
                value: 'HK',
                label: 'HK',
              },
              {
                value: 'TW',
                label: 'TW',
              },
              {
                value: 'MO',
                label: 'MO',
              },
              {
                value: 'SG',
                label: 'SG',
              },
              {
                value: 'GB',
                label: 'GB',
              },
              {
                value: 'CN',
                label: 'CN',
              },
              {
                value: 'JP',
                label: 'JP',
              },
              {
                value: 'US',
                label: 'US',
              },
              {
                value: 'CA',
                label: 'CA',
              },
              {
                value: 'AU',
                label: 'AU',
              },
              {
                value: 'MY',
                label: 'MY',
              },
              {
                value: 'NZ',
                label: 'NZ',
              }
            ]
        };
    }
    componentDidMount() {
      this.setState( async (state) => {
        // this.setState(  (state) => {
        let start_date = state.invitation_start_date;
        let end_date = state.invitation_end_date;
        // await this.listSync({
        //   start_date,
        //   end_date,
        // });
        try{
          await this.listSyncInvite({
            start_date,
            end_date,
          });
          await this.listSyncSubscriber({
            start_date,
            end_date,
          });
          await this.listSyncSubscription({
            start_date,
            end_date,
          });
          await this.listSyncYesterday({
          });
        }catch(error){
          console.log(error)
        }
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
      // this.setState(  () => {
        let start_date = this.dateToString(dateStrings[0])
        let end_date = this.dateToString(dateStrings[1])
        // await this.listSync({
        //   start_date,
        //   end_date,
        // });
        try{
          this.listSyncInvite({
            start_date,
            end_date,
          });
          this.listSyncSubscriber({
            start_date,
            end_date,
          });
          this.listSyncSubscription({
            start_date,
            end_date,
          });
        }catch(error){
          console.log(error)
        }
        
      });
    }
    // bind versions of CRUD
    configInvite = {
      service: statisticService,
      list: "list",
      dataName:"data"
    };
    configSubscriber = {
      service: statisticService,
      list: "apple_subscriber_list",
      dataName:"dataSubscriber"
    };
    configSubscription = {
      service: statisticService,
      list: "apple_subscription_list",
      dataName:"dataSubscription"
    };
    yesterdayStat = {
      service: statisticService,
      list: "yesterday_stat",
      dataName:"dataYesterday"
    };
    //listSync = listSync.bind(this, this.config);
    listSyncInvite = listSync.bind(this, this.configInvite);
    listSyncSubscriber = listSync.bind(this, this.configSubscriber);
    listSyncSubscription = listSync.bind(this, this.configSubscription);
    listSyncYesterday = listSync.bind(this, this.yesterdayStat);

    setDateRange = (startDate, endDate) => {
      let dateArray = this.generateDateRangeArray(startDate, endDate);
      // let stringStartDate = this.dateToString(startDate)
      // let stringEndDate = this.dateToString(endDate)
      this.setState({
        invitation_date_range: dateArray
      })
      // this.listSync({
      //   start_date:stringStartDate,
      //   end_date:stringEndDate
      // });
      // this.listSyncInvite({
      //   start_date:stringStartDate,
      //   end_date:stringEndDate
      // });
      // this.listSyncSubscriber({
      //   start_date:stringStartDate,
      //   end_date:stringEndDate
      // });
    }

    generateDateRangeArray = (startDate, endDate) => {
      let dateArray = []
      let currentDate = new Date(startDate)
      endDate = new Date(endDate)
      // let stringCurrentDate = this.dateToString(startDate)
      let stringCurrentDate = (currentDate.getMonth()+1) + "-" + currentDate.getDate()
      while (currentDate <= endDate) {
          dateArray.push(stringCurrentDate)
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
        spanGaps: false,
        data: this.getDataArrayBasedOnType(data_type)
      }
    }
    dataEntryApple = (customed_label,customed_color,data_type, dataset) => {
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
        spanGaps: false,
        data: this.getAppleDataArrayBasedOnType(data_type,dataset)
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

    getDataSetsByRegion = (region_type) => {
      return [
        this.dataEntry('Google','rgba(255,69,0,1)',region_type+'_google_register'),
        this.dataEntry('SMS','rgba(255,140,0,1)',region_type+'_sms_register'),
        this.dataEntry('Facebook','rgba(30,144,255,1)',region_type+'_facebook_register'),
        this.dataEntry('Apple','rgba(75,192,192,1)',region_type+'_apple_register'),
        this.dataEntry('Total','rgba(0,0,0,1)',region_type+'_total_register'),
      ]
    }

    getDataSetsByCountry = (country,dataset) => {
      return [
        this.dataEntryApple('T1 gold 1m','rgba(255,69,0,1)',country+'_t1_gold_1m',dataset),
        this.dataEntryApple('T1 gold 3m','rgba(255,140,0,1)',country+'_t1_gold_3m',dataset),
        this.dataEntryApple('T1 gold 6m','rgba(30,144,255,1)',country+'_t1_gold_6m',dataset),

        this.dataEntryApple('T2 silver 1m','rgba(75,192,192,1)',country+'_t2_silver_1m',dataset),
        this.dataEntryApple('T2 silver 3m','rgba(0,0,0,1)',country+'_t2_silver_3m',dataset),
        this.dataEntryApple('T2 silver 6m','rgba(75,192,192,1)',country+'_t2_silver_6m',dataset),
        this.dataEntryApple('T2 silver 12m','rgba(0,0,0,1)',country+'_t2_silver_1yr',dataset),

        this.dataEntryApple('T3 adfree 1m','rgba(255,69,0,1)',country+'_t3_adfree_1m',dataset),
        this.dataEntryApple('T3 adfree 3m','rgba(255,140,0,1)',country+'_t3_adfree_3m',dataset),
        this.dataEntryApple('T3 adfree 6m','rgba(30,144,255,1)',country+'_t3_adfree_6m',dataset),
      ]
    }
    getDataArrayBasedOnType = (input_property) =>{
      let regions = {'au' : 'au', 'ca' : 'ca', 'cn' : 'cn', 'gb' : 'gb', 'hk' : 'hk', 
        'jp' : 'jp', 'mo' : 'mo', 'my' : 'my', 'nz' : 'nz', 'sg' : 'sg', 'tw' : 'tw', 'us' : 'us' }; 
      let counts = {'invitation_count': 'invitation_count', 'conversation_count': 'conversation_count', 'match_rate':'match_rate', 'google_register' : 'google_register', 'sms_register': 'sms_register', 'facebook_register': 'facebook_register', 'apple_register' : 'apple_register', 'total_register': 'total_register', 't1_gold_1m' : 't1_gold_1m', 't1_gold_3m' : 't1_gold_3m', 't1_gold_6m' : 't1_gold_6m', 't2_silver_1m' : 't2_silver_1m', 't2_silver_3m' : 't2_silver_3m', 't2_silver_6m' : 't2_silver_6m', 't2_silver_1yr' : 't2_silver_1yr', 't3_adfree_1m' : 't3_adfree_1m', 't3_adfree_3m' : 't3_adfree_3m', 't3_adfree_6m' : 't3_adfree_6m', }
      let properties = {}
      for( let index_r in regions){
        for( let index_c in counts){
          let key = regions[index_r] + "_" + counts[index_c]
          properties[key] = key
        }
      }
      return this.state.data[properties[input_property]]
    }
    getAppleDataArrayBasedOnType = (input_property,dataset) =>{
      let regions = {'au' : 'au', 'ca' : 'ca', 'cn' : 'cn', 'gb' : 'gb', 'hk' : 'hk', 
        'jp' : 'jp', 'mo' : 'mo', 'my' : 'my', 'nz' : 'nz', 'sg' : 'sg', 'tw' : 'tw', 'us' : 'us' }; 
      let counts = { 't1_gold_1m' : 't1_gold_1m', 't1_gold_3m' : 't1_gold_3m', 't1_gold_6m' : 't1_gold_6m', 't2_silver_1m' : 't2_silver_1m', 't2_silver_3m' : 't2_silver_3m', 't2_silver_6m' : 't2_silver_6m', 't2_silver_1yr' : 't2_silver_1yr', 't3_adfree_1m' : 't3_adfree_1m', 't3_adfree_3m' : 't3_adfree_3m', 't3_adfree_6m' : 't3_adfree_6m', }
      let properties = {}
      for( let index_r in regions){
        for( let index_c in counts){
          let key = regions[index_r] + "_" + counts[index_c]
          properties[key] = key
        }
      }
      let returned_array = dataset === 'subscriber' ? this.state.dataSubscriber[properties[input_property]] : this.state.dataSubscription[properties[input_property]]
      return returned_array
    }
    axes = [
        { primary: true, type: 'time', position: 'bottom' },
        { type: 'linear', position: 'left' }
      ]
//////////////////////////////////////////////////////////////////////////
    render() {
      return (
        <div>
          <div 
            style={ 
              {
                fontSize: '24px',
                textAlign: 'left',
                margin: "16px 16px 16px 16px"
              } 
            } 
          >
            <Space size="large">
              <LineChartOutlined />
              <strong>Stat</strong>
            </Space>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic title="Register" value={this.state.dataYesterday.total_register} />
              </Col>
              <Col span={6}>
                <Statistic title="Match Rate" value={this.state.dataYesterday.total_rate}  />
              </Col>
              <Col span={6}>
                <Statistic title="Invitation Count" value={this.state.dataYesterday.total_invitation}  />
              </Col>
              <Col span={6}>
                <Statistic title="Conversation Count" value={this.state.dataYesterday.total_conversation}  />
              </Col>
            </Row>
            <div style={ 
              {
                fontSize: '18px',
                textAlign: 'left',
                color: 'black'
              } 
            } >
              <Row gutter={16}>
                <Col span={6}>
                  {this.state.dataYesterday.register}
                </Col>
                <Col span={6}>
                  {this.state.dataYesterday.rate}
                </Col>
                <Col span={6}>
                  {this.state.dataYesterday.invitation}
                </Col>
                <Col span={6}>
                  {this.state.dataYesterday.conversation}
                </Col>
              </Row>
            </div>
          </div>
          <div 
            style={ 
              {
                fontSize: '16px',
                textAlign: 'left',
                margin: "16px 16px 0px 16px"
              } 
            } 
          >
          <Row gutter={16}>
            <Col span={12}>
              { "Date Range " }
              <RangePicker
                ranges={{
                  //'Past 7 days': [moment().startOf('month'), moment().endOf('month')],
                  'Past 7 days': [moment().subtract(7,'days'), moment().subtract(1,'days')],
                  'Past 14 days': [moment().subtract(14,'days'), moment().subtract(1,'days')],
                  'Past Month': [moment().subtract(1,'months').startOf('month'), moment().subtract(1,'months').endOf('month')],
                }}
                onChange={this.onChange}
              />
            </Col>
            <Col span={12} >
              { "Region: " }
              <Cascader options={this.state.regions} placeholder="Please select" />
            </Col>
          </Row>
        </div>
        <Row gutter={16}>
          <Col span={12}>
            <Card
              title="Invitation Counts"
              style={{ margin: "16px" }}
            >
              <Line data={{
                labels: this.getLabels(),
                datasets: this.getDataSets('invitation_count')
              }} options={this.state.line_chart_options}/>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="Conversation Counts"
              style={{ margin: "16px" }}
            >
              <Line data={{
                labels: this.getLabels(),
                datasets: this.getDataSets('conversation_count')
              }} options={this.state.line_chart_options}/>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Card
              title="Match Rate (%)"
              style={{ margin: "16px" }}
            >
            <Line data={{
              labels: this.getLabels(),
              datasets: this.getDataSets('match_rate')
            }} options={this.state.line_chart_options}/>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="Daily Registers"
              style={{ margin: "16px" }}
            >
              <Line data={{
                labels: this.getLabels(),
                datasets: this.getDataSetsByRegion('hk')
              }} options={this.state.line_chart_options}/>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Card
              title="Daily Subscribers"
              style={{ margin: "16px" }}
            >
            
            <Line data={{
              labels: this.getLabels(),
              datasets: this.getDataSetsByCountry('hk','subscriber')
            }} options={this.state.line_chart_options}/>
              
            </Card>
          </Col>
          <Col span={12}>
          
          <Card
            title="Daily Subscription Amount"
            style={{ margin: "16px" }}
          >
            <Line data={{
              labels: this.getLabels(),
              datasets: this.getDataSetsByCountry('hk','subscription')
            }} options={this.state.line_chart_options}/>
          </Card>
          </Col>
        </Row>
      </div>
    );
	}
}
export { Stat };