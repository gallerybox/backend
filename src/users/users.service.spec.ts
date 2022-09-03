import { Test } from '@nestjs/testing';
import { UsersService } from "./users.service";
import { Collection, Users } from "./schema/users.schema";
import { Document, ObjectId } from "mongoose";

import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { UsersRepository } from "./users.repository";
import { FilesService } from "../files/files.service";
import { MailService } from "../mail/mail.service";
import { CreateUsersDto } from './dto/create-users.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateUsersDto } from './dto/update-users.dto';


jest.mock("./users.repository");
jest.mock("../files/files.service");
jest.mock("../mail/mail.service");
const moduleMocker = new ModuleMocker(global);

describe('UsersService', () => {
    let usersService: UsersService;
    let usersRepository: UsersRepository;

    let filesService: FilesService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
                controllers: [ UsersService ],
                providers: [ UsersRepository, FilesService, MailService ],
            }
        ).useMocker((token) => {
            if(token === UsersRepository || token === FilesService || token === MailService){
                const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
                const Mock = moduleMocker.generateFromMetadata(mockMetadata);
                return new Mock();
            }

        }).compile();


        usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
        usersService = moduleRef.get<UsersService>(UsersService);
        filesService = moduleRef.get<FilesService>(FilesService);

    })

    describe('create', () => {
        it('It should return a new user', async() => {
            const createUserDto = new CreateUsersDto();
            createUserDto.email = "usuariodepruena@gmail.com";

            const resultUserDb = new Users();
            resultUserDb.email = createUserDto.email;

            jest.spyOn(usersRepository, 'create').mockImplementation( () => resultUserDb as unknown as Promise<Users>);

            expect(await usersService.create(createUserDto)).toBe(resultUserDb);

        });
    });

    describe('createCollection', () => {
        it('It should return a new collection', async() => {
            const userResult = new Users()

            const createCollectionDto = new CreateCollectionDto();
            createCollectionDto.userId = "USER_ID";
            createCollectionDto.name = "Mi nueva colección";

            const collectionCreated = new Collection();
            collectionCreated.name = "Mi nueva colección";

            jest.spyOn(usersService, 'findOneById').mockImplementation(() => 
                userResult as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>
            );

            jest.spyOn(usersService, 'update').mockImplementation( () => 
                userResult as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>
            )

            expect(await usersService.createCollection(createCollectionDto)).toBe(userResult);

        })
    });

    describe('findAllByCollectionId', () => {
        it('It should return a list with all collectibles', async() => {
            const userResult = new Users()

            jest.spyOn(usersRepository, 'getCollectionById').mockImplementation(() => 
                userResult as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>
            );

            expect(await usersService.findAllByCollectionId("COLLECTION_ID")).toBe(userResult);
        })
    });

    // TODO: addAvatar
    describe('deleteAvatar', () => {
        it('It should delete userAvatar', async() => {
            const userResult = new Users();

            jest.spyOn(filesService, 'deleteFile').mockImplementation( () => 
                userResult as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>
            )

            jest.spyOn(usersService, 'update').mockImplementation( () => 
                userResult as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>
            )

            expect(await usersService.deleteAvatar("USER_ID")).toBe(userResult);
        })
    });

    describe('changeFollowUser', () => {
        it('It should change the follow user', async() => {
            const userResult = new Users();

            jest.spyOn(usersService, 'findOneById').mockImplementation( () => 
                userResult as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>
            )

            jest.spyOn(usersService, 'update').mockImplementation( () => 
            userResult as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>
        )

            expect(await usersService.changeFollowUser("USER_ID", "USER_ID_TO_CHANGE", "true")).toBe(userResult);
        })
    });

    describe('findOneById', () => {
        it('It should return a user', async () => {
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

    describe('update', () => {
        it('It should return a user', async () => {
            const userResult = new Users();
            const updateUsersDto = new UpdateUsersDto();

            jest.spyOn(usersRepository, 'findOneAndUpdate').mockImplementation(() =>{
                    return userResult as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>
                }
            );
            
            expect(await usersService.update("USER_ID", updateUsersDto)).toBe(userResult);
        });
    });

    describe('findOneByNickname', () => {
        it('It should return a user', async () => {
            const userResult = new Users() as unknown as Promise<Users>;

            jest.spyOn(usersRepository, 'findOne').mockImplementation(() => userResult);

            expect(await usersService.findOneByNickname("NICKNAME")).toBe(userResult);
        }); 
    });

    describe('findOneByEmail', () => {
        it('It should return a user', async () => {
            const userResult = new Users() as unknown as Promise<void | (Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>)>;

            jest.spyOn(usersRepository, 'findEmail').mockImplementation(() => userResult);

            expect(await usersService.findOneByEmail("EMAIL")).toBe(userResult);
        }); 
    });

    describe('findOneByFollowedSpaceId', () => {
        it('It should return a user', async () => {
            const userResult = new Users() as unknown as Promise<Omit<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>, never>[]>;

            jest.spyOn(usersRepository, 'findUsersByFollowedSpaceId').mockImplementation(() => userResult);

            expect(await usersService.findUsersByFollowedSpaceId("THEMATIC_SPACE_ID")).toBe(userResult);
        }); 
    });

    describe('findUserOwnerOfSpaceId', () => {
        it('It should return a user', async () => {
            const userResult = new Users() as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>;

            jest.spyOn(usersRepository, 'findUserOwnerOfSpaceId').mockImplementation(() => userResult);

            expect(await usersService.findUserOwnerOfSpaceId("THEMATIC_SPACE_ID")).toBe(userResult);
        }); 
    });

    describe('findUserByFollowedUserId', () => {
        it('It should return a user', async () => {
            const userResult = new Users() as unknown as Promise<Document<unknown, any, Users> & Users & Required<{ _id: ObjectId; }>>;

            jest.spyOn(usersRepository, 'findUserByFollowedUserId').mockImplementation(() => userResult);

            expect(await usersService.findUserByFollowedUserId("USER_ID")).toBe(userResult);
        }); 
    });
});