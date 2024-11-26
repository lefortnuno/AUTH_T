let dbConn = require("../config/db");

let Utilisateur = function (utilisateur) {
  this.nom = utilisateur.nom;
  this.im = utilisateur.im;
  this.num = utilisateur.num;
  this.email = utilisateur.email;
  this.pwd = utilisateur.pwd;
  this.roleU = utilisateur.roleU;
  this.validCompte = utilisateur.validCompte;
  this.pic = utilisateur.pic;
};

const reqSQL = `SELECT * FROM utilisateurs `;
const reqOrdre = ` ORDER BY created_at DESC `;

Utilisateur.addUtilisateur = async (newUtilisateur) => {
  try {
    const { rows } = await dbConn.query(reqSQL + `WHERE im = $1`, [
      newUtilisateur.im,
    ]);

    if (rows.length > 0) {
      throw new Error("Utilisateur déjà existant!");
    }

    const query = `INSERT INTO utilisateurs (pic, nom, prenom, im, departement, num, email, pwd, "qrCodeValue") 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)`;
    const values = [
      newUtilisateur.pic,
      newUtilisateur.nom,
      newUtilisateur.prenom,
      newUtilisateur.im,
      newUtilisateur.departement,
      newUtilisateur.num,
      newUtilisateur.email,
      newUtilisateur.pwd,
      newUtilisateur.qrCodeValue,
    ];

    const result = await dbConn.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

Utilisateur.getAllUtilisateurs = async () => {
  try {
    const result = await dbConn.query(reqSQL + reqOrdre);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

Utilisateur.deleteUtilisateur = async (im) => {
  try {
    const res = await dbConn.query("DELETE FROM utilisateurs WHERE im = $1", [
      im,
    ]);
    if (res.rowCount > 0) {
      return { success: true, message: "Utilisateur supprimé avec succès !" };
    } else {
      return {
        success: false,
        message: "Échec de suppression! Utilisateur non existant!",
      };
    }
  } catch (error) {
    throw new Error("Erreur lors de la suppression : " + error.message);
  }
};

Utilisateur.getimUtilisateur = async (im) => {
  try {
    const requete = reqSQL + `WHERE im = $1`;
    const result = await dbConn.query(requete, [im]); 
    
    return result.rows;
  } catch (error) {
    throw error;
  }
};

Utilisateur.updateUtilisateur = async (updateUtilisateur, im) => {
  try {
    // Vérifier si l'utilisateur existe
    const resId = await dbConn.query(reqSQL + `WHERE im = $1`, [im]);
    if (resId.rows.length === 0) {
      return {
        success: false,
        message: `Échec de la modification! Utilisateur non existant !`,
      };
    }

    // Préparer la requête de mise à jour
    const setQuery = Object.keys(updateUtilisateur)
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(", ");

    const values = [...Object.values(updateUtilisateur), im]; // Ajouter l'ID pour la condition WHERE

    // Exécuter la requête de mise à jour
    await dbConn.query(
      `UPDATE utilisateurs SET ${setQuery} WHERE im = $${values.length}`,
      values
    );

    return { success: true, message: "Mise à jour réussie" };
  } catch (error) {
    throw new Error(
      "Erreur lors de la mise à jour de l'utilisateur : " + error.message
    );
  }
};

Utilisateur.searchUtilisateur = async (valeur) => {
  try {
    const requete = reqSQL + ` WHERE (nom ILIKE $1 OR im ILIKE $1)` + reqOrdre; // ILIKE: case-insensitive
    const values = [`%${valeur.val}%`];

    const { rows } = await dbConn.query(requete, values);

    if (rows.length > 0) {
      return { res: rows, message: "Utilisateur trouvé !", success: true };
    } else {
      return { res: [], message: "Aucun utilisateur trouvé !", success: false };
    }
  } catch (error) {
    throw {
      err: error,
      message: "Erreur lors de la recherche !",
      success: false,
    };
  }
};

Utilisateur.loginUtilisateur = async (values) => {
  try {
    const requete = reqSQL + `WHERE im = $1 AND "validCompte"=True `;
    const result = await dbConn.query(requete, [values.im]);

    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = Utilisateur;
