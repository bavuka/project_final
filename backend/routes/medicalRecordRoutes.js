import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  storeMedicalRecord,
  getAllMedicalRecordsJSON,
  getMedicalRecordsByUser,
  getDoctorsVisitedByUser,
  deleteMedicalRecord,
} from '../controllers/medicalRecordController.js';
import { ensureUploadsDirectory } from '../utils/fileUtils.js';

const router = express.Router();
ensureUploadsDirectory();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('text/')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDFs and text files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post('/', upload.single('file'), storeMedicalRecord);
router.get('/user/:userId/doctors', getDoctorsVisitedByUser);
router.get('/user/:userId/:doctorId', getAllMedicalRecordsJSON);
router.get('/user/:userId', getMedicalRecordsByUser);
router.delete("/delete/:recordId", deleteMedicalRecord);
export default router;
