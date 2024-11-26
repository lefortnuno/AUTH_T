"use strict";
const Utilisateur = require("../models/utilisateur.model");
const ResponseHelper = require("../helpers/responseHelper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tmp = 3 * 24 * 60 * 60 * 1000;

const createToken = (account) => {
  return jwt.sign({ account }, process.env.TOKEN_SECRET, { expiresIn: tmp });
};

module.exports.addUtilisateur = async (req, res) => {
  let dataInput = req.body;

  dataInput.pwd = bcrypt.hashSync(dataInput.pwd, 10);
  try {
    const result = await Utilisateur.addUtilisateur(dataInput);
    ResponseHelper.sendResponse(res, true, "Ajout réussi !", result);
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, 500);
  }
};

module.exports.updateUtilisateur = async (req, res) => {
  const im = req.params.im;
  const updateData = req.body; 

  try {
    const result = await Utilisateur.updateUtilisateur(updateData, im);
    ResponseHelper.sendResponse(res, result.success, result.message);
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, null, 500);
  }
};

module.exports.deleteUtilisateur = async (req, res) => {
  const im = req.params.im;

  try {
    const deleteResult = await Utilisateur.deleteUtilisateur(im);
    ResponseHelper.sendResponse(
      res,
      deleteResult.success,
      deleteResult.message
    );
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, 500);
  }
};

module.exports.getAllUtilisateurs = async (req, res) => {
  try {
    const result = await Utilisateur.getAllUtilisateurs();
    ResponseHelper.sendResponse(
      res,
      true,
      "Liste des utilisateurs récupérée avec succès !",
      result
    );
  } catch (error) {
    ResponseHelper.sendResponse(
      res,
      false,
      "Erreur lors de la récupération des utilisateurs !",
      error.message,
      500
    );
  }
};

module.exports.getimUtilisateur = async (req, res) => {
  const im = req.params.im;

  try {
    const result = await Utilisateur.getimUtilisateur(im);
    if (result.length > 0) {
      ResponseHelper.sendResponse(res, true, "Utilisateur trouvé !", result[0]);
    } else {
      ResponseHelper.sendResponse(
        res,
        false,
        "Utilisateur non trouvé !",
        null,
        404
      );
    }
  } catch (error) {
    ResponseHelper.sendResponse(
      res,
      false,
      "Erreur lors de la récupération de l'utilisateur !",
      error.message,
      500
    );
  }
};

module.exports.searchUtilisateur = async (req, res) => {
  const { valeur } = req.body;

  if (!valeur) {
    return ResponseHelper.sendResponse(
      res,
      false,
      "Valeur de recherche requise !",
      null,
      400
    );
  }

  try {
    const result = await Utilisateur.searchUtilisateur({ val: valeur });
    ResponseHelper.sendResponse(
      res,
      result.success,
      result.message,
      result.res // Include the results
    );
  } catch (error) {
    ResponseHelper.sendResponse(
      res,
      false,
      "Erreur lors de la recherche d'utilisateur !",
      error.message,
      500
    );
  }
};

module.exports.loginUtilisateur = async (req, res) => {
  const { im, pwd } = req.body;

  try {
    const result = await Utilisateur.loginUtilisateur({ im });
    if (result && result.length > 0) {
      const user = result[0];
      const isPasswordValid = bcrypt.compareSync(pwd, user.pwd);

      if (isPasswordValid) {
        const token = createToken(user);
        ResponseHelper.sendResponse(res, true, "Connecté à e-BOA!", {
          user,
          token,
        });
      } else {
        ResponseHelper.sendResponse(
          res,
          false,
          "Identifiant ou Mot de passe incorrect!",
          401
        );
      }
    } else {
      ResponseHelper.sendResponse(
        res,
        false,
        "Identifiant ou Mot de passe incorrect!",
        404
      );
    }
  } catch (error) {
    ResponseHelper.sendResponse(
      res,
      false,
      "Erreur lors de la connexion !",
      error.message,
      500
    );
  }
};
