const knex = require("../database/knex");

class UserAvatarRepository {
    async findById(id) {
        const user = await knex("users").where({ id }).first();

        return user;
    };

    async update({ user }) {
        await knex("users").update(user).where({ id: user.id });
    };
}

module.exports = UserAvatarRepository;