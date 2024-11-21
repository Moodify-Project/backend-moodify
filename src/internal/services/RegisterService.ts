import generateHashedPassword from "../../utils/hashPassword";
import { UserRepository } from "../repositories/UserRepository";

export class RegisterService {

    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }
    
    execute = async (email: string, username: string, password: string) => {
        const saltRounds = 10;

        const hashedPass: any = await generateHashedPassword(saltRounds, password);

        await this.userRepository.createNewAccount(email, username, hashedPass);
    }
}