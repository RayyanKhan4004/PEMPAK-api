import bcrypt from 'bcryptjs';

export async function hashPassword(plainTextPassword: string): Promise<string> {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(plainTextPassword, salt);
}

export async function verifyPassword(plainTextPassword: string, passwordHash: string): Promise<boolean> {
	return bcrypt.compare(plainTextPassword, passwordHash);
}


