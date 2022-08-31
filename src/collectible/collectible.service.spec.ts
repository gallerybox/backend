import { Test } from '@nestjs/testing';
import {Document, ObjectId, } from "mongoose";

import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import {CollectibleService} from "./collectible.service";
import {CollectibleRepository} from "./repositories/collectible.repository";
import {ThematicSpacesService} from "../thematic-spaces/thematic-spaces.service";
import {FilesService} from "../files/files.service";
import {Collectible} from "./models/Collectible";
import {UsersService} from "../users/users.service";

jest.mock("./repositories/collectible.repository");
jest.mock("../files/files.service");
jest.mock("../thematic-spaces/thematic-spaces.service");
jest.mock("../users/users.service");

const moduleMocker = new ModuleMocker(global);

describe('ThematicSpacesService', () => {
    let collectibleService: CollectibleService;
    let collectibleRepository: CollectibleRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
                controllers: [CollectibleService],
                providers: [CollectibleRepository,UsersService, ThematicSpacesService, FilesService],
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

    })

    describe('findOneById', () => {
        it('It shoould return a collectible', async () => {
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
});