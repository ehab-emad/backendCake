import { Mask } from "../../core/entities/Mask";
import { MaskImage } from "../../core/entities/MaskImage";
import { FilterMaskDTO } from "../../../application/dto/FilterMask.dto";

export interface IMaskRepository {
  create(mask: Mask): Promise<void>;
  findById(id: string): Promise<Mask | null>;
  listMasks(filters: FilterMaskDTO): Promise<{ data: Mask[]; total: number }>;
  update(mask: Mask): Promise<void>;
  delete(id: string): Promise<void>;
  addImage(maskId: string, image: MaskImage): Promise<void>;
  removeImage(imageId: string): Promise<void>;
  listImagesForMask(maskId: string): Promise<MaskImage[]>;
}
