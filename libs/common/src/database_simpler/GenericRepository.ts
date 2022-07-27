
import {FilterQuery, Model, Types} from "mongoose";
import {AbstractDocument} from "./AbstractDocument";

export abstract class GenericRepository<M extends AbstractDocument> {

    protected constructor( 
        private readonly model: Model<M>
    ) { }

    // Método Jesús
    find(query: FilterQuery<M>): Promise<M[]>{
        return this.model.find(query).exec();
        this.model.aggregate()
    }

    // Método Jesús
    add(instance: M): Promise<M>{
        if (instance._id == null) {
            instance._id = new Types.ObjectId();
        }
        return this.model.findOneAndUpdate(
            { _id: instance._id },
            instance,
            { new: true, upsert: true }
        ).exec();
    }
}
