import { FinalProduct } from "../../core/entities/FinalProduct";
import { FilterFinalProductDTO } from "../../../application/dto/FilterFinalProduct.dto";

export interface IFinalProductRepository {
  create(finalProduct: FinalProduct): Promise<void>;
  findById(id: string): Promise<FinalProduct | null>;
  listFinalProducts(filters: FilterFinalProductDTO): Promise<{ data: FinalProduct[]; total: number }>;
  update(finalProduct: FinalProduct): Promise<void>;
  delete(id: string): Promise<void>;
}
