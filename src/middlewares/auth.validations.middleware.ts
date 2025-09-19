import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    'string.base': `"username" harus berupa teks`,
    'string.empty': `"username" tidak boleh kosong`,
    'string.min': `"username" minimal harus memiliki {#limit} karakter`,
    'any.required': `"username" wajib diisi`
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': `"password" minimal harus memiliki {#limit} karakter`,
    'any.required': `"password" wajib diisi`
  }),
  email: Joi.string().email().required().messages({
    'string.email': `"email" harus berupa email yang valid`,
    'any.required': `"email" wajib diisi`
  }),
  name: Joi.string().required().messages({
    'any.required': `"name" wajib diisi`
  }),
});

export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': `"username" atau "email" wajib diisi`
  }),
  password: Joi.string().required().messages({
    'any.required': `"password" wajib diisi`
  }),
});

export const updateSchema = Joi.object({
    username: Joi.string().min(3).optional(),
    password: Joi.string().min(6).optional(),
    email: Joi.string().email().optional(),
    name: Joi.string().optional()
}).min(1).messages({ // Pastikan setidaknya ada satu field yang diisi
    'object.min': 'Setidaknya satu field (username, password, email, name) harus diisi untuk update'
});