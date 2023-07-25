const { hash } = require("bcryptjs");
const knex = require("../database/knex");

class AdminController {
    async create(req, res) {
        try {
            const { name, email, password } = req.body;

            const hashedPassword = await hash(password, 8);

            await knex("users").insert({
                name,
                email,
                is_admin: true,
                password: hashedPassword
            });

            return res.status(201).json({ Mensagem: "Administrador cadastrado com sucesso!" });
        } catch {
            throw new AppError("Não foi possível cadastrar o administrador.", 500);
        };
    };

    async show(req, res) {
        try {
            const response = await knex("users")
                .where("is_admin", true)
                .first();

            return res.status(200).json(response);
        } catch {
            throw new AppError("Não foi possível buscar o administrador.", 500);
        };
    };
};

module.exports = AdminController;