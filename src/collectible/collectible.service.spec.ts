import { Test } from '@nestjs/testing';
import {Document, ObjectId, } from "mongoose";

import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { CollectibleService } from "./collectible.service";
import { CollectibleRepository } from "./repositories/collectible.repository";
import { ThematicSpacesService } from "../thematic-spaces/thematic-spaces.service";
import { FilesService } from "../files/files.service";
import { Collectible } from "./models/Collectible";
import { UsersService } from "../users/users.service";
import { Users } from '../users/schema/users.schema';
import { ThematicSpace } from '../thematic-spaces/models/ThematicSpace';
import { Template } from '../thematic-spaces/models/Template';
import { Attribute } from '../thematic-spaces/models/Attribute';
import { Category, Representation, TextRepresentation, Type } from '../thematic-spaces/models/Type';
import { DynamicType } from './models/DynamicType';

jest.mock("./repositories/collectible.repository");
jest.mock("../files/files.service");
jest.mock("../thematic-spaces/thematic-spaces.service");
jest.mock("../users/users.service");

const moduleMocker = new ModuleMocker(global);

describe('ThematicSpacesService', () => {
    let collectibleService: CollectibleService;
    let collectibleRepository: CollectibleRepository;
    
    let usersService: UsersService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
                controllers: [CollectibleService],
                providers: [CollectibleRepository, UsersService, ThematicSpacesService, FilesService],
            }
        ).useMocker((token) => {
            if(token===CollectibleRepository || token===ThematicSpacesService || token===FilesService || token===UsersService){
                const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
                const Mock = moduleMocker.generateFromMetadata(mockMetadata);
                return new Mock();
            }
        }).compile();

        collectibleRepository = moduleRef.get<CollectibleRepository>(CollectibleRepository);
        collectibleService = moduleRef.get<CollectibleService>(CollectibleService);

        usersService = moduleRef.get<UsersService>(UsersService);

    })

    // Create
    describe('create', () => {
        it('It should create a new collectible', async() => {
            // let user = new Users();

            // let thematicSpace = new ThematicSpace();
            // thematicSpace.template = new Template();

            // let attribute = new Attribute();
            // attribute.representationOrder=1;
            // attribute.showTag = true;
            // attribute.showInReducedView = true;
            // attribute.tag = "MyTag"
            // attribute.type = new Type();
            // attribute.type.category = Category.Text;
            // attribute.type.representation = new TextRepresentation();

            // thematicSpace.template.attributes = [];
            // thematicSpace.template.attributes.push(attribute);

            // let resultCollectible = new Collectible(user as unknown as Users, thematicSpace, null);
            // resultCollectible.name = "Mi coleccionable de prueba";
            // resultCollectible.thematicSpace = thematicSpace;
            // resultCollectible.user = user;
            // resultCollectible.attributes = new Map<string, DynamicType>();
            // let myValue: DynamicType = {
            //     category: Category.Text,
            //     representationOrder: 1,
            //     showTag: true,
            //     showInReducedView: true,
            //     value: "Valor del tag",
            //     representation: {
            //         bold: true,
            //         font: '"Roboto"',
            //         color: '#111111',
            //         italics: true,
            //         underlined: false,
            //         size: 20
            //     },

            //     represent: () => 0
            // }

            // resultCollectible.attributes.set("MyTag", myValue);
            
            // console.log(resultCollectible.attributes.values())


            // jest.spyOn(usersService, 'findOneById').mockImplementation(() => 
            //     user as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>);
            // jest.spyOn(collectibleRepository, 'findOne').mockImplementation(() => 
            //     resultCollectible as unknown as Promise<Collectible>
            // )
            // jest.spyOn(collectibleRepository, 'add').mockImplementation(() => 
            //     resultCollectible as unknown as Promise<Collectible>
            // )
            // jest.spyOn(usersService, 'upsert').mockImplementation(() => 
            //     user as unknown as  Promise<Users>
            // );

            // expect(await collectibleService.create("TEST_ID", null)).toBe(resultCollectible);
        });
    });
    
    // FindAllByThematicSpace

    describe('findOne', () => {
        it('It should return a collectible', async () => {
            const result = {
                "_id": "TEST_ID",
                "nombre": 'Collectible de juan'
            } as unknown as Promise<Document<unknown, any, Collectible> & Collectible & Required<{ _id: ObjectId; }>>
            jest.spyOn(collectibleRepository, 'getOnePopulate').mockImplementation(() =>{
                    return result
                }
            );

            expect(await collectibleService.findOne("TEST_ID")).toBe(result);
        });
    });

    // GetTimeline
    // getTimelineByThematicSpaceId
    // Update
    // Remove
});