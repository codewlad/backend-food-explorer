const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class DishCreateService {
    constructor(dishRepository) {
        this.dishRepository = dishRepository;
    }

    async execute(name, category, price, description, ingredients, req) {
        try {
            let imageFilename = null;

            if (req.file) {
                const diskStorage = new DiskStorage();

                try {
                    imageFilename = await diskStorage.saveFile(req.file.filename);
                } catch {
                    throw new AppError("Erro ao carregar a imagem.", 500);
                };
            };

            const [dish] = await this.dishRepository.createDish(imageFilename, name, category, price, description);

            const ingredientsInsert = JSON.parse(ingredients).map(name => ({
                dish_id: dish.id,
                name
            }));

            await this.dishRepository.createIngredients(ingredientsInsert);

            return { Mensagem: "Prato adicionado com sucesso!" };
        } catch {
            throw new AppError("Não foi possível adicionar o prato.", 500);
        };
    };
}

module.exports = DishCreateService;