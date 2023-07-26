const AppError = require("../utils/AppError");

class AdminShowService {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }

    async execute() {
        try {
            const isAdmin = this.adminRepository.findByAdmin();

            return isAdmin;
        } catch {
            throw new AppError("Não foi possível buscar o administrador.", 500);
        };
    };
}

module.exports = AdminShowService;