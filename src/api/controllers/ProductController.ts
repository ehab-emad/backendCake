import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";

import { ProductService } from "../../application/services/ProductService";
import { CreateProductDTO } from "../../application/dto/CreateProduct.dto";
import { UpdateProductDTO } from "../../application/dto/UpdateProduct.dto";
import { FilterProductDTO } from "../../application/dto/FilterProduct.dto";
import { TYPES } from "../../shared/di/types";
import { CreateProductSchema } from "../../application/dto/CreateProduct.dto";
import { UpdateProductSchema } from "../../application/dto/UpdateProduct.dto";
import { FilterProductSchema } from "../../application/dto/FilterProduct.dto";

@injectable()
export class ProductController {
  constructor(
    @inject(TYPES.ProductService)
    private readonly productService: ProductService
  ) {}

  public async listProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = FilterProductSchema.parse(req.query);
      const result = await this.productService.listProducts(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateProductSchema.parse(req.body);
      const product = await this.productService.createProduct(dto);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  public async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.productService.getProduct(req.params.id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  public async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = UpdateProductSchema.parse(req.body);
      const product = await this.productService.updateProduct(req.params.id, dto);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  public async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await this.productService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  public async addRating(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const rating = req.body;
      const result = await this.productService.addRating(id, rating);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public async removeImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, imageId } = req.params;
      const images = await this.productService.removeImage(productId, imageId);
      res.json(images);
    } catch (error) {
      next(error);
    }
  }
}
