const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const generateTokens = (user) => {
  const payload = { id: user.id, username: user.username, email: user.email, role: user.role };
  
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '15m'
  });
  
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d'
  });

  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Të gjitha fushat janë të detyrueshme.' });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      where: {
        [User.sequelize.Sequelize.Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Përdoruesi me këtë email ose username ekziston.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // If first user, make Admin, otherwise use specified role (default: Punëtor)
    const userCount = await User.count();
    const finalRole = userCount === 0 ? 'Admin' : (role || 'Punëtor');

    const newUser = await User.create({
      username,
      email,
      passwordHash,
      role: finalRole
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser);
    
    // Save refresh token
    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.status(201).json({
      message: 'Përdoruesi u regjistrua me sukses.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Gabim gjatë regjistrimit.', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dhe fjalëkalimi janë të detyrueshëm.' });
    }

    // Find user (can login with email or username)
    const user = await User.findOne({
      where: {
        [User.sequelize.Sequelize.Op.or]: [{ email: username }, { username }]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Kredencialet nuk janë të sakta.' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Kredencialet nuk janë të sakta.' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Identifikimi u krye me sukses.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Gabim gjatë identifikimit.', error: error.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Mungon refresh token.' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({ message: 'Refresh token nuk është i vlefshëm ose ka skaduar.' });
    }

    // Find user and check if token matches
    const user = await User.findByPk(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Refresh token i pavlefshëm.' });
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    // Save new refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Gabim gjatë rifreskimit të token-it.', error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      const user = await User.findOne({ where: { refreshToken } });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    res.json({ message: 'Çregjistrimi u krye me sukses.' });
  } catch (error) {
    res.status(500).json({ message: 'Gabim gjatë çregjistrimit.', error: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'role']
    });
    if (!user) {
      return res.status(404).json({ message: 'Përdoruesi nuk u gjet.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Gabim gjatë marrjes së të dhënave të përdoruesit.', error: error.message });
  }
};
