import {DynamicType, Value} from "./DynamicType"
import {Multimedia} from "./Multimedia"
import {Text} from "./Text"
import {Toggle} from "./Toggle"
import {Template} from "../../tematic-spaces/models/Template";
import {Prop, Schema, raw, SchemaFactory} from "@nestjs/mongoose";
import {Representation} from "../../tematic-spaces/models/Type";
import * as mongoose from "mongoose"
import {AbstractDocument} from "@app/common/database_simpler/AbstractDocument";
import {ThematicSpace} from "../../tematic-spaces/models/ThematicSpace";

@Schema()
export class Collectible extends AbstractDocument{

    // TODO: revisar esto, parece que la documentación oficial de la relaciones podría no ser del todo correcta.
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ThematicSpace' })
    thematicSpace: ThematicSpace;

    @Prop()
    name: String;

    @Prop(raw({
    type: Map,
    of: mongoose.Schema.Types.Mixed
    }))
    attributes: Map<string, DynamicType>;


    constructors: any = {
        Multimedia,
        Text,
        Toggle
    };

    constructor(thematicSpace: ThematicSpace, values: { [tag: string]: Value }) {
        super();
        this.thematicSpace = thematicSpace;
        this.attributes = new Map<string, DynamicType>();
        let template: Template = thematicSpace.template;
        for(let attribute of template.attributes){
            // TODO: ordenar por tipos
            // Example without transpilation "Multimedia(attribute.type);"
            //let dynamic_type = Object.create(global[attribute.type.category].prototype);
            //dynamic_type.constructor.apply(dynamic_type, attribute.type);

            //let str_js_constructor: string = ts.transpile("multimedia" + "("+"attribute.type"+");");
            //let Constructor: Function = new Function(str_js_constructor);

            console.log("Hola")
            //Constructor()
            let type: DynamicType = new this.constructors[attribute.type.category](attribute.type, values[attribute.tag]);
            this.attributes.set(attribute.tag, type);

        }

    }
    save(){
        let repre: Array<any> = [];
        for (let [key, value] of Array.from(this.attributes.entries())) {
            repre.push({[key] : value.save()});
        }
        return repre;
    }
    represent(){
        let repre: Array<any> = [];
        for (let [key, value] of Array.from(this.attributes.entries())) {
            repre.push({[key] : value.represent()});
        }
        return repre;

    }
    save_attribute(attribute: string){

    }
    represent_attribute(attribute: string){

    }

}

export const CollectibleSchema = SchemaFactory.createForClass(Collectible);