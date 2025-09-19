import Joi from "joi";

export const createCounterSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': `"name" harus berupa teks`,
    'string.empty': `"name" tidak boleh kosong`,
    'string.min': `"name" minimal harus memiliki {#limit} karakter`,
    'any.required': `"name" wajib diisi`
  }),
  maxQueue: Joi.number().integer().min(1).optional().messages({
    'number.base': `"maxQueue" harus berupa angka`,
    'number.integer': `"maxQueue" harus berupa bilangan bulat`,
    'number.min': `"maxQueue" minimal harus bernilai {#limit}`
  }),
});

export const updateCounterSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  maxQueue: Joi.number().integer().min(1).optional()
}).min(1).messages({
    'object.min': 'Setidaknya satu field (name atau maxQueue) harus diisi untuk update'
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive', 'disable').required().messages({
    'any.only': `"status" hanya boleh diisi 'active', 'inactive', atau 'disable'`,
    'any.required': `"status" wajib diisi`
  }),
});