import { sql } from "@vercel/postgres";

const validateAddSchool = (body) => {
  const { name, address, latitude, longitude } = body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name is required and must be at least 2 characters long.' });
  }

  if (!address || typeof address !== 'string' || address.trim().length < 5) {
    errors.push({ field: 'address', message: 'Address is required and must be at least 5 characters long.' });
  }

  const lat = parseFloat(latitude);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    errors.push({ field: 'latitude', message: 'A valid latitude (-90 to 90) is required.' });
  }

  const lon = parseFloat(longitude);
  if (isNaN(lon) || lon < -180 || lon > 180) {
    errors.push({ field: 'longitude', message: 'A valid longitude (-180 to 180) is required.' });
  }

  if (errors.length > 0) {
    return { error: { details: errors }, value: null };
  }

  return { error: null, value: { name, address, latitude: lat, longitude: lon } };
};


const validateListSchools = (query) => {
    const { latitude, longitude } = query;
    const errors = [];

    const lat = parseFloat(latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.push({ field: 'latitude', message: 'A valid user latitude (-90 to 90) is required.' });
    }

    const lon = parseFloat(longitude);
    if (isNaN(lon) || lon < -180 || lon > 180) {
        errors.push({ field: 'longitude', message: 'A valid user longitude (-180 to 180) is required.' });
    }
    
    if (errors.length > 0) {
        return { error: { details: errors }, value: null };
    }

    return { error: null, value: { latitude: lat, longitude: lon } };
};


export const addSchool = async (req, res, next) => {
  try {
    const { error, value } = validateAddSchool(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details
      });
    }

    const { name, address, latitude, longitude } = value;

    const { rows } = await sql`
      INSERT INTO schools (name, address, latitude, longitude)
      VALUES (${name}, ${address}, ${latitude}, ${longitude})
      RETURNING *;
    `;

    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: rows[0]
    });

  } catch (error) {
    next(error);
  }
};

export const listSchools = async (req, res, next) => {
  try {
    const { error, value } = validateListSchools(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location coordinates provided.',
        errors: error.details
      });
    }

    const { latitude: userLat, longitude: userLon } = value;

    const { rows: schools } = await sql`
      SELECT 
        id, 
        name, 
        address, 
        latitude, 
        longitude,
        (
          6371 * acos(
            cos(radians(${userLat})) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(${userLon})) +
            sin(radians(${userLat})) * sin(radians(latitude))
          )
        ) AS distance_km
      FROM schools
      ORDER BY distance_km;
    `;

    res.status(200).json({
      success: true,
      message: schools.length > 0 ? 'Schools retrieved successfully' : 'No schools found',
      userLocation: { latitude: userLat, longitude: userLon },
      totalSchools: schools.length,
      data: schools
    });

  } catch (error) {
    // Pass any errors to the centralized error handler
    next(error);
  }
};
