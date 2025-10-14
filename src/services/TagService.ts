import { Tag, ITag } from "../models/TagModel";

export class TagService {
  static async createTag(data: Partial<ITag>) {
    const tag = new Tag(data);
    return tag.save();
  }

  static async getAllTags() {
    return Tag.find();
  }

  static async getTagById(id: string) {
    return Tag.findById(id);
  }

  static async updateTag(id: string, data: Partial<ITag>) {
    return Tag.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteTag(id: string) {
    return Tag.findByIdAndDelete(id);
  }
}
