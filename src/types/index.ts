export interface VendorDetails {
  vendor_id: string;
  vendor_name: string;
  vendor_address: string;
  phone_number: string;
  account_number: string;
  bank_name: string;
  account_name: string;
}

export interface ItemDetails {
  item_id: string;
  item_name: string;
  item_quantity: number;
  item_unit_price: number;
  item_total_price: number;
}

export interface PurchaseOrderDetails {
  purchase_order_id: string;
  purchase_order_number: string;
  purchase_order_status: "pending" | "approved";
  ordered_by: string;
  created_on: Date;
  vendor: VendorDetails;
  items: ItemDetails;
}
