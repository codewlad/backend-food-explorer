const knex = require("../database/knex");

class AdminRepository {
    async create(name, email, password) {
        await knex("users").insert({
            name,
            email,
            is_admin: true,
            password,
            created_at: new Date().toLocaleString("en-US", { hour12: false }),
            updated_at: new Date().toLocaleString("en-US", { hour12: false })
        });
    };

    async findByAdmin() {
        const isAdmin = await knex("users")
            .where("is_admin", true)
            .first();
        return isAdmin;
    };
}

module.exports = AdminRepository;