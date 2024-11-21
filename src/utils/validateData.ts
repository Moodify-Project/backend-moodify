import { z } from 'zod';

const validateData = (schemaType: z.ZodObject<any, any>, requestData: any): Map<string, string[]> | object => {
    const validatedRequest = schemaType.safeParse(requestData);
    const { error, success, data } = validatedRequest;
    const errMsg: Map<string, string[]> = new Map();
    error?.issues.map((issue) => {
        const indexStr = String(issue.path[0]);

        if (!errMsg.has(indexStr)) {
            errMsg.set(indexStr, []);
        }
        errMsg.get(indexStr)?.push(issue.message);
    });

    if (!success) return errMsg;

    return data;
}

export default validateData;