const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class DishesController {
    async create(req, res) {
        try {
            const { name, category, price, description, ingredients } = req.body;

            if (!name || !category || !price || !description || !ingredients) {
                throw new AppError("Campos obrigatórios ausentes.", 400);
            }

            let imageFilename = null;

            if (req.file) {
                const diskStorage = new DiskStorage();

                try {
                    imageFilename = await diskStorage.saveFile(req.file.filename);
                } catch {
                    throw new AppError("Erro ao carregar a imagem.", 500);
                }
            }

            await knex.transaction(async (trx) => {
                const [dish] = await trx('dishes').insert({
                    image: imageFilename,
                    name,
                    category,
                    price,
                    description
                }).returning('*');

                const ingredientsInsert = JSON.parse(ingredients).map(name => ({
                    dish_id: dish.id,
                    name
                }));

                await trx('ingredients').insert(ingredientsInsert);
            });

            return res.status(201).json({ Mensagem: 'Prato adicionado com sucesso!' });
        } catch {
            throw new AppError("Não foi possível adicionar o prato.", 500);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, category, price, description, ingredients, removeDishImage } = req.body;

            if (!id || (!name && !category && !price && !description && !ingredients)) {
                throw new AppError("ID do prato ausente ou nenhum campo para atualizar fornecido.", 400);
            }

            const dishUpdates = {};

            if (name) {
                dishUpdates.name = name;
            }

            if (category) {
                dishUpdates.category = category;
            }

            if (price) {
                dishUpdates.price = price;
            }

            if (description) {
                dishUpdates.description = description;
            }

            let imageFilename = null;

            if (req.file) {
                const diskStorage = new DiskStorage();

                try {
                    imageFilename = await diskStorage.saveFile(req.file.filename);
                    dishUpdates.image = imageFilename;
                } catch {
                    throw new AppError("Erro ao carregar a imagem.", 500);
                }
            }

            const dish = await knex("dishes").where({ id }).first();

            if (!removeDishImage) {
                const diskStorage = new DiskStorage();
                await diskStorage.deleteFile(dish.image);
                dishUpdates.image = null;
            }

            await knex.transaction(async (trx) => {
                await trx('dishes').update(dishUpdates).where('id', id);

                if (ingredients) {
                    const ingredientsArray = JSON.parse(ingredients);

                    await trx('ingredients').where('dish_id', id).del();

                    if (ingredientsArray.length > 0) {
                        const ingredientsInsert = ingredientsArray.map(ingredient => ({
                            dish_id: id,
                            name: ingredient
                        }));

                        await trx('ingredients').insert(ingredientsInsert);
                    }
                }
            });

            return res.status(200).json({ message: 'Prato atualizado com sucesso!' });
        } catch {
            throw new AppError("Não foi possível atualizar o prato@.", 500);
        }
    }

    async show(req, res) {
        const { id } = req.params;

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
        const { itemSearch } = req.query;

        let dishes;

        if (itemSearch) {
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
                .where(function () {
                    this.whereLike("dishes.name", `%${itemSearch}%`)
                        .orWhereLike("ingredients.name", `%${itemSearch}%`);
                })
                .innerJoin("dishes", "dishes.id", "ingredients.dish_id");

        } else {
            dishes = await knex("dishes")
                .orderBy("name");
        }

        const dishesIngredients = await knex("ingredients");

        const dishesWithIngredients = dishes.map(dish => {
            const dishIngredients = dishesIngredients.filter(ingredient => ingredient.dish_id === dish.id);

            return {
                ...dish,
                ingredients: dishIngredients
            };
        });

        return res.json(dishesWithIngredients);
    }
}

module.exports = DishesController;