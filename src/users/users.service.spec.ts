import { Test } from '@nestjs/testing';
import {UsersService} from "./users.service";
import {UsersController} from "./users.controller";
import {Users} from "./schema/users.schema";
import {Document, ObjectId, } from "mongoose";

import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import {UsersRepository} from "./users.repository";
import {FilesService} from "../files/files.service";
import {MailService} from "../mail/mail.service";


jest.mock("./users.repository");
jest.mock("../files/files.service");
jest.mock("../mail/mail.service");
const moduleMocker = new ModuleMocker(global);

describe('UsersService', () => {
    let usersService: UsersService;
    let usersRepository: UsersRepository;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
                controllers: [UsersService],
                providers: [UsersRepository, FilesService,MailService],
            }
        ).useMocker((token) => {
            if(token===UsersRepository || token===FilesService || token===MailService){
                const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
                const Mock = moduleMocker.generateFromMetadata(mockMetadata);
                return new Mock();
            }

        }).compile();


        usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
        usersService = moduleRef.get<UsersService>(UsersService);

    })

    describe('findOneById', () => {
        it('It shoould return a user', async () => {
            const result = {
                "_id": "TEST_ID",
                "nombre": 'Juan Carlos'
            } as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>
            jest.spyOn(usersRepository, 'getUserByIdCollectionsPopulate').mockImplementation(() =>{
                    return result
                }
            );

            expect(await usersService.findOneById("TEST_ID")).toBe(result);
        });
    });
});