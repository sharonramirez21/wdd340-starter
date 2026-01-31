const pool = require("../database/")

/* get classification data */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
};

/**
 * Get all inventory items and classification_name by classification_id
 */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyidd error " + error)
    }
}


/**
 * get a item by its id
*/
async function getInventoryById(invId) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory
            WHERE inv_id = $1`,
            [invId]
        )
        return data.rows[0]
    } catch (error) {
        console.error("getInventoryById error: " + error)
    }
}


/**
 * form add-classification
 */
async function addClassification(classification_name) {
    try {
        const sql = `
            INSERT INTO classification (classification_name)
            VALUES ($1)
            RETURNING *
        `
        const data = await pool.query(sql, [classification_name])
        return data.rows[0]
    } catch (error) {
        console.error("addClassification error: " + error)
    }
}


/**
 * form add-inventory
 */
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
    try {
        const sql = `INSERT INTO inventory (
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        ) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *` 

        return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
    } catch (error) {
        console.error("addInventory error:" + error)
        return null
    }
}

module.exports = { getClassifications, getInventoryByClassificationId , getInventoryById, addClassification, addInventory};