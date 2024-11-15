export class Journal {
    emailAuthor: string;
    journalId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    isPredicted: boolean;

    constructor(emailAuthor: string, journalId: string, content: string, isPredicted: boolean) {
        this.emailAuthor = emailAuthor;
        this.journalId = journalId;
        this.content = content;
        this.isPredicted = isPredicted;
        //
        this.createdAt = new Date(new Date().setHours(new Date().getHours() + 8));
        this.updatedAt = new Date(new Date().setHours(new Date().getHours() + 8));
    }
}
