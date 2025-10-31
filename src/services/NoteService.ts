import { Note, INote } from "../models/NoteModel";

export class NoteService {
  async createNote(content: string, userId: string): Promise<INote> {
    const note = new Note({
      content,
      timestamp: Date.now(),
      createdBy: userId,
    });

    return await note.save();
  }

  async getAllNotes(): Promise<INote[]> {
    return await Note.find()
      .sort({ timestamp: -1 })
      .populate("createdBy", "username email")
      .exec();
  }

  async getNotesByUser(userId: string): Promise<INote[]> {
    return await Note.find({ createdBy: userId })
      .populate("createdBy", "username")
      .sort({ timestamp: -1 })
      .exec();
  }
  async getNoteById(id: string): Promise<INote | null> {
    return await Note.findById(id).exec();
  }

  async updateNote(id: string, content: string): Promise<INote | null> {
    return await Note.findByIdAndUpdate(
      id,
      { content, timestamp: Date.now() },
      { new: true, runValidators: true }
    ).exec();
  }

  async deleteNote(id: string): Promise<boolean> {
    const result = await Note.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async deleteAllNotes(): Promise<number> {
    const result = await Note.deleteMany({}).exec();
    return result.deletedCount || 0;
  }
}
