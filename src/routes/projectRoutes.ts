import { Router } from 'express'
import { body, param } from 'express-validator'

import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { projectExists } from '../middleware/project'
import { taskBelongsToProject, taskExists } from '../middleware/task'
import { authenticate } from '../middleware/auth'

const router: Router = Router()

router.use(authenticate)

router.post('/',
    body('projectName').notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description').notEmpty().withMessage('La Descripción del Proyecto es Obligatorio'),
    handleInputErrors,
    ProjectController.createProject)

router.get('/',ProjectController.getAllProjects)

router.get('/:id',
    param('id').notEmpty().withMessage('El Identificador del Proyecto es Obligatorio')
        .isMongoId().withMessage('El Identificador no es Válido'),
    handleInputErrors,
    ProjectController.getProjectById)

router.put('/:id',
    param('id').isMongoId().withMessage('El Identificador no es Válido'),
    body('projectName').notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description').notEmpty().withMessage('La Descripción del Proyecto es Obligatorio'),
    handleInputErrors,
    ProjectController.updateProjectById
)
router.delete('/:id',
    param('id').notEmpty().withMessage('El Identificador del Proyecto es Obligatorio')
        .isMongoId().withMessage('El Identificador no es Válido'),
    handleInputErrors,
    ProjectController.deleteProjectById
)

router.param('projectId', projectExists)

router.post('/:projectId/tasks',
    param('projectId').isMongoId().withMessage('El Identificador no es Válido'),
    body('name').notEmpty().withMessage('El Nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La Descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    param('projectId').isMongoId().withMessage('El Identificador no es Válido'),
    handleInputErrors,
    TaskController.getProjectTasks
)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('projectId').isMongoId().withMessage('El Identificador no es Válido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    param('projectId').isMongoId().withMessage('El Identificador no es Válido'),
    body('name').notEmpty().withMessage('El Nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La Descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTaskById
)

router.delete('/:projectId/tasks/:taskId',
    param('projectId').isMongoId().withMessage('El Identificador no es Válido'),
    handleInputErrors,
    TaskController.deleteTaskById
)

router.post('/:projectId/tasks/:taskId/status',
    param('projectId').isMongoId().withMessage('El Identificador no es Válido'),
    body('status').notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)

export default router