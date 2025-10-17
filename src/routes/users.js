const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

// POST /api/users
router.post('/',
  // validações
  body('name').isLength({ min: 2 }).withMessage('Nome precisa ter ao menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password')
    .isLength({ min: 8 }).withMessage('Senha precisa ter ao menos 8 caracteres')
    .matches(/[0-9]/).withMessage('Senha precisa conter ao menos um número')
    .matches(/[A-Z]/).withMessage('Senha precisa conter ao menos uma letra maiúscula'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // checar se email já existe
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: 'Email já está em uso' });
      }

      const saltRounds = 10;
      const hashed = await bcrypt.hash(password, saltRounds);

      const user = new User({ name, email, password: hashed });
      await user.save();

      // não retornar senha
      const userResponse = { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt };
      return res.status(201).json({ message: 'Usuário criado com sucesso', user: userResponse });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro interno' });
    }
  }
);

module.exports = router;
