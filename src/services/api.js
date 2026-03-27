import appConfig from '../config/appConfig';

let impl = null;
if (appConfig.useMock) {
  impl = require('./mockApi').default;
} else {
  impl = require('./firebaseApi').default;
}

export const fetchEvents = (...args) => impl.fetchEvents(...args);
export const fetchNews = (...args) => impl.fetchNews(...args);
export const getMember = (...args) => impl.getMember(...args);
export const signUpForEvent = (...args) => impl.signUpForEvent(...args);
export const getWalletBalance = (...args) => impl.getWalletBalance(...args);
export const getMemberSignups = (...args) => impl.getMemberSignups(...args);
export const cancelSignUp = (...args) => impl.cancelSignUp(...args);
export const topUp = (...args) => impl.topUp(...args);
export const updateMember = (...args) => impl.updateMember && impl.updateMember(...args);

export default impl;
