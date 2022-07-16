import {InjectModel} from "@nestjs/mongoose";
import {ShittyModel, ShittyModelDocument} from "../models/ShittyModel";
import {Document, FilterQuery, Model, Types} from "mongoose";
import {AbstractDocument} from "./AbstractDocument";

export abstract class GenericRepository<M extends AbstractDocument> {

    constructor( private readonly model: Model<M>) {

    }

    find(query: FilterQuery<M>): Promise<M[]>{
        return this.model.find(query).exec();
    }

    async add(instance: M): Promise<M>{
        console.log("DEBAAAAAAAAAAG")
        console.log(instance._id)
        if (instance._id == null) {
            instance._id = new Types.ObjectId();
            console.log("DEBUUUUUUUG")
            console.log(instance._id)
        }
        return this.model.findOneAndUpdate(
            { _id: instance._id },
            instance,
            { new: true, upsert: true }
        );
    }
}
