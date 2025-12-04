import { injectable, inject } from "inversify";
import { v4 as uuid } from "uuid";
import { IFinalProductRepository } from "../../core/interfaces/repositories/IFinalProductRepository";
import { FinalProduct } from "../../core/entities/FinalProduct";
import { CreateFinalProductDTO } from "../dto/CreateFinalProduct.dto";
import { UpdateFinalProductDTO } from "../dto/UpdateFinalProduct.dto";
import { FilterFinalProductDTO } from "../dto/FilterFinalProduct.dto";
import { TYPES } from "../../shared/di/types";

@injectable()
export class FinalProductService {
  constructor(
    @inject(TYPES.IFinalProductRepository)
    private readonly finalProductRepo: IFinalProductRepository
  ) {}

  public async createFinalProduct(dto: CreateFinalProductDTO): Promise<FinalProduct> {
    const finalProductId = uuid();
    const finalProduct = new FinalProduct(
      finalProductId,
      dto.maskId,
      dto.name,
      dto.price,
      dto.category,
      new Date(),
      new Date()
    );
    
    await this.finalProductRepo.create(finalProduct);
    return finalProduct;
  }

  public async getFinalProduct(id: string): Promise<FinalProduct> {
    const finalProduct = await this.finalProductRepo.findById(id);
    if (!finalProduct) {
      throw new Error("Final Product not found");
    }
    return finalProduct;
  }

  public async listFinalProducts(filters: FilterFinalProductDTO): Promise<{ data: FinalProduct[]; total: number }> {
    return this.finalProductRepo.listFinalProducts(filters);
  }

  public async updateFinalProduct(id: string, dto: UpdateFinalProductDTO): Promise<FinalProduct> {
    const finalProduct = await this.getFinalProduct(id);

    if (dto.maskId) finalProduct.maskId = dto.maskId;
    if (dto.name) finalProduct.name = dto.name;
    if (dto.price) finalProduct.price = dto.price;
    if (dto.category) finalProduct.category = dto.category;

    await this.finalProductRepo.update(finalProduct);
    return finalProduct;
  }

  public async deleteFinalProduct(id: string): Promise<void> {
    await this.finalProductRepo.delete(id);
  }
}
