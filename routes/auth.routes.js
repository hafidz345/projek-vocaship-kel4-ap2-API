const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/auth/signup",
        [
            verifySignUp.checkDuplicateEmail,
            verifySignUp.checkRolesExisted
        ],
        controller.signup
    );

    app.post("/auth/signin", controller.signin);

    app.get("/auth/getUser", controller.getDataUser)

    app.get("api/getUser/:id", controller.getDataUserById)

    app.put("api/updateUser/:id", controller.updateUser);

    app.delete("api/deletUser/:id", controller.deleteById);
};