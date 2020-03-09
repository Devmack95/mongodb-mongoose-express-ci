const db = require('../db')
const User = require('../models/user')
const Project = require('../models/project')

db.on('error', console.error.bind(console, 'Mongodb connection error'))

const createUser = async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    return res.status(200).json(user)
  } catch (e) {
    return res.status(500).json({ e: e.message })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    return res.status(200).json(users)
  } catch (e) {
    return res.status(500).json({ e: e.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    await User.findByIdAndUpdate(id, req.body, { new: true }, (err, user) => {
      if (err) {
        res.status(500).send(err)
      }
      if (!user) {
        res.status(500).send('User not found')
      }
      return res.status(200).json(user)
    })
  } catch (e) {
    res.status(500).send(e.message)
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await User.findByIdAndDelete(id)
    if (deleted) {
      return res.status(200).send('User deleted')
    }
    throw new Error('user not found')
  } catch (e) {
    return res.status(500).send(e.message)
  }
}

const getProjectByUserId = async (req, res) => {
  try {
    const { user_id, project_id } = req.params
    const project = await Project.findOne({ user_id: user_id, _id: project_id })
    if (project) {
      return res.status(200).json(project)
    }
    return res.status(404).send('Project with the specified ID does not exist')
  } catch (e) {
    return res.status(500).send(e.message)
  }
}

const getProjectsFromUser = async (req, res) => {
  try {
    const { user_id } = req.params
    const projects = await Project.find({ user_id: user_id })
    if (projects) {
      return res.status(200).json(projects)
    }
    return res.status(404).send('User with specified ID does not exist')
  } catch (e) {
    return res.status(500).send(e.message)
  }
}

const createProject = async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id)
    const project = new Project(req.body)
    project.user_id = user._id
    await project.save()
    return res.status(201).json(project)
  } catch (e) {
    return res.status(500).json({ e: e.message })
  }
}

const getProject = async (req, res) => {
  try {
    const { id } = req.params
    const project = await Project.findById(id)
    return res.status(200).json(project)
  } catch (e) {
    return res.status(500).send(e.message)
  }
}

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
    return res.status(200).json(projects)
  } catch (e) {
    res.status(500).send(e.message)
  }
}

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndUpdate(id, req.body, { new: true }, (err, project) => {
      if (err) {
        res.status(500).send(err);
      }
      if (!project) {
        res.status(500).send('Project not found!');
      }
      return res.status(200).json(project)
    })
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Project.findByIdAndDelete(id)
    if (deleted) {
      return res.status(200).send('Project deleted')
    }
    throw new Error('Project not found')
  } catch (e) {
    return res.status(500).send(e.message)
  }
}

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getProjectByUserId,
  getProjectsFromUser,
  createProject,
  updateProject,
  deleteProject,
  getProject,
  getAllProjects
}