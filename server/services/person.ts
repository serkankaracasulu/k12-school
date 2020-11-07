import { Service } from "typedi";
import { PersonModel, Person, PersonKind } from "../models/person";
import dataLoader from "../dataLoaders";
import { ApolloError } from "apollo-server";
import { writeFile, mkdirSync, existsSync } from "fs";
import { BuildPath } from "./../helper/BuildPath";
import generatePassword from "../helper/generatePassword";
import { ObjectId } from "mongodb";
import { CreateType } from "../types";

@Service()
export class PersonService {
  private readonly personModel = PersonModel;
  protected readonly dataLoader = dataLoader();

  public get errorPerson(): Person {
    return {
      _id: new ObjectId(),
      firstName: "hatalı",
      lastName: "hatalı kullanıcı",
      fullName: "hatalı kullanıcı",
      createdAt: new Date(),
      roles: [],
      kind: PersonKind.user,
      password: "",
    };
  }

  async createPerson(firstName: string, lastName: string) {
    try {
      const person = new Person(firstName, lastName);
      return await (
        await this.personModel.create({
          ...person,
          password: generatePassword(),
        })
      ).save();
    } catch (error) {
      console.log(error);
    }
  }
  async getByEmail(email: string) {
    return await this.personModel.findOne({ email });
  }
  async getById(id: ObjectId) {
    return await this.dataLoader.personLoader.load(id);
  }

  async updatePhoto(photo64: string, userId: ObjectId, pathC: BuildPath) {
    if (photo64.length > 102400)
      throw new ApolloError(
        "Profile photo can not be larger than 100kb",
        "413"
      );
    const base64Data = photo64
      .replace(/^data:image\/png;base64,/, "")
      .replace(/^data:image\/jpeg;base64,/, "");
    const imagePath = pathC.profilesPath;
    const file = pathC.getProfilePath(userId.toHexString());
    let result = false;
    await new Promise((res, rej) => {
      if (!existsSync(imagePath)) {
        mkdirSync(imagePath);
      }
      writeFile(file, base64Data, "base64", function (err) {
        console.log("hata", err);
        if (err) rej(err);
        else {
          result = true;
          res();
        }
      });
    });
    if (result)
      await this.personModel.updateOne({ _id: userId }, { profilePhoto: true });
    return result;
  }

  async isExistByEmail(email: string) {
    const user = await this.personModel.findOne({ email: email }, { _id: 1 });
    if (user) return true;
    return false;
  }
  async isExistById(id: ObjectId) {
    const user = await this.personModel.findOne({ _id: id }, { _id: 1 });
    if (user) return true;
    return false;
  }
  async getManyById(ids: ObjectId[]) {
    return await this.personModel.find({ _id: { $in: ids } });
  }
  async resetPassword(userId: ObjectId) {
    const password = generatePassword();
    const person = await this.personModel.findOne({
      _id: userId,
    });
    if (person) {
      person.password = password;
      await person.save();
      return password;
    } else throw new ApolloError("Student didn't find");
  }
  async changePassword(password: string, id: ObjectId) {
    const person = await this.personModel.findById(id);
    if (!person) throw new Error("User didn't find");
    person.password = password;
    try {
      await person.save();
    } catch (error) {
      return false;
    }
    return true;
  }
}
