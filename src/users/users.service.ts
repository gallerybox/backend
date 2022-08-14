import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { Collection, Users, UsersDocument } from './schema/users.schema';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
   
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly filesService: FilesService,
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

    // Crea una nueva colección para un usuario
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
        return await this.usersRepository.getCollectionById(collectionId)
    }

    async addAvatar(userId: string, file: Express.Multer.File) {

        // Se necesita borrar primero para retirar el fichero de Amazon S3
        await this.deleteAvatar(userId);
        

        // Subimos el nuevo fichero a Amazon S3
        const uploadedFile = await this.filesService.uploadFile(file);

        // Actualizamos el usuario con su nuevo avatar
        let updateUserDTO: UpdateUsersDto = {
            ... await this.actualizarUsuarioDTO(userId),
            profileImage: uploadedFile.Location
        }

        return await this.update(userId, updateUserDTO);
    }

    async deleteAvatar(userId: string) {
        let userDb = await this.findOneById(userId);
        let result: any;

        // Esto evita perder los datos de ejemplo en el populate
        const filesAvatarDefaultUsers = [
            "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/ea872f6d-fb36-4a4c-b3ec-215764c736cb-avatar-men.jpg",
            "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/08e6c6ee-40fc-4142-b8cf-25d87ecc5abf-avatar-men2.jpg",
            "https://gallerybox-bucket.s3.eu-west-1.amazonaws.com/2ab093fb-908b-424b-8bf1-ac633a11872d-avatar-men3.jpg"
        ]

        // Si tiene profileImage, lo borramos de la base de datos
        if (userDb?.profileImage && !filesAvatarDefaultUsers.includes(userDb.profileImage))
            result = await this.filesService.deleteFile(userDb.profileImage);
        
        // Actualizamos el usuario borrando su avatar.
        let updateUserDTO: UpdateUsersDto = {
            ... await this.actualizarUsuarioDTO(userId),
            profileImage: null
        }

        return await this.update(userId, updateUserDTO);
    }

    private async actualizarUsuarioDTO(userId: string) {
        let userDb = await this.findOneById(userId);

        let updatedUserDto = new UpdateUsersDto();
        updatedUserDto = {
            nombre: userDb?.nombre,
            profileImage: userDb?.profileImage,
            collections: userDb?.collections,
            followedThematicSpaces: userDb?.followedThematicSpaces.map(thematicSpace => thematicSpace._id.toString()),
            ownedThematicSpaces: userDb?.ownedThematicSpaces.map(thematicSpace => thematicSpace._id.toString()),
            followedUsers: userDb?.followedUsers.map(user => user._id.toString())
        }

        return updatedUserDto;
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
}