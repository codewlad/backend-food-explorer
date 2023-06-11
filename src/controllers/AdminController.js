const { hash } = require("bcryptjs");
const knex = require("../database/knex");

class AdminController {
    async create(req, res) {
        const { name, email, password } = req.body;

        const hashedPassword = await hash(password, 8);

        await knex("users").insert({
            name,
            email,
            is_admin: true,
            password: hashedPassword
        });

        return res.status(201).json();
    };
};

module.exports = AdminController;