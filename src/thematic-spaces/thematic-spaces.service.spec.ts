import { Test } from '@nestjs/testing';
import {Document, ObjectId, } from "mongoose";

import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import {ThematicSpacesService} from "./thematic-spaces.service";
import {ThematicSpaceRepository} from "./repositories/thematic-spaces.repository";
import {UsersService} from "../users/users.service";
import {ThematicSpace} from "./models/ThematicSpace";
import { Users } from '../users/schema/users.schema';
import { UpdateUsersDto } from '../users/dto/update-users.dto';


jest.mock("../users/users.service");
const moduleMocker = new ModuleMocker(global);
jest.mock("./repositories/thematic-spaces.repository");

describe('ThematicSpacesService', () => {
    let thematicSpacesService: ThematicSpacesService;
    let thematicSpaceRepository: ThematicSpaceRepository;
    let usersService: UsersService;

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
        usersService = moduleRef.get<UsersService>(UsersService);


    })


    describe('followSpaceByUserId', () => {
        it('It should return a user with a new space followed', async () => {
            const result = {
                "_id": "USER_ID",
                "nombre": "Espacio de Juan",
            } as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>

            jest.spyOn(usersService, 'update').mockImplementation(() => result );
            jest.spyOn(usersService, 'findOneById').mockImplementation( () => {
                return {
                    _id: "USER_ID",
                    
                    ownedThematicSpaces: [
                        { _id: "THEMATIC_SPACE_ID_2" }
                    ],
                    followedThematicSpaces: [
                        { _id: "THEMATIC_SPACE_ID_3" }
                    ]
                } as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>
            });
            jest.spyOn(usersService, 'getUpdateDTO').mockImplementation( () => {
                let updateUserDTO = new UpdateUsersDto();
                updateUserDTO.followedThematicSpaces = [];
                return updateUserDTO as unknown as Promise<UpdateUsersDto>
                } 
            );

            expect(await thematicSpacesService.followSpaceByUserId("USER_ID", "THEMATIC_SPACE_ID")).toBe(result);

        })


    describe('create', () => {
        it('It should return a new thematic-space', async() => {
            const thematicSpace = new ThematicSpace();
            thematicSpace.description = "Esta es una colección de ejemplo";
            thematicSpace.name = "Colección de ejemplo";
            thematicSpace.template = {
                attributes: []
            };

            const result = {
                "_id": "USER_ID",
                "nombre": "Espacio temático de ejemplo",
                "description": "Esto es un espacio temático de ejemplo",
            } as unknown as Promise<ThematicSpace>

            jest.spyOn(thematicSpaceRepository, 'add').mockImplementation(() => result );

            expect(await thematicSpacesService.create(thematicSpace)).toBe(result);
        });
    });


    describe('findOneById', () => {
        it('It should return a space', async () => {
            const result = {
                "_id": "TEST_ID",
                "nombre": 'Espacio de juan'
            } as unknown as Promise<Document<unknown, any, ThematicSpace> & ThematicSpace & Required<{ _id: ObjectId; }>>

            jest.spyOn(thematicSpaceRepository, 'findOne').mockImplementation(() =>         result);
            
            expect(await thematicSpacesService.findOneById("TEST_ID")).toBe(result);
        });
    });

    describe('findOneByName', () => {
        it('It should return a space', async () => {
            const result = {
                "_id": "TEST_ID",
                "nombre": 'Espacio de juan'
            } as unknown as Promise<Document<unknown, any, ThematicSpace> & ThematicSpace & Required<{ _id: ObjectId; }>>

            jest.spyOn(thematicSpaceRepository, 'findOne').mockImplementation(() =>         result);
            
            expect(await thematicSpacesService.findOneById("TEST_ID")).toBe(result);
        });
    });

    describe('update', () => {
        it('It should return an updated thematic-space', async() => {
            const thematicSpace = new ThematicSpace();
            thematicSpace.description = "Esta es una colección de ejemplo";
            thematicSpace.name = "Colección de ejemplo";
            thematicSpace.template = {
                attributes: []
            };

            const result = {
                "_id": "USER_ID",
                "nombre": "Espacio temático de ejemplo",
                "description": "Esto es un espacio temático de ejemplo",
            } as unknown as Promise<Document<unknown, any, ThematicSpace> & ThematicSpace  & Required<{ _id: ObjectId; }>>


            jest.spyOn(thematicSpaceRepository, 'findOneAndUpdate').mockImplementation(() => result );

            expect(await thematicSpacesService.update("USER_ID", thematicSpace)).toBe(result);
        });
    });

    });

});