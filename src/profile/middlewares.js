const Profile = require("./models/profile");
const RESPONSE_MESSAGES = require("../../__constants__/response_messages");

const profileExistsMiddleware = async function (req, res, next) {
    const profile = await Profile.findOne({ id: req.body.id });

    if (!profile) {
        return res.status(404).json({ msg: RESPONSE_MESSAGES.PROFILE_NOT_FOUND });
    }

    req.profile = profile;

    next();
};

const accountPermissionMiddleware = async function (req, res, next) {
    const { id } = req.params;

    const profile = await Profile.findOne({ id: id }).exec();

    if(req.account !== profile.owner){
        return res.status(403).json({ msg: RESPONSE_MESSAGES.UNAUTHORIZED})
    }

    next();
};



module.exports = {
    accountPermissionMiddleware,
    profileExistsMiddleware,
    
};
