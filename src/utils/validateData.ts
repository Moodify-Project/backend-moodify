// import { Request } from 'express';
import { z } from 'zod';

const validateData = (schemaType: z.ZodObject<any, any>, requestData: any): Map<string, string[]> | object => {
    const validatedRequest = schemaType.safeParse(requestData);
    const { error, success, data } = validatedRequest;
    const errMsg: Map<string, string[]> = new Map();
    error?.issues.map((val) => {
        const indexStr = String(val.path[0]);

        if (!errMsg.has(indexStr)) {
            errMsg.set(indexStr, []);
        }
        errMsg.get(indexStr)?.push(val.message);
    });

    if (!success) return errMsg;

    else {
        return data;
    }
}

export default validateData;