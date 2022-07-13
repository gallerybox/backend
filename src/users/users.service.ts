import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { Users, UsersDocument } from './schema/users.schema';
import { UsersRepository } from './users.repository';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        @InjectModel(Users.name) private usersModule: Model<UsersDocument>,
    ) {}

    // Database simulation
    private readonly users = [
        {
            userId: 1,
            username: 'john',
            password: 'changeme',
        },
        {
            userId: 2,
            username: 'maria',
            password: 'guess',
        },
    ];

    // Add a new user
    async create(createUsersDto: CreateUsersDto) {
        return await this.usersRepository.create(createUsersDto);
    }
    
    async findAll() {
        return await this.usersRepository.find({});
    }

    async findOne(id: string) {
        return await this.usersRepository.findOne({ _id: id })
    }
    
    async update(id: string, updateUsersDto: UpdateUsersDto) {
        return this.usersRepository.findOneAndUpdate({ _id: id }, updateUsersDto);
    }
    
    async remove(id: string) {
        return await this.usersRepository.remove( { _id: id})
    }

    // TODO: pendiente de adaptar
    async findOneByUsername(username: string): Promise<User | undefined> {
        return await this.users.find(user => user.username === username);
    }
}