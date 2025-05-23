"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const job_controller_1 = __importDefault(require("../controllers/job.controller"));
const admin_middleware_1 = __importDefault(require("../middleware/admin.middleware"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = express_1.default.Router();
const jobController = new job_controller_1.default();
router.post('/new', admin_middleware_1.default, jobController.createJob);
router.get('/all', jobController.getAllJobs);
router.get('/all/admin', admin_middleware_1.default, jobController.getAllJobsAdmin);
router.put('/update/:id', admin_middleware_1.default, jobController.updateJob);
router.delete('/:id', admin_middleware_1.default, jobController.deleteJob);
router.get('/by/id/:id', auth_middleware_1.default, jobController.findJobById);
exports.default = router;
