import { Shape } from "../../core/entities/Shape";
import { ShapeImage } from "../../core/entities/ShapeImage";
import { FilterShapeDTO } from "../../../application/dto/FilterShape.dto";

export interface IShapeRepository {
  create(shape: Shape): Promise<void>;
  findById(id: string): Promise<Shape | null>;
  listShapes(filters: FilterShapeDTO): Promise<{ data: Shape[]; total: number }>;
  update(shape: Shape): Promise<void>;
  delete(id: string): Promise<void>;
  addImage(shapeId: string, image: ShapeImage): Promise<void>;
  removeImage(imageId: string): Promise<void>;
  listImagesForShape(shapeId: string): Promise<ShapeImage[]>;
}
