import { Router } from 'express'
import { body, param } from 'express-validator'

import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { projectExists } from '../middleware/project'
import { hasAuthorization, taskBelongsToProject, taskExists } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../controllers/TeamController'

const router: Router = Router()

router.use(authenticate)

router.post('/',
    body('projectName').notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description').notEmpty().withMessage('La Descripción del Proyecto es Obligatorio'),
    handleInputErrors,
    ProjectController.createProject)

router.get('/', ProjectController.getAllProjects)

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
    hasAuthorization,
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
    hasAuthorization,
    param('projectId').isMongoId().withMessage('El Identificador no es Válido'),
    body('name').notEmpty().withMessage('El Nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La Descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTaskById
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
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

router.post('/:projectId/team/find',
    param('projectId').isMongoId().withMessage('El Identificador no es Válido'),
    body('email').isEmail().toLowerCase().withMessage('E-mail no válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.post('/:projectId/team',
    param('projectId').isMongoId().withMessage('El Identificador no es Válido'),
    body('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TeamMemberController.addMemberBtId
)

router.delete('/:projectId/team/:userId',
    param('projectId').isMongoId().withMessage('El Identificador no es Válido'),
    param('userId').isMongoId().withMessage('El Identificador del usuario no es Válido'),
    handleInputErrors,
    TeamMemberController.deleteMemberBtId
)

router.get('/:projectId/team',
    param('projectId').isMongoId().withMessage('El Identificador del proyecto no es Válido'),
    handleInputErrors,
    TeamMemberController.getProjectTeam
)



export default router