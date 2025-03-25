import { DataTypes } from "sequelize";
import {sequelize} from "../config/postgres.js";

const ZoomMeeting = sequelize.define(
  "ZoomMeeting",
  {
    patient_id: { type: DataTypes.STRING, allowNull: false },
    doctor_id: { type: DataTypes.STRING, allowNull: false },
    meeting_url: { type: DataTypes.TEXT, allowNull: false },
    start_time: { type: DataTypes.DATE, allowNull: false },
  },
  {
    timestamps: true,
    tableName: "zoom_meetings",
  }
);

export default ZoomMeeting;
