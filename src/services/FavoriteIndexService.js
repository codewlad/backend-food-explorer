const AppError = require("../utils/AppError");

class FavoriteIndexService {
    constructor(favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    async execute(user_id) {
        try {
            const userFavorites = this.favoriteRepository.filterFavoritesByUserId(user_id)

            return userFavorites;
        } catch {
            throw new AppError("Não foi possível mostrar os favoritos.", 500);
        };
    };
}

module.exports = FavoriteIndexService;