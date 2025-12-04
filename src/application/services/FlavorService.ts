import { injectable, inject } from "inversify";
import { v4 as uuid } from "uuid";
import { IFlavorRepository } from "../../core/interfaces/repositories/IFlavorRepository";
import { Flavor } from "../../core/entities/Flavor";
import { FlavorImage } from "../../core/entities/FlavorImage";
import { CreateFlavorDTO } from "../dto/CreateFlavor.dto";
import { UpdateFlavorDTO } from "../dto/UpdateFlavor.dto";
import { FilterFlavorDTO } from "../dto/FilterFlavor.dto";
import { TYPES } from "../../shared/di/types";

@injectable()
export class FlavorService {
  constructor(
    @inject(TYPES.IFlavorRepository)
    private readonly flavorRepo: IFlavorRepository
  ) {}

  public async createFlavor(dto: CreateFlavorDTO): Promise<Flavor> {
    const flavorId = uuid();
    const flavor = new Flavor(
      flavorId,
      dto.name,
      dto.shapeId,
      dto.price,
      new Date(),
      new Date()
    );

    // Handle uploaded images for creation
    if (dto.frontImage) {
      flavor.addImage(new FlavorImage(uuid(), flavorId, dto.frontImage));
    }
    if (dto.sideImage) {
      flavor.addImage(new FlavorImage(uuid(), flavorId, dto.sideImage));
    }
    if (dto.leftImage) {
      flavor.addImage(new FlavorImage(uuid(), flavorId, dto.leftImage));
    }
    
    await this.flavorRepo.create(flavor);
    return flavor;
  }

  public async getFlavor(id: string): Promise<Flavor> {
    const flavor = await this.flavorRepo.findById(id);
    if (!flavor) {
      throw new Error("Flavor not found");
    }
    return flavor;
  }

  public async listFlavors(filters: FilterFlavorDTO): Promise<{ data: Flavor[]; total: number }> {
    return this.flavorRepo.listFlavors(filters);
  }

  public async updateFlavor(id: string, dto: UpdateFlavorDTO): Promise<Flavor> {
    const flavor = await this.getFlavor(id);

    if (dto.name) flavor.name = dto.name;
    if (dto.shapeId) flavor.shapeId = dto.shapeId;
    if (dto.price) flavor.price = dto.price;

    // Handle uploaded images for update
    if (dto.frontImage) {
      flavor.addImage(new FlavorImage(uuid(), id, dto.frontImage));
    }
    if (dto.sideImage) {
      flavor.addImage(new FlavorImage(uuid(), id, dto.sideImage));
    }
    if (dto.leftImage) {
      flavor.addImage(new FlavorImage(uuid(), id, dto.leftImage));
    }

    if (dto.removeImageIds && dto.removeImageIds.length > 0) {
      for (const imageId of dto.removeImageIds) {
        flavor.removeImage(imageId);
      }
    }

    await this.flavorRepo.update(flavor);
    return flavor;
  }

  public async deleteFlavor(id: string): Promise<void> {
    await this.flavorRepo.delete(id);
  }

  public async addImage(flavorId: string, imageUrl: string): Promise<Flavor> {
    const flavor = await this.getFlavor(flavorId);
    const image = new FlavorImage(uuid(), flavorId, imageUrl);
    flavor.addImage(image);
    await this.flavorRepo.addImage(flavorId, image);
    return flavor;
  }

  public async removeImage(flavorId: string, imageId: string): Promise<FlavorImage[]> {
    const flavor = await this.getFlavor(flavorId);
    flavor.removeImage(imageId);
    await this.flavorRepo.removeImage(imageId);
    return this.flavorRepo.listImagesForFlavor(flavorId);
  }
}
