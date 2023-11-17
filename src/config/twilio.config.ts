export default () => ({
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    serviceSid: process.env.TWILIO_VERIFICATION_SERVICE_SID,
  },
});
