const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");

class AdminCreateService {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }

    async execute({ name, email, password }) {
        try {
            const hashedPassword = await hash(password, 8);

            await this.adminRepository.create(name, email, hashedPassword);

            return { Mensagem: "Administrador cadastrado com sucesso!" };
        } catch {
            throw new AppError("Não foi possível cadastrar o administrador.", 500);
        };
    };
}

module.exports = AdminCreateService;