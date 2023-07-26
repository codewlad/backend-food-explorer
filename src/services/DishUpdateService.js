const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class DishUpdateService {
    constructor(dishRepository) {
        this.dishRepository = dishRepository;
    }

    async execute(id, name, category, price, description, ingredients, removeDishImage, req) {
        try {
            const dishUpdates = {};

            if (name) {
                dishUpdates.name = name;
            };

            if (category) {
                dishUpdates.category = category;
            };

            if (price) {
                dishUpdates.price = price;
            };

            if (description) {
                dishUpdates.description = description;
            };

            let imageFilename = null;

            const dish = await this.dishRepository.filterDishById(id);

            const diskStorage = new DiskStorage();

            if (req.file) {
                if (dish.image) {
                    try {
                        await diskStorage.deleteFile(dish.image);
                    } catch {
                        throw new AppError("Erro ao remover a imagem antiga.", 500);
                    };
                };

                try {
                    imageFilename = await diskStorage.saveFile(req.file.filename);
                    dishUpdates.image = imageFilename;
                } catch {
                    throw new AppError("Erro ao carregar a imagem.", 500);
                };
            };

            if (!removeDishImage) {
                await diskStorage.deleteFile(dish.image);
                dishUpdates.image = null;
            };

            await this.dishRepository.update(dishUpdates, id);

            if (ingredients) {
                const ingredientsArray = JSON.parse(ingredients);

                await this.dishRepository.deleteIngredients(id);

                if (ingredientsArray.length > 0) {
                    const ingredientsInsert = ingredientsArray.map(ingredient => ({
                        dish_id: id,
                        name: ingredient
                    }));

                    await this.dishRepository.createIngredients(ingredientsInsert);
                };
            };

            return { Mensagem: "Prato atualizado com sucesso!" };
        } catch {
            throw new AppError("Não foi possível atualizar o prato!", 500);
        };
    };
}

module.exports = DishUpdateService;