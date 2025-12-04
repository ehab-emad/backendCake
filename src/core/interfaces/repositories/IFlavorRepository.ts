import { Flavor } from "../../core/entities/Flavor";
import { FlavorImage } from "../../core/entities/FlavorImage";
import { FilterFlavorDTO } from "../../../application/dto/FilterFlavor.dto";

export interface IFlavorRepository {
  create(flavor: Flavor): Promise<void>;
  findById(id: string): Promise<Flavor | null>;
  listFlavors(filters: FilterFlavorDTO): Promise<{ data: Flavor[]; total: number }>;
  update(flavor: Flavor): Promise<void>;
  delete(id: string): Promise<void>;
  addImage(flavorId: string, image: FlavorImage): Promise<void>;
  removeImage(imageId: string): Promise<void>;
  listImagesForFlavor(flavorId: string): Promise<FlavorImage[]>;
}
