import { Test } from '@nestjs/testing';
import {Document, ObjectId, } from "mongoose";

import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';


import {FilesService} from "../files/files.service";
import {MailService} from "../mail/mail.service";
import {ThematicSpacesService} from "./thematic-spaces.service";
import {ThematicSpaceRepository} from "./repositories/thematic-spaces.repository";
import {UsersService} from "../users/users.service";
import {ThematicSpace} from "./models/ThematicSpace";


jest.mock("../users/users.service");
jest.mock("./repositories/thematic-spaces.repository");
const moduleMocker = new ModuleMocker(global);

describe('ThematicSpacesService', () => {
    let thematicSpacesService: ThematicSpacesService;
    let thematicSpaceRepository: ThematicSpaceRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
                controllers: [ThematicSpacesService],
                providers: [ThematicSpaceRepository, UsersService],
            }
        ).useMocker((token) => {
            if(token===ThematicSpaceRepository || token===UsersService){
                const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
                const Mock = moduleMocker.generateFromMetadata(mockMetadata);
                return new Mock();
            }


        }).compile();


        thematicSpaceRepository = moduleRef.get<ThematicSpaceRepository>(ThematicSpaceRepository);
        thematicSpacesService = moduleRef.get<ThematicSpacesService>(ThematicSpacesService);

    })

    describe('findOneById', () => {
        it('It shoould return a space', async () => {
            const result = {
                "_id": "TEST_ID",
                "nombre": 'Espacio de juan'
            } as unknown as Promise<Document<unknown, any, ThematicSpace> & ThematicSpace & Required<{ _id: ObjectId; }>>
            jest.spyOn(thematicSpaceRepository, 'findOne').mockImplementation(() =>{
                    return result
                }
            );

            expect(await thematicSpacesService.findOneById("TEST_ID")).toBe(result);
        });
    });
});