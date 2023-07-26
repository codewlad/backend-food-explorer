const UserAvatarRepository = require("../repositories/UserAvatarRepository");
const UserAvatarUpdateService = require("../services/UserAvatarUpdateService");

class UserAvatarController {
    async update(req, res) {
        const user_id = req.user.id;
        const avatarFilename = req.file.filename;

        const userAvatarRepository = new UserAvatarRepository();

        const userAvatarUpdateService = new UserAvatarUpdateService(userAvatarRepository);

        const user = await userAvatarUpdateService.execute({ id: user_id, avatarFilename });

        return res.status(200).json(user);
    };
}

module.exports = UserAvatarController;