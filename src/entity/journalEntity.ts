export class Journal {
    emailAuthor: string;
    journalId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(emailAuthor: string, journalId: string, content: string) {
        this.emailAuthor = emailAuthor;
        this.journalId = journalId;
        this.content = content;
        //
        this.createdAt = new Date(new Date().setHours(new Date().getHours() + 8));
        this.updatedAt = new Date(new Date().setHours(new Date().getHours() + 8));
    }
}
