import { injectable, inject } from "inversify";
import axios from "axios";
import { IAppConfig } from "../../core/config/IAppConfig";
import {
  CreateTamaraOrderDTO,
  CreateTamaraOrderSchema,
  Address,
  CancelTamaraOrderDTO,
  RefundTamaraOrderDTO,
  CaptureTamaraOrderDTO,
} from "../dto/TamaraOrder.dto";
import { TYPES } from "../../shared/di/types";
import { TamaraClient } from "../../infrastructure/tamara/client";

interface TamaraItemPayload {
  name: string;
  type: string;
  reference_id: string;
  sku: string;
  quantity: number;
  tax_amount: { amount: number; currency: string };
  unit_price: { amount: number; currency: string };
  total_amount: { amount: number; currency: string };
  item_url: string;
  image_url: string;
  discount_amount?: { amount: number; currency: string };
}

@injectable()
export class TamaraService {
  private readonly baseUrl: string;
  private readonly apiToken: string;

  constructor(@inject(TYPES.Config) private cfg: IAppConfig) {
    this.baseUrl = cfg.TAMARA_BASE_URL;
    this.apiToken = cfg.TAMARA_API_TOKEN!;
  }

  private mapAddress(addr: Address) {
    return {
      first_name: addr.firstName,
      last_name: addr.lastName,
      line1: addr.line1,
      ...(addr.line2 && { line2: addr.line2 }),
      city: addr.city,
      region: addr.region,
      postal_code: addr.postalCode,
      country_code: addr.countryCode,
      phone_number: addr.phoneNumber,
    };
  }

  public async createPaymentLink(payload: any): Promise<{ data: { redirect_url: string } }> {
    const url = `${this.baseUrl}/checkout`;
    
    console.log('Tamara createPaymentLink payload:', JSON.stringify(payload, null, 2));
    
    const resp = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
    });
    return { data: { redirect_url: resp.data.checkout_url || resp.data } };
  }
  public async createOrder(
    dto: CreateTamaraOrderDTO
  ): Promise<{ checkoutUrl: string }> {
    const valid = CreateTamaraOrderSchema.parse(dto);

    const items: TamaraItemPayload[] = valid.items.map((i) => ({
      name: i.name,
      type: i.type,
      reference_id: i.referenceId,
      sku: i.sku,
      quantity: i.quantity,
      tax_amount: {
        amount: i.taxAmount.amount,
        currency: i.taxAmount.currency,
      },
      unit_price: {
        amount: i.unitPrice.amount,
        currency: i.unitPrice.currency,
      },
      total_amount: {
        amount: i.totalAmount.amount,
        currency: i.totalAmount.currency,
      },
      item_url: i.itemUrl,
      image_url: i.imageUrl,
      ...(i.discountAmount && {
        discount_amount: {
          amount: i.discountAmount.amount,
          currency: i.discountAmount.currency,
        },
      }),
    }));

    const payload = {
      total_amount: {
        amount: valid.totalAmount.amount,
        currency: valid.totalAmount.currency,
      },
      shipping_amount: {
        amount: valid.shippingAmount.amount || 0,
        currency: valid.shippingAmount.currency,
      },
      tax_amount: {
        amount: valid.taxAmount.amount,
        currency: valid.taxAmount.currency,
      },
      order_reference_id: valid.orderReferenceId,
      order_number: valid.orderNumber,
      ...(valid.discount && {
        discount: {
          amount: {
            amount: valid.discount.amount.amount,
            currency: valid.discount.amount.currency,
          },
          name: valid.discount.name,
        },
      }),
      items,
      consumer: {
        email: valid.consumer.email,
        first_name: valid.consumer.firstName,
        last_name: valid.consumer.lastName,
        phone_number: valid.consumer.phoneNumber,
      },
      country_code: valid.countryCode,
      description:
        valid.description && valid.description.trim()
          ? valid.description
          : `Order ${valid.orderNumber}`,
      merchant_url: {
        cancel: valid.merchantUrl.cancel,
        failure: valid.merchantUrl.failure,
        success: valid.merchantUrl.success,
        notification: valid.merchantUrl.notification,
      },
      payment_type:
        valid.paymentType === "FULL_PAYMENT"
          ? "PAY_IN_FULL"
          : valid.paymentType,
      instalments: valid.instalments,
      billing_address: this.mapAddress(valid.billingAddress),
      shipping_address: this.mapAddress(valid.shippingAddress),
      ...(valid.platform && { platform: valid.platform }),
      ...(valid.isMobile !== undefined && { is_mobile: valid.isMobile }),
      ...(valid.locale && { locale: valid.locale }),
      ...(valid.riskAssessment && { risk_assessment: valid.riskAssessment }),
      ...(valid.additionalData && { additional_data: valid.additionalData }),
    };

    console.debug(
      "Tamara createCheckout payload:",
      JSON.stringify(payload, null, 2)
    );

    const resp = await axios.post(`${this.baseUrl}/checkout`, payload, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
    });
    return { checkoutUrl: resp.data.checkout_url || resp.data };
  }

  public async cancelOrder(dto: CancelTamaraOrderDTO): Promise<void> {
    const body = dto.cancelReason ? { cancel_reason: dto.cancelReason } : {};
    await this.client.cancelOrder(dto.orderId, {
      cancel_reason: dto.cancelReason ?? "CUSTOMER_REQUEST",
      total_amount: {
        amount: dto.amount,
        currency: dto.currency
      }
    });
  }

  private readonly client = new TamaraClient();
//   public async captureOrder(orderId: string): Promise<void> {
//   await this.client.captureOrder({ order_id: orderId });
// }
// public async getOrder(orderId: string): Promise<unknown> {
//   const res = await this.client.getOrder(orderId);
//   return res.data;
// }

// public async updateReference(orderId: string, body: { order_reference_id: string }): Promise<void> {
//   await this.client.updateOrderReference(orderId, body);
// }
// public async captureOrder(dto: CaptureTamaraOrderDTO): Promise<void> {
//   const {
//     orderId,
//     amount,
//     currency,
//     shippingAmount,
//     taxAmount,
//     discountAmount,
//     description,
//   } = dto;

//   const body = {
//     order_id: orderId,
//     capture_amount: {
//       amount,
//       currency,
//     },
//     shipping_amount: shippingAmount ? { amount: shippingAmount, currency } : undefined,
//     tax_amount: taxAmount ? { amount: taxAmount, currency } : undefined,
//     discount_amount: discountAmount ? { amount: discountAmount, currency } : undefined,
//     description,
//   };

//   // remove undefined values (clean object)
//   const cleanedBody = JSON.parse(JSON.stringify(body));

//   await this.client.captureOrder(cleanedBody);
// }

public async captureOrder(
  dto: Omit<CaptureTamaraOrderDTO, "orderId"> & { orderId: string }
): Promise<void> {
  const {
    orderId,
    amount,
    currency,
    shippingAmount,
    taxAmount,
    discountAmount,
    description,
  } = dto;

  const body = {
    order_id: orderId,
    capture_amount: { amount, currency },
    shipping_amount: shippingAmount ? { amount: shippingAmount, currency } : undefined,
    tax_amount: taxAmount ? { amount: taxAmount, currency } : undefined,
    discount_amount: discountAmount ? { amount: discountAmount, currency } : undefined,
    description,
  };

  const cleanedBody = JSON.parse(JSON.stringify(body));
  console.log("📦 Capture Order Body:", cleanedBody);

  await this.client.captureOrder(cleanedBody);
}




public async authoriseOrder(orderId: string): Promise<void> {
  await this.client.authoriseOrder(orderId);
}

 public async refundOrder(dto: RefundTamaraOrderDTO): Promise<void> {
  await this.client.simplifiedRefund(dto.orderId, {
    total_amount: {
      amount: dto.amount,
      currency: dto.currency,
    },
    comment: dto.comment, // ← لازم يتم إرساله
    ...(dto.reason && { reason: dto.reason }), // ← لو حبيت تبعته كمان
  });
  
}


}
