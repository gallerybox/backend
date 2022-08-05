import {DynamicType, Value} from "./DynamicType"
import {Multimedia} from "./Multimedia"
import {Text} from "./Text"
import {Toggle} from "./Toggle"
import {Template} from "../../thematic-spaces/models/Template";
import {Prop, Schema, raw, SchemaFactory} from "@nestjs/mongoose";
import * as mongoose from "mongoose"
import {ThematicSpace} from "../../thematic-spaces/models/ThematicSpace";
import {Users} from "../../users/schema/users.schema";
import autoMockOn = jest.autoMockOn;
import { AbstractDocument } from "@app/common";

// TODO: añadido por Utri
export type CollectibleDocument = Collectible & Document;

@Schema()
export class Collectible extends AbstractDocument{
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Users'})
    user: Users;

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

    constructor(
        user: Users,
        thematicSpace: ThematicSpace,
        values: { [tag: string]: Value }) 
    {
        super();

        // Visualización de los datos que se reciben como parámetro (Pendiente de borrar)
        console.log(user);
        console.log(thematicSpace);
        console.log(values);

        this.user = user;
        this.thematicSpace = thematicSpace;                     // Se asigna el thematicSpace recibido en el modelo
        
        this.attributes = new Map<string, DynamicType>();       // Inicializamos los attributes en el modelo

        let template: Template = thematicSpace.template;        // Extraemos la template del thematicSpace
        
        for(let attribute of template.attributes){              // Por cada attribute definido en la template...

            // Creamos el nuevo type  (contiene la Category (Text, Multimedia, Toggle), su valor y la representación
            // que tendrá en la pantalla).
            // Ej. Collectible Cerveza --> Attribute: Graduación (Category: Text, valor: 6, representación: {negrita: true, color: #443234})
            let type: DynamicType = new this.constructors[attribute.type.category](attribute.type, values[attribute.tag]);

            this.attributes.set(attribute.tag, type);           // Asignamos el nuevo type, asignandole el tag (identificador) correspondiente
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