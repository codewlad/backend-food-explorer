const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");

class DishesController {
    async create(req, res) {
        const imageFilename = req.file ? req.file.filename : null;
        const { name, category, price, description, ingredients } = req.body;

        if (imageFilename) {
            const diskStorage = new DiskStorage();

            await diskStorage.saveFile(imageFilename);
        }

        const [dish_id] = await knex("dishes").insert({
            image: imageFilename,
            name,
            category,
            price,
            description
        });

        const ingredientsInsert = JSON.parse(ingredients).map(name => {
            return {
                dish_id,
                name
            }
        });

        await knex("ingredients").insert(ingredientsInsert);

        return res.json();
    }

    async update(req, res) {
        const { id, name, category, price, description, ingredients } = req.body;

        await knex("dishes")
            .where({ id })
            .update({
                name,
                category,
                price,
                description
            });

        await knex("ingredients")
            .where({ dish_id: id })
            .del();

        const ingredientsInsert = ingredients.map(name => {
            return {
                dish_id: id,
                name
            };
        });

        await knex("ingredients").insert(ingredientsInsert);

        return res.json();
    }

    async show(req, res) {
        const { id } = req.params;
        const isAdmin = req.user.isAdmin;

        const dish = await knex("dishes").where({ id }).first();
        const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

        return res.json({
            ...dish,
            ingredients
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        await knex("dishes").where({ id }).delete();

        return res.json();
    }

    async index(req, res) {
        const { name, ingredients } = req.query;

        let dishes;

        if (ingredients) {
            const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());

            dishes = await knex("ingredients")
                .distinct("dishes.id")
                .select([
                    "dishes.id",
                    "dishes.image",
                    "dishes.name",
                    "dishes.category",
                    "dishes.price",
                    "dishes.description",
                ])
                .whereLike("dishes.name", `%${name}%`)
                .andWhereLike("ingredients.name", `%${filterIngredients}%`)
                .innerJoin("dishes", "dishes.id", "ingredients.dish_id");

        } else {
            dishes = await knex("dishes")
                .whereLike("name", `%${name}%`)
                .orderBy("name");
        }

        const dishesIngredients = await knex("ingredients");

        const dishesWithIngredients = dishes.map(dish => {
            const dishIngredients = dishesIngredients.filter(ingredient => ingredient.dish_id === dish.id)

            return {
                ...dish,
                ingredients: dishIngredients
            }
        });

        return res.json(dishesWithIngredients);
    }
}

module.exports = DishesController;