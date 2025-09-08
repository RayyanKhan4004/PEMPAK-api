import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { verifyPassword, hashPassword } from '../utils/password';
import { appConfig } from '../config/env';

export async function login(req: Request, res: Response): Promise<Response> {
	try {
		const { email, password } = req.body as { email?: string; password?: string };
		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password are required' });
		}

		const user = await User.findOne({ email }).lean(false);
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const isValid = await verifyPassword(password, user.passwordHash);
		if (!isValid) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		if (!appConfig.jwtSecret) {
			return res.status(500).json({ message: 'Server JWT secret not configured' });
		}

		const token = jwt.sign({ sub: String(user._id), email: user.email }, appConfig.jwtSecret, { expiresIn: '1h' });
		return res.status(200).json({ token });
	} catch (error) {
		return res.status(500).json({ message: 'Login failed', error: (error as Error).message });
	}
}

export async function register(req: Request, res: Response): Promise<Response> {
	try {
		const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
		if (!name || !email || !password) {
			return res.status(400).json({ message: 'name, email and password are required' });
		}

		const existing = await User.findOne({ email }).lean();
		if (existing) {
			return res.status(409).json({ message: 'Email already registered' });
		}

		if (!appConfig.jwtSecret) {
			return res.status(500).json({ message: 'Server JWT secret not configured' });
		}

		const passwordHash = await hashPassword(password);
		const user = await User.create({ name, email, passwordHash });
		const token = jwt.sign({ sub: String(user._id), email: user.email }, appConfig.jwtSecret, { expiresIn: '1h' });
		return res.status(201).json({ token });
	} catch (error) {
		return res.status(500).json({ message: 'Registration failed', error: (error as Error).message });
	}
}


