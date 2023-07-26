const AppError = require("../utils/AppError");

class FavoriteShowService {
    constructor(favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    async execute() {
        try {
            const allFavorites = await this.favoriteRepository.showAllFavorites();

            return allFavorites;
        } catch {
            throw new AppError("Não foi possível buscar os favoritos.", 500);
        };
    };
}

module.exports = FavoriteShowService;