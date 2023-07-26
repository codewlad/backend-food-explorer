const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionCreateService {
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    async execute({ email, password }) {
        const user = await this.sessionRepository.findByEmail(email);

        if (!user) {
            throw new AppError("E-mail e/ou senha incorreta", 401);
        };

        const passwordMatched = await compare(password, user.password);
        if (!passwordMatched) {
            throw new AppError("E-mail e/ou senha incorreta", 401);
        };

        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({ isAdmin: user.is_admin }, secret, {
            subject: String(user.id),
            expiresIn
        });

        return { user, token, isAdmin: user.is_admin };
    };
}

module.exports = SessionCreateService;