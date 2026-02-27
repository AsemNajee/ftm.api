import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validate = (schemas: ValidationSchemas) => (req: Request, res: Response, next: NextFunction) => {
  try {
    if (schemas.body) {
      schemas.body.parse(req.body);
    }
    if (schemas.query) {
      schemas.query.parse(req.query);
    }
    if (schemas.params) {
      schemas.params.parse(req.params);
    }
    next();
  } catch (err: any) {
    return res.status(400).json({ 
      message: 'بيانات غير صالحة',
      errors: err.errors.map((error: any) => ({
        field: error.path.join('.'),
        message: error.message
      }))
    });
  }
};

// أو اختصار للـ body فقط
export const validateBody = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body)
    next();
  } catch (err: any) {
    if (err.message && Array.isArray(err.message)) {
        return res.status(400).json({
          message: 'بيانات غير صالحة',
          errors: err.errors.map((err: any) => ({
            field: err.path?.join('.') || 'unknown',
            message: err.message || 'خطأ غير معروف'
          }))
        });
      } else {
        return res.status(400).json({
          message: 'بيانات غير صالحة',
          errors: ['خطأ غير متوقع في التحقق من البيانات'],
          theError: err.message
        });
      }
  }
};