const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarUpdateService {
    constructor(userAvatarRepository) {
        this.userAvatarRepository = userAvatarRepository;
    }

    async execute({ id, avatarFilename }) {
        const diskStorage = new DiskStorage();

        const user = await this.userAvatarRepository.findById(id);

        if (!user) {
            throw new AppError("Somente usuários autenticados podem mudar o avatar", 404);
        };

        if (user.avatar) {
            await diskStorage.deleteFile(user.avatar);
        };

        const filename = await diskStorage.saveFile(avatarFilename);
        user.avatar = filename;
        user.updated_at = new Date().toLocaleString("en-US", { hour12: false });

        await this.userAvatarRepository.update({ user });

        return user;
    };
}

module.exports = UserAvatarUpdateService;