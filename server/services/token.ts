import { Service } from "typedi";
import { TokenModel } from "./../models/user";

@Service()
export class TokenService {
  private readonly tokenModel = TokenModel;
  async getByToken(t: string) {
    const token = this.tokenModel.findOne({ token: t }).populate("_userId");
    if (token) return token;
    else null;
  }
}
