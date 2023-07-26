const UserRepository = require("../repositories/UserRepository");
const UserCreateService = require("../services/UserCreateService");
const UserUpdateService = require("../services/UserUpdateService");

const userRepository = new UserRepository();

class UsersController {
    async create(req, res) {
        const { name, email, password } = req.body;

        const userCreateService = new UserCreateService(userRepository);

        const response = await userCreateService.execute({ name, email, password });

        return res.status(201).json(response);
    };

    async update(req, res) {
        const { name, email, password, old_password } = req.body;
        const user_id = req.user.id;

        const userUpdateService = new UserUpdateService(userRepository);

        await userUpdateService.execute({ name, email, password, old_password, id: user_id });

        return res.status(200).json({ Mensagem: "Perfil atualizado com sucesso!" });
    };
};

module.exports = UsersController;