// src/application/services/MimoService.ts
import { injectable } from "inversify";
import { MimoClient } from "../../infrastructure/mimo/client";
import { CancelMimoOrderDTO, CaptureMimoOrderDTO, CreateMamoLinkDTO, CreateMimoOrderDTO, RefundMimoOrderDTO } from "../dto/mimoOrder.dto";


@injectable()
export class MimoService {
  private readonly client = new MimoClient();

 async createOrder(dto: CreateMamoLinkDTO) {
  const payload = dto;
  console.log("🔍 Payload being sent to Mamo:", JSON.stringify(payload, null, 2));

  try {
    const res = await this.client.createCharge(payload);
    return res.data;
  } catch (error: any) {

  console.error("❌ ERROR STATUS:", error.response?.status);
  console.error("❌ ERROR DATA:", JSON.stringify(error.response?.data, null, 2));
  console.error("❌ FULL ERROR:", error.toJSON?.());
  console.dir(error, { depth: null });
  throw error;
}

}
async captureOrder(chargeId: string, dto: CaptureMimoOrderDTO) {
  try {
    const res = await this.client.captureCharge(chargeId, {
      amount: dto.amount,
    });
    return res.data;
  } catch (err: any) {
    console.error("❌ Error from Mamo API:", err.response?.data || err.message);
    throw err; // خليه يترمي للكنترولر
  }
}



  async refundOrder(dto: RefundMimoOrderDTO) {
    const res = await this.client.refundCharge(dto.paymentId, {
      amount: dto.amount,
      reason: dto.reason,
    });
    return res.data;
  }


//   async cancelOrder(dto: CancelMimoOrderDTO) {
//     const res = await this.client.cancelPayment(dto.paymentId, {
//       reason: dto.reason,
//     });
//     return res.data;
//   }

  async createPaymentLink(dto: CreateMamoLinkDTO) {
    const res = await this.client.createLink(dto);
    return res.data;
  }

  async getLinkDetails(linkId: string) {
    const res = await this.client.getLink(linkId);
    return res.data;
  }
  
  async getOrder(paymentId: string) {
    const res = await this.client.getPayment(paymentId);
    return res.data;
  }
}
