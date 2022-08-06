import { Injectable } from '@nestjs/common';
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
        return await this.usersRepository.create(createUsersDto);
    }
    async createCollection(createCollectionDto: CreateCollectionDto) {
        let collection: Collection = new Collection();
        collection.name = createCollectionDto.name;
        let user_db = await this.findOneById(createCollectionDto.userId);
        
        let user_dto: UpdateUsersDto = new UpdateUsersDto();
        user_dto.collections = user_db.collections;

        user_dto.collections.push(collection);

        return await this.update(createCollectionDto.userId, user_dto);
    }
    
    async findAll() {
        return await this.usersRepository.find({});
    }

    async findOneById(id: string) {
        return await this.usersRepository.findOne({ _id: id });
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
}