import React from 'react';

const BankAccountForm = ({ bankAccount, onChange, isReadOnly = false }) => {
  return (
    <form>
      <input
        type="text"
        name="country"
        placeholder="Country"
        value={bankAccount.country}
        onChange={onChange}
        readOnly={isReadOnly}
      />
      <input
        type="text"
        name="currency"
        placeholder="Currency"
        value={bankAccount.currency}
        onChange={onChange}
        readOnly={isReadOnly}
      />
      <input
        type="text"
        name="account_holder_name"
        placeholder="Account Holder Name"
        value={bankAccount.account_holder_name}
        onChange={onChange}
        readOnly={isReadOnly}
      />
      <input
        type="text"
        name="account_holder_type"
        placeholder="Account Holder Type"
        value={bankAccount.account_holder_type}
        onChange={onChange}
        readOnly={isReadOnly}
      />
      <input
        type="text"
        name="routing_number"
        placeholder="Routing Number"
        value={bankAccount.routing_number}
        onChange={onChange}
        readOnly={isReadOnly}
      />
      <input
        type="text"
        name="account_number"
        placeholder="Account Number"
        value={bankAccount.account_number}
        onChange={onChange}
        readOnly={isReadOnly}
      />
      {!isReadOnly && <button type="submit">Submit</button>}
    </form>
  );
};

export default BankAccountForm;
