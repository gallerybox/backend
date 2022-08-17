import { Body, Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { AttributeService } from './attribute.service';

@Controller('attribute')
export class AttributeController {

    constructor(
        private readonly attributeService: AttributeService
    ){ }
    
    @Get("create/:thematicSpaceId")
    async createAttribute(
        @Req() request: Request,
        @Param('thematicSpaceId') thematicSpaceId: string
    ){
        return await this.attributeService.create(request.body, thematicSpaceId);
    }

    @Delete("delete/:tag")
    async deleteAttribute(
        @Param('tag') tag: string
    ){
        return await this.attributeService.delete(tag);
    }
}
