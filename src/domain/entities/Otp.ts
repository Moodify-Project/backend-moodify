import { generateOtp } from "../../utils/generateRandom";

export class OTP {
  constructor() {}

  getNewOtp = (digit: number, ttlMinute: number) => {
    return generateOtp(digit);
  };
}
