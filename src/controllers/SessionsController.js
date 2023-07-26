const SessionRepository = require("../repositories/SessionRepository");
const SessionCreateService = require("../services/SessionCreateService");

class SessionsController {
    async create(req, res) {
        const { email, password } = req.body;

        const sessionRepository = new SessionRepository();

        const sessionCreateService = new SessionCreateService(sessionRepository);

        const { user, token, isAdmin } = await sessionCreateService.execute({ email, password });

        return res.status(200).json({ user, token, isAdmin });
    };
}

module.exports = SessionsController;