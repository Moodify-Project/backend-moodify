import { UserRepository } from "../repositories/UserRepository";

export class SpecificInfoUser {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    findOrError = async (email: string) => {
        return await this.userRepository.findUserByEmail(email);
    }
}