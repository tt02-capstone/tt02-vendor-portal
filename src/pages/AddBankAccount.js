import React, { useState } from 'react';
import { loadStripe, useStripe  } from '@stripe/stripe-js';


const AddBankAccount = () => {
    const stripe = useStripe();
  const [formData, setFormData] = useState({
    account_holder_name: '',
    account_holder_type: '',
    routing_number: '',
    account_number: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //const stripe = await loadStripe('your-publishable-key-here'); // Replace with your Stripe public key

    const token = await stripe.tokens.create({
      bank_account: {
        country: 'SG',
        currency: 'sgd',
        account_holder_name: formData.account_holder_name,
        account_holder_type: formData.account_holder_type,
        routing_number: formData.routing_number,
        account_number: formData.account_number,
      },
    });

    console.log('Stripe Token:', token);
  };

  return (
    <div>
      <h1>Add Bank Account</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Account Holder Name:
          <input
            type="text"
            name="account_holder_name"
            value={formData.account_holder_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Account Holder Type:
          <select
            name="account_holder_type"
            value={formData.account_holder_type}
            onChange={handleChange}
          >
            <option value="">Select type</option>
            <option value="individual">Individual</option>
            <option value="company">Company</option>
          </select>
        </label>
        <label>
          Routing Number:
          <input
            type="text"
            name="routing_number"
            value={formData.routing_number}
            onChange={handleChange}
          />
        </label>
        <label>
          Account Number:
          <input
            type="text"
            name="account_number"
            value={formData.account_number}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Add Bank Account</button>
      </form>
    </div>
  );
};

export default AddBankAccount;
