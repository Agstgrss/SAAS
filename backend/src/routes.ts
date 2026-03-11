import { Router } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController"
import { CreateTenantController } from "./controllers/tenant/CreateTenantController"
import { ListTenantsController } from "./controllers/tenant/ListTenantsController"
import { AuthUserController } from "./controllers/user/AuthUserController"
import { validateSchema } from "./middlewares/validateSchema";
import { authUserSchema, createUserSchema } from "./schemas/userSchema";
import { createTenantSchema } from "./schemas/createTenantSchema";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateProjectController } from "./controllers/project/CreateProjectController";
import { createProjectSchema } from "./schemas/projectSchema";
import { CreateTaskController } from "./controllers/task/CreateTaskController";
import { createTaskSchema, updateTaskSchema } from "./schemas/taskSchema";
import { ListProjectsController } from "./controllers/project/ListProjectsController";
import { ListTasksController } from "./controllers/task//ListTaskController";
import { UpdateTaskController } from "./controllers/task/UpdateTaskController";
import { DeleteTaskController } from "./controllers/task/DeleteTaskController";

const router = Router();

router.post("/users", validateSchema(createUserSchema), new CreateUserController().handle)
router.post("/tenants", validateSchema(createTenantSchema),new CreateTenantController().handle);
router.get("/tenants", new ListTenantsController().handle);
router.post("/session", validateSchema(authUserSchema), new AuthUserController().handle)
router.get("/me", isAuthenticated, new DetailUserController().handle)   
router.post("/projects", isAuthenticated, validateSchema(createProjectSchema), new CreateProjectController().handle)
router.get("/projects", isAuthenticated, new ListProjectsController().handle);
router.get("/tasks", isAuthenticated,new ListTasksController().handle);
router.post("/tasks", isAuthenticated, validateSchema(createTaskSchema), new CreateTaskController().handle)
router.put("/tasks/:id", isAuthenticated, validateSchema(updateTaskSchema), new UpdateTaskController().handle);
router.delete("/tasks/:id", isAuthenticated, new DeleteTaskController().handle);


export default router;
