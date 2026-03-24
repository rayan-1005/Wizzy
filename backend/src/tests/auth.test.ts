import '../tests/setup';
import { authService } from '../services/authService';

const validUser = {
  email: 'test@example.com',
  password: 'Password123',
  name: 'Test User',
  monthlyIncome: 50000,
};

describe('Auth Service', () => {
  describe('register()', () => {
    it('should register a new user and return token', async () => {
      const result = await authService.register(validUser);
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(validUser.email);
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw 409 on duplicate email', async () => {
      await authService.register(validUser);
      await expect(authService.register(validUser)).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('login()', () => {
    it('should login with valid credentials', async () => {
      await authService.register(validUser);
      const result = await authService.login({ email: validUser.email, password: validUser.password });
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(validUser.email);
    });

    it('should throw 401 on wrong password', async () => {
      await authService.register(validUser);
      await expect(authService.login({ email: validUser.email, password: 'WrongPass1' }))
        .rejects.toMatchObject({ statusCode: 401 });
    });

    it('should throw 401 on unknown email', async () => {
      await expect(authService.login({ email: 'nobody@test.com', password: 'Password123' }))
        .rejects.toMatchObject({ statusCode: 401 });
    });
  });

  describe('logout()', () => {
    it('should logout without error', async () => {
      const { refreshToken } = await authService.register(validUser);
      await expect(authService.logout(refreshToken)).resolves.not.toThrow();
    });
  });
});
