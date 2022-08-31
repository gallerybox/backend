import { Test } from '@nestjs/testing';
import {UsersService} from "./users.service";
import {UsersController} from "./users.controller";
import {Users} from "./schema/users.schema";
import {Document, ObjectId, } from "mongoose";

import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import {UsersRepository} from "./users.repository";


jest.mock("./users.service");
const moduleMocker = new ModuleMocker(global);

describe('UsersConstroller', () => {
    let usersService: UsersService;
    let usersController: UsersController;


    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
                controllers: [UsersController],
                providers: [UsersService],
            }
        ).useMocker((token) => {
            if(token===UsersService){
                const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
                const Mock = moduleMocker.generateFromMetadata(mockMetadata);
                return new Mock();
            }
            if (token==UsersRepository){

            }

        }).compile();

        usersService = moduleRef.get<UsersService>(UsersService);
        usersController = moduleRef.get<UsersController>(UsersController);
    })

    describe('findOneById', () => {
        it('It shoould return a user', async () => {
            const result = {
                "_id": "TEST_ID",
                "nombre": 'Juan Carlos'
            } as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>
            jest.spyOn(usersService, 'findOneById').mockImplementation(() =>{
                    return result
                }
            );

            expect(await usersController.findOneById("TEST_ID")).toBe(result);
        });
    });
});