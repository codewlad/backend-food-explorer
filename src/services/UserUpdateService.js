const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UserUpdateService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ name, email, password, old_password, id }) {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new AppError("Usuário não encontrado");
        };

        const userWithUpdatedEmail = await this.userRepository.findByEmail(email);

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("Este email já está em uso.");
        };

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if (password && !old_password) {
            throw new AppError("Você precisa informar a senha antiga para definir a nova senha.")
        };

        if (password && old_password) {
            const checkOldPassword = await compare(old_password, user.password);

            if (!checkOldPassword) {
                throw new AppError("A senha antiga não confere.");
            };

            user.password = await hash(password, 8);
        };

        const currentDate = new Date();

        currentDate.setHours(currentDate.getHours() + 3);

        await this.userRepository.update({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            created_at: user.created_at,
            updated_at: currentDate.toLocaleString("en-US", { hour12: false })
        });
    };
}

module.exports = UserUpdateService;