const { Module, Action, UserRight } = require("../models"); // adjust path as per your structure

// GET /api/modules
exports.getModules = async (req, res) => {
  try {
    const modules = await Module.findAll({
      where: { status: 1 }, // only active modules
      order: [["sort_order", "ASC"]],
      attributes: ["id", "name", "slug", "parent_id", "icon", "path"],
    });

    res.status(200).json({
      success: true,
      data: modules,
    });
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch modules",
    });
  }
};

// GET /api/actions
exports.getActions = async (req, res) => {
  try {
    const actions = await Action.findAll({});

    res.status(200).json({
      success: true,
      data: actions,
    });
  } catch (error) {
    console.error("Error fetching actions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch actions",
    });
  }
};

exports.createUserRights = async (req, res) => {
  const { user_id, permissions } = req.body;

  if (!user_id || !Array.isArray(permissions)) {
    return res.status(400).json({ success: false, message: 'Invalid input' });
  }

  try {
    const rightsToInsert = [];

    permissions.forEach(({ module_id, permission_ids }) => {
      permission_ids.forEach(action_id => {
        rightsToInsert.push({ user_id, module_id, action_id });
      });
    });

    await UserRight.bulkCreate(rightsToInsert);

    return res.status(201).json({ success: true, message: 'User rights created successfully' });
  } catch (error) {
    console.error('Error creating user rights:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateUserRights = async (req, res) => {
  //console.log(req.body);
  const { user_id, permissions } = req.body;

  if (!user_id || !Array.isArray(permissions)) {
    return res.status(400).json({ success: false, message: 'Invalid input' });
  }

  try {
    // First delete existing rights
    await UserRight.destroy({ where: { user_id } });

    // Insert new rights
    const rightsToInsert = [];

    permissions.forEach(({ module_id, permission_ids }) => {
      permission_ids.forEach(action_id => {
        rightsToInsert.push({ user_id, module_id, action_id });
      });
    });

    await UserRight.bulkCreate(rightsToInsert);

    return res.status(200).json({ success: true, message: 'User rights updated successfully' });
  } catch (error) {
    console.error('Error updating user rights:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.getUserRights = async (req, res) => {
  const user_id = parseInt(req.params.user_id);

  if (!user_id) {
    return res.status(400).json({ success: false, message: 'Valid user_id is required' });
  }

  try {
    // 1️⃣ Fetch all modules
    const modules = await Module.findAll({
      attributes: ['id']
    });

    // 2️⃣ Fetch user's existing rights
    const rights = await UserRight.findAll({
      where: { user_id },
      attributes: ['module_id', 'action_id']
    });

    // 3️⃣ Group actions by module
    const permissionsMap = rights.reduce((acc, { module_id, action_id }) => {
      if (!acc[module_id]) {
        acc[module_id] = [];
      }
      acc[module_id].push(action_id);
      return acc;
    }, {});

    // 4️⃣ Build final permissions array — one entry per module
    const permissions = modules.map(({ id }) => ({
      module_id: id,
      permission_ids: permissionsMap[id] || []
    }));

     return res.status(200).json({
      user_id,
      permissions
    });

  } catch (error) {
    console.error('Error fetching user rights:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


// exports.getUserRights = async (req, res) => {
//   const user_id = parseInt(req.params.user_id);

//   if (!user_id) {
//     return res.status(400).json({ success: false, message: 'user_id is required' });
//   }

//   try {
//     const rights = await UserRight.findAll({
//       where: { user_id },
//       attributes: ['module_id', 'action_id']
//     });

//     // Group actions by module
//     const permissionsMap = {};

//     rights.forEach(({ module_id, action_id }) => {
//       if (!permissionsMap[module_id]) {
//         permissionsMap[module_id] = [];
//       }
//       permissionsMap[module_id].push(action_id);
//     });

//     const permissions = Object.keys(permissionsMap).map(module_id => ({
//       module_id: parseInt(module_id),
//       permission_ids: permissionsMap[module_id]
//     }));

//     return res.status(200).json({
//       user_id,
//       permissions
//     });
//   } catch (error) {
//     console.error('Error fetching user rights:', error);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// };