import React, { useState } from 'react';
import { Layout, Input, Button, List, Avatar } from 'antd';
import {SendOutlined, UserOutlined} from '@ant-design/icons';

const { Content } = Layout;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim() !== '') {
      const newMessage = {
        text: inputText,
        isUser: true, // Set to false if the message is from the chatbot
      };

      setMessages([...messages, newMessage]);
      setInputText('');

      // You can send a request to your chatbot server here and handle its response.
      // Update the messages state with the response from the chatbot.
      // Example:
      // fetchChatbotResponse(inputText)
      //   .then((response) => {
      //     const botMessage = {
      //       text: response,
      //       isUser: false,
      //     };
      //     setMessages([...messages, botMessage]);
      //   });
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '16px' }}>
        <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px', padding: '16px', minHeight: '400px' }}>
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(message, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={message.isUser ? null : <UserOutlined />} />}
                  title={message.isUser ? 'You' : 'Chatbot'}
                  description={message.text}
                />
              </List.Item>
            )}
          />
        </div>
        <div style={{ marginTop: '16px' }}>
          <Input
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onPressEnter={handleSendMessage}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default Chatbot;