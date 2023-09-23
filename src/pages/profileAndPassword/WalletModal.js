import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, InputNumber } from "antd";


export default function WalletModal(props) {
    const [selectedBankAccountId, setSelectedBankAccountId] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const handleRadioChange = (e) => {
        setSelectedBankAccountId(e.target.value);
      };

      useEffect(() => {
        // Check if a bank account is selected
        if (selectedBankAccountId) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [selectedBankAccountId]);

      const onFinish = (formValues) => {
        // formValues contains the form data
        // selectedBankAccountId contains the selected bank account ID
        props.onClickSubmitButton({ ...formValues, selectedBankAccountId });
      };

    return(
        <div>
            <Modal
                title={props.title}
                centered
                open={props.isModalOpen}
                onCancel={props.onClickCancelButton}
                footer={[]} // hide default buttons of modal
            >
                <Form 
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={onFinish}
                >
                    <Form.Item
                    label="Amount"
                    labelAlign="left"
                    name="amount"
                    rules={[{ required: true, message: 'Please enter the amount' }]}
                    >
                    <InputNumber
          min={0}
          step={0.01}
          precision={2}
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}

        />
                    </Form.Item>

        

                    <ul>
                        
  {props.bankAccounts && props.bankAccounts.length > 0 ? (
    props.bankAccounts.map((account) => (
      <li key={account.id} style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="radio"
          name="selectedBankAccount"
          value={account.id}
          checked={selectedBankAccountId === account.id}
          onChange={handleRadioChange}
          style={{ marginRight: '10px' }}
        />
        Bank Account Number: *****{account.last4}
       
      </li>
    ))
  ) : (
    <li>No bank accounts available.</li>
  )}
</ul>
   

                   

                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                        <Button type="primary" htmlType="submit" disabled={!isFormValid}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}