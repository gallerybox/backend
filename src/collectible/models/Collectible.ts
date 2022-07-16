import {DynamicType} from "./DynamicType"
import {Multimedia} from "./Multimedia"
import {Template} from "../../tematic-spaces/models/Template";
import {Prop, Schema} from "@nestjs/mongoose";
import {Representation} from "../../tematic-spaces/models/Type";
import * as mongoose from "mongoose"

@Schema()
export class Collectible {

    // TODO: revisar esto, parece que la documentación oficial de la relaciones podría no ser del todo correcta.
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Template' })
    template: Template;

    @Prop()
    name: String;

    @Prop()
    attributes: Map<string, DynamicType>;


    constructors: any = {
        Multimedia
    };


    constructor(template: Template) {
        this.template = template;
        this.attributes = new Map<string, DynamicType>();
        for(let attribute of this.template.attributes){
            // TODO: ordenar por tipos
            // Example without transpilation "Multimedia(attribute.type);"
            //let dynamic_type = Object.create(global[attribute.type.category].prototype);
            //dynamic_type.constructor.apply(dynamic_type, attribute.type);

            //let str_js_constructor: string = ts.transpile("multimedia" + "("+"attribute.type"+");");
            //let Constructor: Function = new Function(str_js_constructor);

            console.log("Hola")
            //Constructor()
            let type: DynamicType = new this.constructors[attribute.type.category](attribute.type);
            this.attributes.set(attribute.tag, type);

        }
    }
    save(){

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