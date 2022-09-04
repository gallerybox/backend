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
            let user = new Users();

            let thematicSpace = new ThematicSpace();
            thematicSpace.template = new Template();

            let attribute = new Attribute();
            attribute.representationOrder=1;
            attribute.showTag = true;
            attribute.showInReducedView = true;
            attribute.tag = "MyTag"
            attribute.type = new Type();
            attribute.type.category = Category.Text;
            attribute.type.representation = new TextRepresentation();

            thematicSpace.template.attributes = [];
            thematicSpace.template.attributes.push(attribute);

            let values = { 
                "MyTag": "Valor del tag" 
            };
            

            let resultCollectible = new Collectible(user as unknown as Users, thematicSpace, values);
            resultCollectible.name = "Mi coleccionable de prueba";
            resultCollectible.thematicSpace = thematicSpace;
            resultCollectible.user = user;
            resultCollectible.attributes = new Map<string, DynamicType>();
            let myValue: DynamicType = {
                category: Category.Text,
                representationOrder: 1,
                showTag: true,
                showInReducedView: true,
                value: "Valor del tag",
                representation: {
                    bold: true,
                    font: '"Roboto"',
                    color: '#111111',
                    italics: true,
                    underlined: false,
                    size: 20
                },

                represent: () => 0
            }

            resultCollectible.attributes.set("MyTag", myValue);
            
            console.log(resultCollectible.attributes.values())


            jest.spyOn(usersService, 'findOneById').mockImplementation(() => 
                user as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>);
            jest.spyOn(collectibleRepository, 'findOne').mockImplementation(() => 
                resultCollectible as unknown as Promise<Collectible>
            )
            jest.spyOn(collectibleRepository, 'add').mockImplementation(() => 
                resultCollectible as unknown as Promise<Collectible>
            )
            jest.spyOn(usersService, 'upsert').mockImplementation(() => 
                user as unknown as  Promise<Users>
            );

            let body = {
                thematicSpaceId: "THEMATIC_SPACE_ID",
                collectibleId: "COLLECTIBLE_ID",
                userId: "USER_ID"
            }
            expect(await collectibleService.create(body, null)).toBe(resultCollectible);
        });
    });

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

        
    describe('getTimeline', () => {
        it('It should return timeline from user', async () =>  {
            let resultUser = new Users();

            jest.spyOn(usersService, 'findOneById').mockImplementation(() =>{
                return resultUser as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>
            });

            jest.spyOn(collectibleRepository, 'getTimeline').mockImplementation(() =>{
                return resultUser as unknown as Promise<Omit<Omit<Document<unknown, any, Collectible> & Collectible & Required<{ _id: ObjectId; }>, never>, never>[]>
            });

            expect(await collectibleService.getTimeline("USER_ID")).toBe(resultUser);
        });
    }); 

    describe('getTimelineByThematicSpaceId', () => {
        it('It should return timeline by thematicSpace', async () =>  {
            let resultUser = new Users();

            jest.spyOn(collectibleRepository, 'getTimelineByThematicSpaceId').mockImplementation(() =>{
                return resultUser as unknown as Promise<Omit<Omit<Document<unknown, any, Collectible> & Collectible & Required<{ _id: ObjectId; }>, never>, never>[]>
            });
            expect(await collectibleService.getTimelineByThematicSpaceId("THEMATIC_SPACE_ID")).toBe(resultUser);
        });
    }); 
    
    describe('update', () => {
        it('It should update a collectible', async () =>  {
            let user = new Users();
            let thematicSpace = new ThematicSpace();

            thematicSpace.template = new Template();

            let attribute = new Attribute();
            attribute.representationOrder=1;
            attribute.showTag = true;
            attribute.showInReducedView = true;
            attribute.tag = "MyTag"
            attribute.type = new Type();
            attribute.type.category = Category.Text;
            attribute.type.representation = new TextRepresentation();

            thematicSpace.template.attributes = [];
            thematicSpace.template.attributes.push(attribute);

            let values = { 
                "MyTag": "Valor del tag" 
            };

            let resultCollectible = new Collectible(user, thematicSpace, values);

            jest.spyOn(collectibleRepository, 'add').mockImplementation(() =>{
                return resultCollectible as unknown as Promise<Collectible>
            });

            expect(await collectibleService.update(resultCollectible)).toBe(resultCollectible);
        });
    });
});