import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { ProfilePicture } from './profile-picture.entity';
import { User } from 'src/entities/user.entity';
import { ProfilePicture } from 'src/entities/profilepictureentities/profilepicture.entity';


@Injectable()
export class ProfilePictureService {
  constructor(
    @InjectRepository(ProfilePicture)
    private profilePictureRepository: Repository<ProfilePicture>,
  ) {}

  async addProfilePicture(userId: number, pictureData: Buffer): Promise<ProfilePicture> {
    const profilePicture = this.profilePictureRepository.create({
      data: pictureData,
      user: { id: userId } as User,
    });
    return this.profilePictureRepository.save(profilePicture);
  }

  async findProfilePicture(userId: number): Promise<ProfilePicture | undefined> {
    return this.profilePictureRepository.findOne({ where: { user: { id: userId } } });
  }

  // ProfilePictureService
    async updateProfilePicture(userId: number, pictureData: Buffer): Promise<ProfilePicture> {
        let profilePicture = await this.profilePictureRepository.findOne({ where: { user: { id: userId } } });
        
        if (profilePicture) {
        profilePicture.data = pictureData;
        } else {
        // If there's no profile picture, create a new one
        profilePicture = this.profilePictureRepository.create({
            data: pictureData,
            user: { id: userId } as User,
        });
        }
    
        return this.profilePictureRepository.save(profilePicture);
    }

  // ... other methods ...
}
