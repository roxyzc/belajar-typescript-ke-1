import { Request, Response, NextFunction } from 'express';

export const notFound = (_req: Request, res: Response, _next: NextFunction) => {
    return res.status(404).json({ status: false, message: 'Page Not Found' });
};

export const errorHandler = (error: TypeError, _req: Request, res: Response, _next: NextFunction) => {
    return res.status(500).json({ status: error.name, message: error.message });
};
