import { injectable, inject } from "inversify";
import { v4 as uuid } from "uuid";
import { IMaskRepository } from "../../core/interfaces/repositories/IMaskRepository";
import { Mask } from "../../core/entities/Mask";
import { MaskImage } from "../../core/entities/MaskImage";
import { CreateMaskDTO } from "../dto/CreateMask.dto";
import { UpdateMaskDTO } from "../dto/UpdateMask.dto";
import { FilterMaskDTO } from "../dto/FilterMask.dto";
import { TYPES } from "../../shared/di/types";

@injectable()
export class MaskService {
  constructor(
    @inject(TYPES.IMaskRepository)
    private readonly maskRepo: IMaskRepository
  ) {}

  public async createMask(dto: CreateMaskDTO): Promise<Mask> {
    const maskId = uuid();
    const mask = new Mask(
      maskId,
      dto.name,
      dto.shapeId,
      dto.flavorId,
      dto.price,
      new Date(),
      new Date()
    );

    // Handle uploaded images for creation
    if (dto.frontImage) {
      mask.addImage(new MaskImage(uuid(), maskId, dto.frontImage));
    }
    if (dto.sideImage) {
      mask.addImage(new MaskImage(uuid(), maskId, dto.sideImage));
    }
    if (dto.leftImage) {
      mask.addImage(new MaskImage(uuid(), maskId, dto.leftImage));
    }
    
    await this.maskRepo.create(mask);
    return mask;
  }

  public async getMask(id: string): Promise<Mask> {
    const mask = await this.maskRepo.findById(id);
    if (!mask) {
      throw new Error("Mask not found");
    }
    return mask;
  }

  public async listMasks(filters: FilterMaskDTO): Promise<{ data: Mask[]; total: number }> {
    return this.maskRepo.listMasks(filters);
  }

  public async updateMask(id: string, dto: UpdateMaskDTO): Promise<Mask> {
    const mask = await this.getMask(id);

    if (dto.name) mask.name = dto.name;
    if (dto.shapeId) mask.shapeId = dto.shapeId;
    if (dto.flavorId) mask.flavorId = dto.flavorId;
    if (dto.price) mask.price = dto.price;

    // Handle uploaded images for update
    if (dto.frontImage) {
      mask.addImage(new MaskImage(uuid(), id, dto.frontImage));
    }
    if (dto.sideImage) {
      mask.addImage(new MaskImage(uuid(), id, dto.sideImage));
    }
    if (dto.leftImage) {
      mask.addImage(new MaskImage(uuid(), id, dto.leftImage));
    }

    if (dto.removeImageIds && dto.removeImageIds.length > 0) {
      for (const imageId of dto.removeImageIds) {
        mask.removeImage(imageId);
      }
    }

    await this.maskRepo.update(mask);
    return mask;
  }

  public async deleteMask(id: string): Promise<void> {
    await this.maskRepo.delete(id);
  }

  public async addImage(maskId: string, imageUrl: string): Promise<Mask> {
    const mask = await this.getMask(maskId);
    const image = new MaskImage(uuid(), maskId, imageUrl);
    mask.addImage(image);
    await this.maskRepo.addImage(maskId, image);
    return mask;
  }

  public async removeImage(maskId: string, imageId: string): Promise<MaskImage[]> {
    const mask = await this.getMask(maskId);
    mask.removeImage(imageId);
    await this.maskRepo.removeImage(imageId);
    return this.maskRepo.listImagesForMask(maskId);
  }
}
