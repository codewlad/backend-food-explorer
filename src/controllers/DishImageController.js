const DishImageDeleteService = require("../services/DishImageDeleteService");

class DishImageController {
    async delete(req, res) {
        const { filename } = req.params;

        const dishImageDeleteService = new DishImageDeleteService();

        const response = await dishImageDeleteService.execute(filename);

        return res.status(200).json(response);
    };
}

module.exports = DishImageController;