const router = require("express").Router();
const UtilisateurController = require("../controllers/utilisateur.controller");

router.post("/", UtilisateurController.addUtilisateur);

router.post("/seConnecter", UtilisateurController.loginUtilisateur);

router.post("/recherche", UtilisateurController.searchUtilisateur);

router.get("/", UtilisateurController.getAllUtilisateurs);

router.get("/:im", UtilisateurController.getimUtilisateur);

router.put("/:im", UtilisateurController.updateUtilisateur);

router.delete("/:im", UtilisateurController.deleteUtilisateur);

module.exports = router;
