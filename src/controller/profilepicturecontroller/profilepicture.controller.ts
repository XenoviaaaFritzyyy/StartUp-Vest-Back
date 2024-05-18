import { Controller, Post, UseInterceptors, UploadedFile, Param, Get, Res, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilePictureService } from 'src/service/profilepictureservice/profilepicture.service';
import { Response } from 'express';
// import { ProfilePictureService } from './profile-picture.service';

@Controller('profile-picture')
export class ProfilePictureController {
  constructor(private readonly profilePictureService: ProfilePictureService) {}

  @Post(':userId/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(@Param('userId') userId: number, @UploadedFile() file: Express.Multer.File) {
    const pictureData = file.buffer;
    await this.profilePictureService.addProfilePicture(userId, pictureData);
  }

  @Get(':userId')
  async getProfilePicture(@Param('userId') userId: number, @Res() res: Response) {
    const profilePicture = await this.profilePictureService.findProfilePicture(userId);
    if (profilePicture) {
      res.set('Content-Type', 'image/jpeg'); // or the correct content type for your image
      res.send(profilePicture.data);
    } else {
      res.status(404).send('Profile picture not found');
    }
  }

  // ProfilePictureController
    @Put(':userId')
    @UseInterceptors(FileInterceptor('file'))
    async updateProfilePicture(@Param('userId') userId: number, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    const pictureData = file.buffer;
    try {
        const updatedProfilePicture = await this.profilePictureService.updateProfilePicture(userId, pictureData);
        res.json(updatedProfilePicture);
    } catch (error) {
        res.status(500).send('Error updating profile picture');
    }
    }

  // ... other endpoints ...
}
