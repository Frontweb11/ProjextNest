const Project = require("../models/Project");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

// Helper: upload buffer to cloudinary
const uploadImageToCloudinary = (buffer, folder = "projectnest") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

// @desc    Create a new project
// @route   POST /api/projects
const createProject = async (req, res) => {
  try {
    const { title, description, tags, demoUrl, githubUrl, isPublic } = req.body;
    const internId = req.user._id;

    // Validation
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    let images = [];
    // Handle multiple image uploads (files sent as 'images')
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const result = await uploadImageToCloudinary(req.files[i].buffer);
        images.push({
          url: result.secure_url,
          publicId: result.public_id,
          order: i,
        });
      }
    }

    const project = await Project.create({
      title,
      description,
      tags: tags
        ? Array.isArray(tags)
          ? tags
          : tags.split(",").map((t) => t.trim())
        : [],
      demoUrl,
      githubUrl,
      images,
      internId,
      isPublic: isPublic === "false" ? false : true,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects (with filters)
// @route   GET /api/projects
const getProjects = async (req, res) => {
  try {
    const { tag, search, intern, page = 1, limit = 10 } = req.query;
    let query = { isPublic: true };

    // Filter by tag
    if (tag) query.tags = { $in: [tag] };

    // Search by title/description/tags
    if (search) query.$text = { $search: search };

    // Filter by internId
    if (intern) query.internId = intern;

    const projects = await Project.find(query)
      .populate("internId", "name email profilePicture")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's projects (intern)
// @route   GET /api/projects/my
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ internId: req.user._id }).sort(
      "-createdAt",
    );
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "internId",
      "name email profilePicture bio socialLinks",
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    // Increment view count (optional, can be done asynchronously)
    if (project.isPublic) {
      project.viewCount += 1;
      await project.save();
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    // Check ownership
    if (
      project.internId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, tags, demoUrl, githubUrl, isPublic, status } =
      req.body;
    if (title) project.title = title;
    if (description) project.description = description;
    if (tags)
      project.tags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((t) => t.trim());
    if (demoUrl !== undefined) project.demoUrl = demoUrl;
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (isPublic !== undefined) project.isPublic = isPublic;
    if (status) project.status = status;

    // Handle new image uploads (if any)
    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (let i = 0; i < req.files.length; i++) {
        const result = await uploadImageToCloudinary(req.files[i].buffer);
        newImages.push({
          url: result.secure_url,
          publicId: result.public_id,
          order: project.images.length + i,
        });
      }
      project.images.push(...newImages);
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    // Check ownership
    if (
      project.internId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete images from Cloudinary
    for (const img of project.images) {
      await cloudinary.uploader.destroy(img.publicId);
    }
    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a specific image from a project
// @route   DELETE /api/projects/:id/images/:imageId
const deleteImage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (
      project.internId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const imageIndex = project.images.findIndex(
      (img) => img._id.toString() === req.params.imageId,
    );
    if (imageIndex === -1)
      return res.status(404).json({ message: "Image not found" });

    const imageToDelete = project.images[imageIndex];
    await cloudinary.uploader.destroy(imageToDelete.publicId);
    project.images.splice(imageIndex, 1);
    await project.save();
    res.json({ message: "Image deleted", images: project.images });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  deleteImage,
};
