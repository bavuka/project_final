import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import {sendReminderEmail} from "../controllers/emailController.js";

const redisConnection = new Redis({
  host: "127.0.0.1", // Change if Redis is running on another machine
  port: 6379,
  maxRetriesPerRequest: null, 
});

const appointmentQueue = new Queue("appointmentReminderQueue", { connection: redisConnection });

// Worker to process scheduled jobs
const worker = new Worker(
  "appointmentReminderQueue",
  async (job) => {
    const { patientEmail, appointmentData } = job.data;
    await sendReminderEmail(patientEmail, appointmentData);
    console.log("✅ Reminder email sent for:", appointmentData);
  },
  { connection: redisConnection,
    attempts: 5, 
    backoff: 5000, }
);

export default appointmentQueue;
