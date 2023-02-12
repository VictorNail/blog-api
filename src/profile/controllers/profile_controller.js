const Person = require("../models/person");
const Company = require("../models/company");
const Profile = require("../models/profile");
const Post = require("../../blog/models/post");
const Comment = require("../../blog/models/comment");

const { getUrl } = require("../../../utils/getter");
const { removeFields } = require("../../../utils/remover");
const { PROFILE_NOT_FOUND } = require("../../../__constants__/response_messages");

const getProfileConnect = async (req, res) => {
    const profiles = await Profile.find({ owner: req.account });

    res.json(removeFields(profiles));
};

const createProfile = async (req, res) => {
    const { kind, ...body } = req.body;
    let profile;

    try {
        switch (kind) {
            case "person":
                profile = new Person({ ...body, owner: req.account });
                break;
            case "company":
                profile = new Company({ ...body, owner: req.account });
                break;
            default:
                return res.status(400).json({ msg: RESPONSE_MESSAGES.INVALID_KIND });
        }

        await profile.save();

        res.header("Location", getUrl(req, profile.id));
        res.status(201).json(removeFields(profile.toObject()));
    } catch (err) {
        res.status(500).json({ msg: err });
    }
};


updateProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const profile = await Profile.findOneAndUpdate({ id: id}, req.body, {
            new: true,
            runValidators: true,
        }).lean().exec();

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};


deleteProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const profile = await Profile.findOne({ id: id }).exec();
       
        await Promise.all([
            Post.deleteMany({ owner: id }), 
            Comment.deleteMany({ owner: id })
        ]);

        await profile.delete();

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

getProfileById = async (req, res) => {

    const { id } = req.params;

    try {
        const profile = await Profile.findOne({ id: id }).lean().exec();
        if (!profile) {
            return res.status(404).json({ msg: RESPONSE_MESSAGES.PROFILE_NOT_FOUND });
        }

        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

getAllPostByProfil = async (req, res) => {
    const { id } = req.params;

    try {
        const posts = await Post.find({ owner: id }).lean().exec();
        if (!posts) {
            return res.status(404).json({ msg: RESPONSE_MESSAGES.POST_NOT_FOUND });
        }

        return res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

getAllComByProfil = async (req, res) => {
    const { id } = req.params;

    try {
        const comments = await Comment.find({ owner: id }).lean().exec();
        if (!comments) {
            return res.status(404).json({ msg: RESPONSE_MESSAGES.COMMENT_NOT_FOUND });
        }

        return res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

module.exports = {
    createProfile,
    getProfileConnect,
    updateProfile,
    deleteProfile,
    getProfileById,
    getAllPostByProfil,
    getAllComByProfil,
};
