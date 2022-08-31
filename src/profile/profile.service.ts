import { BadRequestException, flatten, HttpStatus, Injectable } from '@nestjs/common';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { JSDOM } from 'jsdom';
let { window } = new JSDOM("");
import fs  from "fs";
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/schema/users.schema';
import { CollectibleService } from 'src/collectible/collectible.service';
import { Category, MultimediaType } from 'src/thematic-spaces/models/Type';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ProfileService {

    constructor(
        private readonly usersService: UsersService,
        private readonly mailService: MailService,
        private readonly collectibleService: CollectibleService
    ) {}

    async sendPersonalData(userId: string){
        
        let userDb = await this.usersService.findOneById(userId) as unknown as Users;

        // Información que se debe dar:
        // Nombre, Apellidos, Nickname, Email, Biography, Espacio temático + Colecciones + Coleccionables,  
        
        try{
            let htmlTemplate = `
                <h1>GalleryBox</h1>
                <h3>Nombre y Apellidos: ${userDb.nombre} ${userDb.apellidos}</h3>
                <table style="width: 100%">
                    <tr>
                        <th style="width: 15%">Nickname</th>
                        <th style="width: 35%">Email</th>
                        <th style="width: 50%">Biografía</th>
                        
                    </tr>
                    <tr>
                        <td>${userDb.nickname}</td>
                        <td>${userDb.email}</td>
                        <td>${userDb?.biography !== undefined ? userDb.biography : "Sin definir"}</td>
                    </tr>
                    <tr>
                        <th>Foto de perfil</th>
                        <td colspan="2">`;
                        if (userDb?.profilePhoto !== undefined) {
                            htmlTemplate += `<a href="${userDb?.profilePhoto}">${userDb?.profilePhoto}</a>`
                        } else {
                            htmlTemplate += "Sin definir"
                        }
                        htmlTemplate += `</td>
                    </tr>
                </table>`; 
            
            let ownedThematicSpace = `</br><h3>Espacios temáticos</h3>`
            if (userDb?.ownedThematicSpaces === (null || undefined) || userDb?.ownedThematicSpaces?.length === 0) {
                ownedThematicSpace += `<p>No tiene</p>`
            } else {
                userDb.ownedThematicSpaces.forEach(thematicSpace => {
                ownedThematicSpace += 
                    `<table style="text-align:center">
                    <tr>
                        <th></th>
                        <th>${thematicSpace.name}</th>
                        <th>Representación gráfica</th>
                    </tr>`;
                    
                    thematicSpace.template.attributes
                    .sort((a,b)=> (a.representationOrder > b.representationOrder) ? 1: -1)
                    .forEach(data => {
                        ownedThematicSpace += 
                        `<tr>
                            <th><b>Atributo ${data.representationOrder + 1}</b></th>
                            <td>${data.tag} [${data.type.category}, ${data.showTag ? "Se muestra": "No se muestra"}]</td>
                            <td>${JSON.stringify(data.type.representation, null, "\t")}</td>
                        </tr>`
                    });

                    ownedThematicSpace += `</table>`
                });
            };
            
            
            let collectionsCreated = `</br><h3>Colecciones creadas</h3>`;
            if (userDb?.collections === (null || undefined) || userDb?.collections?.length === 0)
                collectionsCreated += `<p>No tiene</p>`
            else {
                for (let collection of userDb.collections) {
                    collectionsCreated += `<h4>${collection.name}</h4>`
                    for (let i = 0; i < collection.collectibles.length; i++) {
                        
                        let collectible = await this.collectibleService.findOne(collection.collectibles[i]._id.toString());
                        let myAttributes = Object.keys(collectible.attributes);
                        

                        collectionsCreated += `
                        <table style="width: 100%">
                        <tr>
                            <th style="width: 15%">Atributo</th>
                            <th style="width: 25%">Valor</th>
                            <th style="width: 20%">¿Se muestra?</th>
                            <th style="width: 40%">Representación gráfica</th>
                        </tr>`

                        for (const key of myAttributes) {
                            collectionsCreated += `
                            <tr>
                            <th>${key}</th>`;
                            if (collectible?.attributes[key]["category"] === Category.Toggle) {
                                collectible?.attributes[key]["value"] === true
                                    ? collectionsCreated += `<td>Sí</td>`
                                    : collectionsCreated += `<td>No</td>`
                            } else if (collectible?.attributes[key]["category"] === Category.Multimedia){
                                collectible?.attributes[key]["representation"].multimediaType === MultimediaType.Photo 
                                collectionsCreated += `<td>
                                <a href="${collectible?.attributes[key]["value"]?.toString()}">${collectible?.attributes[key]["value"]?.toString()}</td>`
                            } else {
                                collectionsCreated += `<td>${collectible?.attributes[key]["value"]?.toString()}</td>`
                            }
                            collectionsCreated += `<td>${collectible?.attributes[key]["showTag"] ? "Si": "No"}</td>
                            <td>${JSON.stringify(collectible?.attributes[key]["representation"], null, "\t")}</td>
                            </tr>`
                        
                        }
                        collectionsCreated += `</table>`
                            
                    }
                }
            }
                
            htmlTemplate += ownedThematicSpace;
            htmlTemplate += collectionsCreated;

            const htmlContent = htmlToPdfmake(htmlTemplate, {
                window: window,
                tableAutoSize: true
            });
            

            let docDefinition = {
                content: [
                    htmlContent
                ]
              };
            
            let pdfDocGenerator = pdfMake.createPdf(docDefinition);

            pdfDocGenerator.getBuffer(function(buffer) {
                fs.writeFileSync('example.pdf', buffer);
                
            });

            
            this.mailService.sendPlainTextEmail(
                userDb.email, 
                "noreply@gallerybox.com",
                "Solicitud de datos personales",
                `<h1>Hola, ${userDb.nickname}: </h1>\n
                <p>Respondiendo a tu solicitud, adjuntamos un PDF con todos los datos generados por tu actividad en GalleryBox.</p>
                </br>
                <p>GalleryBox cumple con el Reglamento General de Protección de Datos (GPDR). Para obtener más información
                sobre como recopilamos, procesamos, administramos y procesamos sus datos personales de conformidad con el
                GPDR, consulte nuestra política de privacidad.</p>`,
                [{
                    filename: "example.pdf",
                    contentType: "application/pdf",
                    contentDisposition: 'attachment',
                    path: "example.pdf"
                }]
            );
        } catch (error) {
            console.log(error);
            throw new BadRequestException("EMAIL_NOT_SENT");
        }

        return {
            statusCode: HttpStatus.OK,
            message: 'EMAIL_SENT'
        }
    }

    async upsertDeleteCollectibles(user: Users){
        const userDB= await this.usersService.findOneById(user._id.toString());
        if (userDB){
            for(const collection of user.collections){
                if ((collection as any)._id){
                    const collectionDB = userDB.collections.find(collectiondb => (collectiondb as any)._id == (collection as any)._id);
                    if (collectionDB){
                        const toDelete = collectionDB.collectibles.filter(c1=>!collection.collectibles.find(c2=> c2._id==c1._id));
                        for (const collectible of toDelete){
                            await this.collectibleService.remove(collectible._id.toString());
                        }
                    }
                }

            }
        }
        return await this.usersService.upsert(user);
    }

}
