import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { Collection, Users, UsersDocument } from './schema/users.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        @InjectModel(Users.name) private usersModel: Model<UsersDocument>,
    ) {}

    // Add a new user
    async create(createUsersDto: any | CreateUsersDto) {
        try {
            return await this.usersRepository.create(createUsersDto);
        } catch (error) {
            if (error.code === 11000) {
                throw new HttpException({
                    status: HttpStatus.FORBIDDEN,
                    error: 'El nickname o email ya existen en GalleryBox',
                  }, HttpStatus.FORBIDDEN);    
            }   
        }

    }
    async createCollection(createCollectionDto: CreateCollectionDto) {
        let collection: Collection = new Collection();
        collection.name = createCollectionDto.name;
        let userDb = await this.findOneById(createCollectionDto.userId);
        
        let userDTO: UpdateUsersDto = new UpdateUsersDto();
        userDTO.collections = userDb.collections;

        userDTO.collections.push(collection);

        return await this.update(createCollectionDto.userId, userDTO);
    }
    
    async findAllByCollectionId(collectionId: string){
        // Paso 1: buscamos la coleccion en todos los usuarios
        return await this.usersRepository.getCollectionById(collectionId)
        
    }
    
    async findAll() {
        return await this.usersRepository.find({});
    }

    async findOneById(id: string) {
        return await this.usersRepository.getUserByIdCollectionsPopulate({ _id: id });
    }
    
    async update(id: string, updateUsersDto: UpdateUsersDto) {
        return await this.usersRepository.findOneAndUpdate({ _id: id }, updateUsersDto);
    }
    
    async deleteOne(id: string) {
        return await this.usersRepository.delete({ _id: id })
    }

    async findOneByNickname(nickname: string){
        return await this.usersRepository.findOne( { nickname: nickname })
    }

    async findOneByEmail(email: string){
        return await this.usersRepository.findOne( { email: email })
    }

    async findUsersByFollowedSpaceId(followedSpaceId: string){
        return await this.usersRepository.findUsersByFollowedSpaceId( followedSpaceId );
    }

    async findUserOwnerOfSpaceId(ownedSpaceId: string){
        return await this.usersRepository.findUserOwnerOfSpaceId( ownedSpaceId );
    }

    async findUserByFollowedUserId(ownedSpaceId: string) {
        return await this.usersRepository.findUserByFollowedUserId(ownedSpaceId);
    }
}