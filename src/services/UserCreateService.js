const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UserCreateService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ name, email, password }) {
        try {
            const checkUserExists = await this.userRepository.findByEmail(email);

            if (checkUserExists) {
                throw new AppError("Este e-mail já está em uso.");
            };

            const hashedPassword = await hash(password, 8);

            await this.userRepository.create({ name, email, password: hashedPassword });

            return { Mensagem: "Usuário cadastrado com sucesso!" };
        } catch {
            throw new AppError("Não foi possível cadastrar o usuário.", 500);
        };
    };
}

module.exports = UserCreateService;