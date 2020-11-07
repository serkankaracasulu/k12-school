import { Resolver, Mutation, Ctx, Arg, Query, Authorized } from "type-graphql";
import { Upload, ObjectIdScalar } from "./types";
import { Context, AuthenticationError, ApolloError } from "apollo-server-core";
import models from "../models";
import { createWriteStream } from "fs";
import { University } from "../models/university";
import { GraphQLUpload } from "graphql-upload";
import { CContext } from "../types";
import { Role } from "../models/person";
import { UnivercityService } from "../services/university";
import { Container } from "typedi";
import { ObjectId } from "mongodb";

const { model } = models;
Resolver();
export class UniversityResolver {
  constructor(private readonly univercityService: UnivercityService) {
    this.univercityService = Container.get(UnivercityService);
  }
  @Authorized()
  @Query(() => [University])
  async universities(@Ctx() ctx: Context<CContext>): Promise<University[]> {
    return this.univercityService.getAll();
  }
  @Authorized(Role.SUPER_ADMIN)
  @Mutation(() => University)
  async editUniversity(
    @Arg("name") name: string,
    @Arg("_id", () => ObjectIdScalar, { nullable: true }) _id?: ObjectId,
    @Arg("universityLogoFile", () => GraphQLUpload, { nullable: true })
    universityLogoFile?: Promise<Upload>
  ): Promise<University | null> {
    let fileName = null;
    let univercity;
    try {
      if (universityLogoFile) {
        const { createReadStream, filename } = await universityLogoFile;
        const logoPath = this.univercityService.generateLogoPath(filename);
        fileName = filename;
        await new Promise((res) =>
          createReadStream().pipe(createWriteStream(logoPath)).on("close", res)
        );
      }
      const doc: Omit<University, "_id"> = { name };
      if (fileName) doc.universityLogoUrl = fileName;
      if (_id) univercity = await this.univercityService.update(doc, _id);
      else univercity = await this.univercityService.create(doc);
      if (univercity) return univercity;
      throw new ApolloError("Univercity didn't find");
    } catch (error) {
      throw error;
    }
  }
}
