import React, { useState, useEffect } from "react";
import { Modal, Col, Row, Form,  Descriptions, Button, Select, Switch, Typography } from "antd";
import { DashboardOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { getSubscription, unsubscribe, renewSubscription, updateSubscription } from "../../redux/dataRedux";
import CustomButton from "../../components/CustomButton";
import moment from 'moment';


export default function SubscriptionModal(props) {
    const [form] = Form.useForm();
    const { Option } = Select;
    const [subscriptionType, setSubscriptionType] = useState('');
    const [autorenewal, setAutorenewal] = useState(false);
    const [operation, setOperation] = useState(getOperation());
    const [isSubscribed, setIsSubscribed] = useState(true);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [data, setData] = useState([]);
    const [subscriptionDetails, setSubscriptionDetails] = useState({
      plan: "Monthly",
      expiry: "2023-12-31",
      nextBillingDate: "2023-12-31",
      auto_renewal: true,
      status: "Active"
  });

  const [modalTitle, setModalTitle] = useState(generateTitle());

    let initialValues = {};
    // console.log(props)
    
    if (props.subscriptionPlan) {
      initialValues.subscriptionType = props.subscriptionPlan;
    }

  const handleSubscriptionTypeChange = (value) => {
    setSubscriptionType(value);
};

const handleAutorenewalChange = (value) => {
    setAutorenewal(value);
};

function onClickCancelSubButton() {
    setOperation("UNSUBSCRIBE");
    setModalTitle("Are you sure you want to unsubscribe?")
  }

  function onClickCancelUnsubscribe() {
    initialValues = {};
    setOperation("VIEW");
    setModalTitle("Subscription Details");
  }

  async function onClickUnsubscribe() {
    try {
      // Replace this with your API call to fetch user subscription status
      const response = await unsubscribe(subscriptionDetails.subscription_id);
      console.log(response.status)
      if (response.status) {
        console.log(response.data)
        setSubscriptionDetails(response.data);
        onClickCancelUnsubscribe();
        
        toast.success("Subscription Unsubscribed Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
        });

        //props.onClickUnsub();
        
      } else {
        // console.log("trigger");
        toast.error("Error!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        });
      }
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });
    }
  }

  async function onClickUpdateSub() {
    try {
      if (subscriptionType === '') {
        toast.success("Please select a subscription type!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        });
        return;
      }

      // Replace this with your API call to fetch user subscription status
      const response = await updateSubscription(subscriptionDetails.subscription_id, subscriptionType, autorenewal);
            if (response.status) {
              console.log(response.data)
              setSubscriptionDetails(response.data);
              onClickCancelUnsubscribe();

              toast.success("Subscription Updated Successfully!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
              });

            } else {
              toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
              });
            }
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });
    }
  }

  async function onClickRenew() {
    try {
        // Replace this with your API call to fetch user subscription status
        const response = await renewSubscription(subscriptionDetails.subscription_id);
        console.log(response)
        if (response.status) {
          // console.log(response.data);
          onClickCancelUnsubscribe();
          setSubscriptionDetails(response.data);

          toast.success("Renewed subscription successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          });
        } else {
          toast.error(response.data.errorMessage, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          });
        }

      } catch (error) {
        toast.error(error, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        });
      }
  }

  if (props.autoRenewal !== null) {
    initialValues.autoRenew = props.autoRenewal;
  }

  function onClickManageSubButton(operationString) {
    //setIsSubModalOpen(true);
    setOperation(operationString);

    if (operationString === "UPDATE") {
      setModalTitle("Update Subscription");
        
    } else if (operationString === "RENEW") {
      setModalTitle("Renew Subscription");

    } else if (operationString === "SUBSCRIBE") {
      setModalTitle("Subscribe to Data Dashboard");
        
    } else if (operationString === "VIEW") {
      setModalTitle("Subscription Details");
    }
  }

  useEffect(() => {
    // Set the initial values
    if (props.subscriptionType && props.autoRenew) {
      form.setFieldsValue({
        subscriptionType: props.subscriptionType,
        autoRenew: props.autoRenew,
      });
    }
  }, [form, props.subscriptionType, props.autoRenew]);

  useEffect(() => {
    // Fetch user subscription status here
    const fetchSubscriptionStatus = async () => {
      try {
        // Replace this with your API call to fetch user subscription status
        let user_id;
        let user_type;

        if (user.user_type === "VENDOR_STAFF") {
            user_type = "VENDOR"
            user_id = user.vendor.vendor_id;

        } else if (user.user_type === "LOCAL") {
            user_type = "LOCAL"
            user_id = user.user_id;
        }

        const response = await getSubscription(user_id, user_type);
        if (response.status) {
          const details = response.data;
          // console.log(details);
          setSubscriptionDetails(response.data);
          if (details === "active") {
            setIsSubscribed(true);
          }
          
        } else {
          toast.error(response.data.errorMessage, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          });
        }
      } catch (error) {
        toast.error(error, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        });
      }
    };

    if (operation === "VIEW") {
        fetchSubscriptionStatus();
    }
  }, []);

  function generateTitle() {
    if (props.operation === "UPDATE") {
        //setModalTitle("Update Subscription");
        return "Update Subscription";
    } else if (props.operation === "RENEW") {
        //setModalTitle("Renew Subscription");
        return "Renew Subscription"
    } else if (props.operation === "SUBSCRIBE") {
        //setModalTitle("Subscribe to Data Dashboard");
        return "Subscribe to Data Dashboard"
    } else if (props.operation === "VIEW") {
        //setModalTitle("Subscription Details");
        return "Subscription Details"
    }
  }

  function generateViewModalTitle() {
    return (
      <Row style={{minWidth: 800}}>
        <Col>
          <p>{modalTitle}</p>
        </Col>

        {operation === "VIEW" && 
        <Row style={{width: 430 }}>
            <Col style={{marginLeft: 105, marginRight: 10, marginTop: -5}}>
            {(subscriptionDetails.auto_renewal || (subscriptionDetails.current_period_start !== "-") ) &&
              <Button type="primary" danger text="Unsubscribe" onClick={onClickCancelSubButton}>
                  Unsubscribe
              </Button>
            }
          </Col>

          <Col style={{marginLeft: (subscriptionDetails.auto_renewal || (subscriptionDetails.current_period_start !== "-") ) ? 0 : 115, marginRight: 10, marginTop: -5}}>
            <CustomButton text="Update Subscription" icon={<DashboardOutlined />} onClick={() => onClickManageSubButton("UPDATE")} />
          </Col>
        </Row>}
      </Row>
    )
  }

  function getOperation() {
      return props.operation;
  }

  return(
    <div>
      <Modal
        // title={modalTitle}
        title={generateViewModalTitle()}
        centered
        open={props.isSubModalOpen}
        onCancel={props.onClickCancelManageSubButton}
        style={{minWidth: 650}}
        footer={[]} // hide default buttons of modal    
      >
        <Form 
            form={form}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            required={true}
            requiredMark={true}
            onFinish={props.onClickSubmitSubscription}
            initialValues={initialValues}
        >
          
        {operation === "VIEW" &&
          <div>
            <div style={{marginBottom: 20, marginTop: 10}}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Subscription Plan" labelStyle={{width: 180}}>
                  {subscriptionDetails.plan}
                </Descriptions.Item>

                <Descriptions.Item label="Billing Amount">
                  {subscriptionType === 'Yearly' ? `$250/year` : '$22/month'}
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* auto renewal is set to true */}
            <div>
              {subscriptionDetails.auto_renewal && 
                <Col>
                  <Row><p style={{fontWeight: 'bold', marginLeft: 5}}>Auto Renewal Status:</p></Row>
                  <Row>
                    <Descriptions bordered column={1}>
                      <Descriptions.Item contentStyle={{width: 600}}>
                        <Row>
                          <Col style={{marginRight: 5}}><p>You are currently on subscription auto renewal. Your next billing date is on</p></Col>
                          <Col><p style={{fontWeight: 'bold'}}>{moment(subscriptionDetails.current_period_start).format('LL')}</p></Col>
                        </Row>
                      </Descriptions.Item>
                    </Descriptions>
                  </Row>
                </Col>
              }

              {/* auto renewal is set to false */}
              {!subscriptionDetails.auto_renewal && 
                <Col>
                  <Row><p style={{fontWeight: 'bold'}}>Current Subscription Information</p></Row>
                  <Row>
                    <Descriptions bordered column={1}>
                      <Descriptions.Item contentStyle={{width: 600 }}>
                        {subscriptionDetails.current_period_start !== '-' && 
                        <Row>
                          <Col style={{marginRight: 5}}><p>Your next billing date is on</p></Col>
                          <Col><p style={{fontWeight: 'bold'}}>{moment(subscriptionDetails.current_period_start).format('LL')}.</p></Col>
                        </Row>
                        }

                        {subscriptionDetails.current_period_end && 
                        <Row style={{marginBottom: 15}}>
                          <Col style={{marginRight: 5}}><p>Your current subscription ends on</p></Col>
                          <Col><p style={{fontWeight: 'bold'}}>{moment(subscriptionDetails.current_period_end).format('LL')}.</p></Col>
                        </Row>
                        }
                        <Row style={{marginLeft: 170}}>
                          <CustomButton text="Extend Current Subscription" onClick={() => onClickManageSubButton("RENEW")} />
                        </Row>
                      </Descriptions.Item>
                    </Descriptions>
                  </Row>


                </Col>
              }
            </div>
          </div>
    }

  {operation === "UNSUBSCRIBE" &&
    <div>
      <Typography.Text>This action cannot be undone.</Typography.Text>

      <Form.Item wrapperCol={{ offset: 10, span: 16 }} style={{marginTop: 10, marginBottom: -60 }}>
          <Button type="primary" onClick={onClickUnsubscribe} style={{marginRight: 10 }}>Yes</Button>
          <Button type="primary" danger onClick={onClickCancelUnsubscribe}>No</Button>
      </Form.Item>
    </div>
  }

  {operation === "RENEW" &&
    <div>
      <Typography.Text>{`Are you sure you want to renew your subscription? \nThis action cannot be undone.`}</Typography.Text>

      <Form.Item wrapperCol={{ offset: 10, span: 16 }} style={{marginTop: 10, marginBottom: -60 }}>
        <Button type="primary" onClick={onClickRenew} style={{marginRight: 10 }}>Yes</Button>
        <Button type="primary" danger onClick={onClickCancelUnsubscribe}>No</Button>
      </Form.Item>
    </div>
  }
  
  {(operation === "UPDATE" || operation === "SUBSCRIBE") &&
    <div>
      <Form.Item
        label="Subscription Type"
        labelAlign="left"
        name="subscriptionType"
        rules={[{ required: true, message: 'Please select the subscription type' }]}
      >
        <Select onChange={handleSubscriptionTypeChange}>
          <Option value='Monthly'>Monthly</Option>
          <Option value='Yearly'>Yearly</Option>
        </Select>  
      </Form.Item>

      <Form.Item
        label="Auto Renew"
        labelAlign="left"
        name="autoRenew"
        rules={[{ required: true, message: 'Please indicate whether to auto-renew or not' },]}
        valuePropName="checked"
      >
        <Switch onChange={handleAutorenewalChange} />
      </Form.Item>

      {subscriptionType !== '' && (
        <Form.Item
          label="Pricing"
          labelAlign="left"
        >
          <Typography.Text>
            {subscriptionType === 'Yearly' ? `$250/year` : '$22/month'}
          </Typography.Text>
        </Form.Item>)}
    </div>}

    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
      {(operation === "UPDATE") && 
        <Row>
          <Button type="primary" onClick={onClickUpdateSub} style={{marginRight: 10}}>Update</Button>
          <Button type="primary" danger onClick={onClickCancelUnsubscribe}>Back</Button>
        </Row>}

        {(operation === "SUBSCRIBE") &&
          <Row>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Row>}
      </Form.Item>
    </Form>
    </Modal>
  </div>
)}