const knex = require("../database/knex");

class UserRepository {
    async findByEmail(email) {
        const user = await knex("users").where({ email }).first();

        return user;
    };

    async create({ name, email, password }) {
        const userId = await knex("users").insert({
            name,
            email,
            password,
            created_at: new Date().toLocaleString("en-US", { hour12: false }),
            updated_at: new Date().toLocaleString("en-US", { hour12: false })
        });

        return { id: userId };
    };

    async findById(id) {
        const user = await knex("users").where({ id }).first();

        return user;
    };

    async update({ name, email, password, created_at, id }) {
        await knex("users").where({ id }).update({
            name,
            email,
            password,
            created_at,
            updated_at: new Date().toLocaleString("en-US", { hour12: false })
        });
    };
}

module.exports = UserRepository;