const AdminRepository = require("../repositories/AdminRepository");
const AdminCreateService = require("../services/AdminCreateService");
const AdminShowService = require("../services/AdminShowService");

const adminRepository = new AdminRepository();

class AdminController {
    async create(req, res) {
        const { name, email, password } = req.body;

        const adminCreateService = new AdminCreateService(adminRepository);

        const response = await adminCreateService.execute({ name, email, password });

        return res.status(201).json(response);
    };

    async show(req, res) {
        const adminShowService = new AdminShowService(adminRepository);

        const isAdmin = await adminShowService.execute();

        return res.status(201).json(isAdmin);
    };
};

module.exports = AdminController;