import { gender_type } from "@prisma/client";
import { UserRepository } from "../repositories/UserRepository";

export class UpdateProfileUser {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    execute = async (email: string, name: string, gender: string, country: string): Promise<boolean> => {
        let genderConvert = gender;
        if (gender === 'male') {
            genderConvert = gender_type.male;
        } else if (gender === 'female') {
            genderConvert = gender_type.female;
        } else {
            genderConvert = gender_type.secret;
        }
        
        const updatedUser = await this.userRepository.updateInformationProfileUser(email, name, genderConvert as gender_type, country);

        if (!updatedUser) return false;

        return true;
    }
}