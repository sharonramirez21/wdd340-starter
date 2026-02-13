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


/**
 * UPDATE VEHICLE -----
 */
async function updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
        const sql = `
        UPDATE public.inventory
        SET
            inv_make = $1,
            inv_model = $2,
            inv_year = $3,
            inv_description = $4,
            inv_image = $5,
            inv_thumbnail = $6,
            inv_price = $7,
            inv_miles = $8,
            inv_color = $9,
            classification_id = $10
        WHERE inv_id = $11
        RETURNING *
        `

        const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id])
        return data.rows[0]
    } catch (error) {
        console.error("updateInventory error:", error)
    }
}

/**
 * DELETE VEHICLE -----
 */
async function deleteVehicle(inv_id) {
  try {
        const sql = `
        DELETE FROM inventory WHERE inv_id = $1
        `
        const data = await pool.query(sql, [inv_id])
        return data.rowCount
    } catch (error) {
        console.error("deleteVehicle error:", error)
    }
}

/**
 * function for search 
 */
async function searchVehicle(term) {
    try {
        const sql =  `
            SELECT * 
            FROM inventory
            WHERE inv_make ILIKE $1
                OR inv_model ILIKE $2
                OR inv_description ILIKE $3
        `
        const likeTerm = `%${term}%`
        return await pool.query(sql, [likeTerm, likeTerm, likeTerm])
    } catch (error) {
        console.error("serchVechicle error: ", error)
    }
}

module.exports = { getClassifications, getInventoryByClassificationId , getInventoryById, addClassification, addInventory, updateInventory , deleteVehicle, searchVehicle };