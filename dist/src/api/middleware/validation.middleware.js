"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = validationMiddleware;
function validationMiddleware(schema, loc = "body") {
    return (req, res, next) => {
        let toValidate;
        if (loc === "body") {
            toValidate = req.body;
        }
        else if (loc === "query") {
            toValidate = req.query;
        }
        else {
            toValidate = req.params;
        }
        const result = schema.safeParse(toValidate);
        if (!result.success) {
            const formatted = result.error.format();
            res.status(400).json({ errors: formatted });
            return;
        }
        if (loc === "body") {
            req.body = result.data;
        }
        else if (loc === "query") {
            req.validatedQuery = result.data;
        }
        else {
            req.validatedParams = result.data;
        }
        next();
    };
}
