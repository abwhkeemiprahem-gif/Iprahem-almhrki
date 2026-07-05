import * as z from 'zod';

export const contactFormZodSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required / الاسم مطلوب' }),
  email: z.string().trim().min(1, { message: 'Email is required / البريد الإلكتروني مطلوب' }).email({
    message: 'Invalid email address / البريد الإلكتروني غير صالح'
  }),
  service: z.string().min(1),
  budget: z.string().min(1),
  message: z.string().trim().min(10, {
    message: 'Message must be at least 10 characters / يجب أن تكون الرسالة 10 أحرف على الأقل'
  }),
  technicalAudit: z.boolean(), // Strict boolean type matching react-hook-form
});

export type ContactFormInput = z.infer<typeof contactFormZodSchema>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
