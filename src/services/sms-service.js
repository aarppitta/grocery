import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: "ap-south-1" });
const SMS_SERVICE_URL = process.env.SMS_SERVICE_URL;
const AUTH_KEY = process.env.AUTH_KEY;
const SMS_OTP_TEMPLATE_ID = process.env.SMS_OTP_TEMPLATE_ID;

class SMSService {
  async send(type, mobile, otp) {
    try {
      if (process.env.NODE_ENV === "test") {
        const response = await axios.post(`${SMS_SERVICE_URL}?template_id=${SMS_OTP_TEMPLATE_ID}&mobile=91${mobile}&invisible=0&otp=${otp}`, null, {
          headers: {
            accept: "application/json",
            authkey: AUTH_KEY,
            "content-type": "application/json",
          },
        });
        return response.data;
        console.log("Success, message sent. MessageID:", response.MessageId);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default SMSService;
