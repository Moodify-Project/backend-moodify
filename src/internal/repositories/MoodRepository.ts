import { BaseRepository } from "./BaseRepository";

export class MoodRepository extends BaseRepository {
    getAllMoodKey = async () => {
        return await MoodRepository._prisma.mood.findMany();
    }
}