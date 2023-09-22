export const validatePassword = (_, value) => {
    if (value.length < 8) {
      return Promise.reject('Password must be at least 8 characters long');
    }

    if (!/[a-zA-Z]/.test(value)) {
      return Promise.reject('Password must contain at least one alphabet character');
    }

    if (!/[!@#$%^&*()_+[\]{};':"\\|,.<>?`~]/.test(value)) {
      return Promise.reject('Password must contain at least one special character');
    }

    return Promise.resolve();
};

export const validateCountryCode = (rule, value) => {
    const regex = /^\+\d+$/;
    if (!regex.test(value)) {
    return Promise.reject('Please enter a valid country code (e.g., "+65")');
    }
    return Promise.resolve();
};

export const validateContactNo = (rule, value) => {
    const regex = /^[0-9]*$/;
    if (!regex.test(value)) {
    return Promise.reject('Contact no should contain numbers only');
    }
    return Promise.resolve();
};

export const validateOnlyAlphabets = (rule, value) => {
    const regex = /^[A-Za-z ]+$/;
    if (!regex.test(value)) {
    return Promise.reject('Field should contain letters only');
    }
    return Promise.resolve();
};