import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubtask {
  _id?: Types.ObjectId;
  title: string;
  assignedTo?: string[];
  dueDate?: Date;
  done: boolean;
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "todo" | "inprogress" | "done" | "backlog" | string;
  evaluationStatus?: "pending" | "approved" | "rejected";
  client?: Types.ObjectId;
  project?: Types.ObjectId;
  product?: Types.ObjectId;
  createdBy: string;
  assignedTo?: string[];
  tags?: string[];
  subtasks: ISubtask[];
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
}

const SubtaskSchema = new Schema<ISubtask>(
  {
    title: { type: String, required: true },
    assignedTo: { type: [String], default: [] },
    dueDate: { type: Date, default: null },
    done: { type: Boolean, default: false },
  },
  { _id: true }
);

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: String, default: "todo" },
    tags: { type: [String], default: [] },
    evaluationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    client: { type: Schema.Types.ObjectId, ref: "Cliente" },
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    createdBy: { type: String, required: true },
    assignedTo: { type: [String], default: [] },
    subtasks: { type: [SubtaskSchema], default: [] },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", TaskSchema, "Tarefas");
