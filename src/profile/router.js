const router = require("express").Router();
const {
    profileExistsMiddleware,
    accountPermissionMiddleware,
} = require("./middlewares");
const { 
    createProfile,
    getProfileConnect,
    updateProfile,
    getProfileById,
    getAllPostByProfil,
    getAllComByProfil,
 } = require("./controllers/profile_controller");

// @route   GET /
// TODO:  Get authenticated account.profile
router.get("/", getProfileConnect);

// @route   POST /
router.post("/", createProfile);

// @route   PATCH /
// TODO:  Update authenticated account.profile
router.patch("/:id",profileExistsMiddleware,accountPermissionMiddleware,updateProfile);

// @route   DELETE /
// TODO: Delete authenticated account.profile
router.delete('/:id',profileExistsMiddleware,accountPermissionMiddleware, deleteProfile);

// @route   GET /:id
// TODO: Get a profile by id
router.get("/:id", getProfileById);

// @route   GET /:id/posts
// TODO: Get all posts from a profile
router.get("/:id/posts", getAllPostByProfil);

// @route   GET /:id/comments
// TODO: Get all comments from a profile
router.get("/:id/comments", getAllComByProfil);

module.exports = router;
