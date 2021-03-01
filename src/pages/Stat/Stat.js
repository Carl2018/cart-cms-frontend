import React from 'react';
import { Line } from 'react-chartjs-2';
// import styling from ant desgin
import { LineChartOutlined,UploadOutlined } from '@ant-design/icons';
import { 
	Card, 
	Col, 
	Row, 
  Space,
  DatePicker,
  Statistic,
  Cascader,
  Table,
  Button,
  Upload,
  message
} from 'antd';

import { authenticationService,statisticService } from '_services';
import moment from 'moment';
import { backend } from '_helpers';
const { RangePicker } = DatePicker;
// destructure imported components and objects
const { listSync,uploadSync } = backend;
const upploadProps = {
  name: 'file',
  // action: 'http://localhost:8080/api/statistic/csv_import',
  // headers: {
  //   authorization: 'authorization-text',
  // },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success({
        content: `${info.file.name} file uploaded and imported successfully`,
        style:{
          marginTop: '10vh'
        }
      },2);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
}

class Stat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          currentUser: authenticationService.currentUserValue,
          invitation_start_date: this.dateToString(this.getDaysBefore(-7)),
          invitation_end_date: this.dateToString(this.getDaysBefore(-1)),
          invitation_date_range: this.generateDateRangeArray(this.getDaysBefore(-7),this.getDaysBefore(-1) ),
          revenue_start_date: this.dateToString(this.getDaysBefore(-1)),
          revenue_end_date: this.dateToString(this.getDaysBefore(-1)),
          revenue_region: '',
          revenue_platform: '',
          data: {},
          dataSubscriber: {},
          dataSubscription: {},
          dataYesterday: {},
          dataRevenue: {},
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
            { value: '1', label: 'HK' },
            { value: '2', label: 'TW' },
            { value: '3', label: 'MY' },
            { value: '', label: 'All' },
          ],
          platform:[
            { value: '1', label: 'IOS' },
            { value: '2', label: 'Android' },
            { value: '', label: 'All' },
          ],
          subscriptionColumns:[
            {title:"", 
              children:[
                {title:"",dataIndex:"group",key:"group", width:'5%',
                render: (text,row,index) => { 
                  let obj = {
                    children: text,
                    props: {}
                  }
                  if(index === 0 || index === 4 || index === 8  )
                    obj.props.rowSpan = 4
                    if( index !== 0 && index !== 4 && index !== 8 && index !== 12 )
                    obj.props.rowSpan = 0
                  return obj 
                }
              },
              {title:"",dataIndex:"duration",key:"duration", width:'6%'},
            ]
          },
            {title:"HK",
              children:[
                this.columnChildren("IOS No.","hk_ios_no","hk_ios_no",'5%'),
                this.columnChildren("IOS $","hk_ios_cash","hk_ios_cash",'5%'),
                this.columnChildren("AOS No.","hk_aos_no","hk_aos_no",'5%'),
                this.columnChildren("AOS $","hk_aos_cash","hk_aos_cash",'5%')
              ]
            },
            {title:"TW",
              children:[
                this.columnChildren("IOS No.","tw_ios_no","tw_ios_no",'5%'),
                this.columnChildren("IOS $","tw_ios_cash","tw_ios_cash",'5%'),
                this.columnChildren("AOS No.","tw_aos_no","tw_aos_no",'5%'),
                this.columnChildren("AOS $","tw_aos_cash","tw_aos_cash",'5%')
              ]
            },
            {title:"MY",
              children:[
                this.columnChildren("IOS No.","my_ios_no","my_ios_no",'5%'),
                this.columnChildren("IOS $","my_ios_cash","my_ios_cash",'5%'),
                this.columnChildren("AOS No.","my_aos_no","my_aos_no",'5%'),
                this.columnChildren("AOS $","my_aos_cash","my_aos_cash",'5%')
              ]
            },
            {title:"Others",
              children:[
                this.columnChildren("IOS No.","ot_ios_no","ot_ios_no",'5%'),
                this.columnChildren("IOS $","ot_ios_cash","ot_ios_cash",'5%'),
                this.columnChildren("AOS No.","ot_aos_no","ot_aos_no",'5%'),
                this.columnChildren("AOS $","ot_aos_cash","ot_aos_cash",'5%')
              ]
            }
          ],
        };
    }
    componentDidMount() {
      this.setState( async (state) => {
        let start_date = state.invitation_start_date;
        let end_date = state.invitation_end_date;
        let revenue_start_date = state.revenue_start_date;
        let revenue_end_date = state.revenue_end_date;
        let revenue_region = state.revenue_region;
        let revenue_platform = state.revenue_platform;
        try{
          await this.listSyncRevenue({
            revenue_start_date,
            revenue_end_date,
            revenue_region,
            revenue_platform
          });
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
    columnChildren = (title,dataIndex,key,width) => {
      return {
        title:title, 
        dataIndex:dataIndex, 
        key:key, 
        width: width, 
        render: (text) => { 
          if(text === 0)
            return (<div style={{color:'#C0C0C0'}}>{text}</div>)
          else
            return (<div style={{color:'black'}}>{text}</div>)
        }
      }
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
    onChangeDatePicker = (dateStrings) => {
      this.setState({
        revenue_start_date: dateStrings[0],
        revenue_end_date: dateStrings[1]
      })
      this.setState( async () => {
        let start_date = this.dateToString(dateStrings[0])
        let end_date = this.dateToString(dateStrings[1])
        let region = this.state.revenue_region
        let platform = this.state.revenue_platform
        this.tryListSyncRevenue(start_date,end_date,region,platform)
      });
    }
    onChangeRegion = (region) => {
      this.setState( async () => {
        let start_date = this.dateToString(this.state.revenue_start_date)
        let end_date = this.dateToString(this.state.revenue_end_date)
        let platform = this.state.revenue_platform
        this.state.revenue_region = region
        this.tryListSyncRevenue(start_date,end_date,region,platform)
      });
    }
    onChangePlatform = (platform) => {
      this.setState( async () => {
        let start_date = this.dateToString(this.state.revenue_start_date)
        let end_date = this.dateToString(this.state.revenue_end_date)
        let region = this.state.revenue_region
        this.state.revenue_platform = platform
        this.tryListSyncRevenue(start_date,end_date,region,platform)
      });
    }
    tryListSyncRevenue = (revenue_start_date,revenue_end_date,revenue_region,revenue_platform) => {
      this.listSyncRevenue({ revenue_start_date, revenue_end_date,  revenue_region,  revenue_platform});
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
    configRevenue = {
      service: statisticService,
      list: "revenue_list",
      dataName:"dataRevenue"
    }
    configUpload = {
      service: statisticService,
      upload: "csv_import",
    }
    listSyncInvite = listSync.bind(this, this.configInvite);
    listSyncSubscriber = listSync.bind(this, this.configSubscriber);
    listSyncSubscription = listSync.bind(this, this.configSubscription);
    listSyncYesterday = listSync.bind(this, this.yesterdayStat);
    listSyncRevenue = listSync.bind(this, this.configRevenue);
    uploadSync = uploadSync.bind(this,this.configUpload)
    setDateRange = (startDate, endDate) => {
      let dateArray = this.generateDateRangeArray(startDate, endDate);
      this.setState({
        invitation_date_range: dateArray
      })
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
    getSubscriptionRevenueTableData = () => {
      let final_entry = []
      let total_group = this.state.dataRevenue.Total 
      this.state.dataRevenue.total_revenue = null
      this.state.dataRevenue.total_count = null
     for( let inx in total_group) {
        if(inx.includes('cash'))
        this.state.dataRevenue.total_revenue += total_group[inx]
        if(inx.includes('no'))
        this.state.dataRevenue.total_count += total_group[inx]
     }
      let formatted_entry = this.state.dataRevenue
      for(let index in formatted_entry){
        let entity = {}
        entity['title'] = index 
        let inner_array = formatted_entry[index]
        for(let idx in inner_array){
          entity[idx] = inner_array[idx]
        }
        final_entry.push(entity)
      }
      return final_entry
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
                color: 'black',
                margin: "24px 0px 0px 0px"
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
                margin: "80px 0px 0px 0px"
              } 
            } 
          >
          <Row gutter={16}>
          <Col xxl={{span:7}} xl={{span:8}}>
              { "Date Range " }
              <RangePicker
                ranges={{
                  'Past 7 days': [moment().subtract(7,'days'), moment().subtract(1,'days')],
                  'Past 14 days': [moment().subtract(14,'days'), moment().subtract(1,'days')],
                  'Past Month': [moment().subtract(1,'months').startOf('month'), moment().subtract(1,'months').endOf('month')],
                }}
                onChange={this.onChange}
                size = "small"
              />
            </Col>
            <Col xxl={{span:6}} xl={{span:7}} >
              { "Region: " }
              <Cascader options={this.state.regions} placeholder="Please select" size="small"/>
            </Col>
          </Row>
        </div>
        <Row gutter={16}>
          <Col span={12}>
            <Card
              title="Invitation Counts"
              style={{ margin: "48px 0px 0px 0px" }}
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
              style={{ margin: "48px 0px 0px 0px" }}
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
              style={{ margin: "16px 0px 0px 0px" }}
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
              style={{ margin: "16px 0px 0px 0px" }}
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
              style={{ margin: "16px 0px 0px 0px" }}
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
            style={{ margin: "16px 0px 0px 0px" }}
          >
            <Line data={{
              labels: this.getLabels(),
              datasets: this.getDataSetsByCountry('hk','subscription')
            }} options={this.state.line_chart_options}/>
          </Card>
          </Col>
        </Row>
        <div gutter={16}>
        <Row style={{ margin: "80px 0px 48px 0px" }}>
          <Col xs={{span:10}} lg={{span:10}} xl={{span:8}}  xxl={{span:6}} >
                { "Date Range " }
                <RangePicker
                  ranges={{
                    'Past 7 days': [moment().subtract(7,'days'), moment().subtract(1,'days')],
                    'Past 14 days': [moment().subtract(14,'days'), moment().subtract(1,'days')],
                    'Past Month': [moment().subtract(1,'months').startOf('month'), moment().subtract(1,'months').endOf('month')],
                  }}
                  onChange={this.onChangeDatePicker}
                  defaultValue={[moment(this.state.revenue_start_date, 'YYYY-MM-DD'), moment(this.state.revenue_start_date, 'YYYY-MM-DD')]} 
                  size="small" 
                  />
              </Col>
              <Col xs={{span:4}} lg={{span:4}} xl={{span:4}}  xxl={{span:3}} >
                { "Region " }
                <Cascader options={this.state.regions} placeholder="Select" onChange={this.onChangeRegion} size="small" 
              style={{ width: '60%' }}/>
              </Col>
              <Col xs={{span:4}} lg={{span:4}} xl={{span:4}}  xxl={{span:3}} >
                { "Platform " }
                <Cascader options={this.state.platform} placeholder="Select" onChange={this.onChangePlatform} size="small" 
              style={{ width: '60%' }}/>
              </Col>
              {/* <Col span={3} >
                { "Plan " }
                <Cascader options={this.state.plan} placeholder="Please select plan" />
              </Col>
              <Col span={2} >
                <Button type="link" a href="https://www.bing.com" target="_blank">Link Button</Button>
              </Col> */}
            <Col xs={{span:4}} lg={{span:4}} xl={{span:4}} xxl={{span:3}} >
            {/* <Upload {...upploadProps} onChange={this.uploadFile}> */}
            <Upload {...upploadProps} action={this.uploadSync} >
                <Button icon={<UploadOutlined/>} size="small">Import Active User CSV</Button>
                </Upload>
              </Col>
            </Row>
          <Row gutter={16}>
            <Col span={24}>
            <Table dataSource={this.getSubscriptionRevenueTableData()} bordered 
              pagination={{hideOnSinglePage:true, pageSize:20}}
              columns={this.state.subscriptionColumns} size="middle">
              </Table>
            </Col>
          </Row>
        </div>
      </div>
    );
	}
}
export { Stat };
