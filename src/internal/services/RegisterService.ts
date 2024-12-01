import { userRegisterSchema } from "../../schemas/userSchemas";
import generateHashedPassword from "../../utils/hashPassword";
import validateData from "../../utils/validateData";
import { UserRepository } from "../repositories/UserRepository";
import { errorObj } from "../../../types/error.type";

export class RegisterService {

    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }
    
    execute = async (email: string, username: string, password: string) => {

        const registerData = {
            username,
            email,
            password
        }

        const errorValidateRegister = validateData(userRegisterSchema, registerData); 

        if (errorValidateRegister instanceof Map) {
            const errReponseObj = Object.fromEntries(errorValidateRegister);
            console.log(errReponseObj);

            const updatedErrors: errorObj = {};

            for (const [key, value] of Object.entries(errReponseObj)) {
                console.log(`${key}, ${value[0]}`);

                if (!updatedErrors[key]) {
                    updatedErrors[key] = [];
                }
                
                if (value.length === 1 && value[0] === "Required") {
                    updatedErrors[key] = false;
                } else if (value.length === 1) {
                    updatedErrors[key] = value[0];
                } else {
                    updatedErrors[key] = [...value];
                }

            }

            // console.log(updatedErrors);

            throw new Error(JSON.stringify(updatedErrors));
        }
  

        const saltRounds = 10;

        const hashedPass: any = await generateHashedPassword(saltRounds, password);

        await this.userRepository.createNewAccount(email, username, hashedPass);
    }
}