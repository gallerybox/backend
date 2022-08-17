import { Injectable } from '@nestjs/common';
import { Attribute } from 'src/thematic-spaces/models/Attribute';
import { ThematicSpace } from 'src/thematic-spaces/models/ThematicSpace';
import { ThematicSpacesService } from 'src/thematic-spaces/thematic-spaces.service';

@Injectable()
export class AttributeService {

    constructor(
        private readonly thematicSpaceService: ThematicSpacesService
    ) {}

    async create(body: Attribute, thematicSpaceId: string) {
        let thematicSpace: ThematicSpace;
        let newAttribute: Attribute = body; // Si no cumple con la especificación, se omite

        // Paso 1: buscamos el ThematicSpace en la base de datos
        thematicSpace = await this.thematicSpaceService.findOneById(thematicSpaceId);

        // Paso 2: el orden en el que aparece este nuevo Attribute será la última posición
        newAttribute.representationOrder = Math.max(...thematicSpace.template.attributes.map(attr => attr.representationOrder)) + 1;

        // Paso 3: meter en la plantilla el json obtenido
        thematicSpace.template.attributes.push(newAttribute);

        // Paso 4: actualizar el thematicSpace
        return await this.thematicSpaceService.update(thematicSpaceId, thematicSpace);
    }

    async delete(tag: string) {
        return await this.thematicSpaceService.removeByTag(tag);
    }
}
