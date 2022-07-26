import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { Users, UsersDocument } from './schema/users.schema';
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