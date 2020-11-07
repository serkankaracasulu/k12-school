import { Resolver, Ctx, Arg, Int, Query, Authorized } from "type-graphql";
import { Context } from "apollo-server-core";
import { Il } from "../models/ilIlce";
import { CContext } from "../types";
import { AuthenticationError } from "apollo-server-core";
import { IlService } from "./../services/il";
import { Container } from "typedi";
import { IlceService } from "./../services/ilce";

Resolver();
export class IlResolver {
  constructor(
    private readonly ilService: IlService,
    private readonly ilceService: IlceService
  ) {
    this.ilService = Container.get(IlService);
    this.ilceService = Container.get(IlceService);
  }
  @Authorized()
  @Query(() => [Il])
  async ils(
    @Ctx() ctx: Context<CContext>,
    @Arg("query") query: string
  ): Promise<Il[]> {
    const { activeUser } = ctx;
    if (!activeUser) throw new AuthenticationError("");
    return await this.ilService.getByText(query);
  }
  @Authorized()
  @Query(() => [String])
  async ilces(
    @Ctx() ctx: Context<CContext>,
    @Arg("plaka", () => Int) plaka: number
  ): Promise<string[]> {
    const { activeUser } = ctx;
    if (!activeUser || !activeUser.teacher?.institutionId)
      throw new AuthenticationError("");
    const ilce = await this.ilceService.getByPlaka(plaka);
    return ilce || [];
  }
}
