const AppError = require("../utils/AppError");

class FavoriteCreateService {
    constructor(favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    async execute(userId, dishId) {
        try {
            await this.favoriteRepository.create(userId, dishId);

            return { Mensagem: "Adicionado aos favoritos." };
        } catch {
            throw new AppError("Não foi possível adicionar aos favoritos.", 500);
        };
    };
}

module.exports = FavoriteCreateService;