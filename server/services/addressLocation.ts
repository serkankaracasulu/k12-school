import { Service } from "typedi";
import { AddressLocation } from "./../models/address";

@Service()
export class AddressLocationService {
  create(Latitude: number, Longitude: number): AddressLocation {
    return {
      type: "Point",
      coordinates: [Latitude, Longitude],
    };
  }
}
