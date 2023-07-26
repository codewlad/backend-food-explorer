const AppError = require("../utils/AppError");

class FavoriteDeleteService {
    constructor(favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    async execute(id) {
        try {
            await this.favoriteRepository.delete(id);

            return { Mensagem: "Removido dos favoritos." };
        } catch {
            throw new AppError("Não foi possível remover dos favoritos.", 500);
        };
    };
}

module.exports = FavoriteDeleteService;