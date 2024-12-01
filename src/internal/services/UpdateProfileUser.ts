import { gender_type } from "@prisma/client";
import { UserRepository } from "../repositories/UserRepository";
import validateData from "../../utils/validateData";
import { editProfileUserSchema } from "../../schemas/userSchemas";

export class UpdateProfileUser {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    execute = async (email: string, name: string, gender: string, country: string): Promise<boolean> => {
        const profileInfo = {
            name,
            gender,
            country
          }

        const errorValidateMessage = validateData(editProfileUserSchema, profileInfo);

        if (errorValidateMessage instanceof Map) {
            const errReponseObj = Object.fromEntries(errorValidateMessage);
            throw new Error(JSON.stringify(errReponseObj));
        }

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