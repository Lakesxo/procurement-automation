"use client";

import { ArrowLeftIcon, SuccessIcon } from "@/assets/icons/icons";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { Modal, Skeleton, message } from "antd";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface EditOrderProps {}

const FormSchema = z.object({
  item_name: z.string().min(2, {
    message: "Item name is required.",
  }),
  item_quantity: z.string().min(1, {
    message: "Item quantity is required.",
  }),
  description: z.string().optional(),
  item_unit_price: z.string().min(1, {
    message: "Item unit price is required.",
  }),
  item_total_price: z.string(),
  ordered_by: z.string().min(2, {
    message: "Item name is required.",
  }),
  vendor_name: z.string().min(2, {
    message: "Vendor name is required.",
  }),
  phone_number: z.string().min(2, {
    message: "Vendor phone number is required.",
  }),
  vendor_address: z.string().min(2, {
    message: "Vendor address is required.",
  }),
  account_number: z.string().min(2, {
    message: "Vendor account number is required.",
  }),
  bank_name: z.string().min(2, {
    message: "Vendor bank name is required.",
  }),
  account_name: z.string().min(2, {
    message: "Vendor account name is required.",
  }),
});

const EditOrder: React.FunctionComponent<EditOrderProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const params = useParams();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      item_name: selectedOrder?.items?.item_name,
      item_quantity: selectedOrder?.items?.item_quantity?.toString(),
      description: selectedOrder?.items?.description,
      item_unit_price: selectedOrder?.items?.item_unit_price?.toString(),
      item_total_price: selectedOrder?.items?.item_total_price?.toString(),
      ordered_by: selectedOrder?.ordered_by,
      vendor_name: selectedOrder?.vendor?.vendor_name,
      phone_number: selectedOrder?.vendor?.phone_number,
      vendor_address: selectedOrder?.vendor?.vendor_address,
      account_number: selectedOrder?.vendor?.account_number,
      bank_name: selectedOrder?.vendor?.bank_name,
      account_name: selectedOrder?.vendor?.account_name,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await fetch(`/api/order/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(selectedOrder),
    })
      .then((res) => {
        setIsModalOpen(true);
        form.reset();
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Error creating order",
        });
      });
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["order"],
    queryFn: async () => {
      const response = await fetch(`/api/order/${params.id}`).then((res) =>
        res.json()
      );
      setSelectedOrder(response);
      return response;
    },
  });

  if (isPending) {
    return (
      <Layout>
        <Skeleton className="py-5 px-5" active paragraph={{ rows: 6 }} />
      </Layout>
    );
  }

  return (
    <Layout>
      {contextHolder}
      <div>
        <button
          className="flex items-center gap-1"
          onClick={() => router.back()}
        >
          <span>
            <ArrowLeftIcon />
          </span>
          <span className="text-[#2D3339] font-semibold">Back</span>
        </button>
      </div>
      <div className="bg-white rounded-[10px] mt-10 p-6">
        <p className="text-[#2B2829] text-xl mb-8 font-semibold">
          Purchase Order Form
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="flex gap-5 max-sm:flex-wrap">
              <FormField
                control={form.control}
                name="item_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Item</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter item name"
                        {...field}
                        value={selectedOrder?.items?.item_name}
                        onChange={(e) => {
                          form.setValue("item_name", e.target.value);
                          setSelectedOrder({
                            ...selectedOrder,
                            items: {
                              ...selectedOrder?.items,
                              item_name: e.target.value,
                            },
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="item_quantity"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter quantity"
                        {...field}
                        value={selectedOrder?.items?.item_quantity}
                        onChange={(e) => {
                          form.setValue("item_quantity", e.target.value);
                          setSelectedOrder({
                            ...selectedOrder,
                            items: {
                              ...selectedOrder?.items,
                              item_quantity: e.target.value,
                              item_total_price:
                                parseInt(e.target.value) *
                                selectedOrder.items.item_unit_price,
                            },
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter description"
                        {...field}
                        value={selectedOrder?.items?.item_description}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-5 mt-6 max-sm:flex-wrap">
              <FormField
                control={form.control}
                name="item_unit_price"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Unit price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        value={selectedOrder?.items?.item_unit_price}
                        onChange={(e) => {
                          form.setValue("item_unit_price", e.target.value);
                          setSelectedOrder({
                            ...selectedOrder,
                            items: {
                              ...selectedOrder?.items,
                              item_unit_price: parseInt(e.target.value),
                              item_total_price:
                                parseInt(e.target.value) *
                                selectedOrder.items.item_quantity,
                            },
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="item_total_price"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Total price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        disabled
                        {...field}
                        value={selectedOrder?.items?.item_total_price}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ordered_by"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Ordered by</FormLabel>
                    <FormControl>
                      <Input disabled {...field} value={"Ridwan Ajanaku"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="text-[#2B2829] mb-10 mt-10 text-xl font-semibold">
              Vendor Details
            </p>
            <div className="flex gap-5 max-sm:flex-wrap">
              <FormField
                control={form.control}
                name="vendor_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter vendor name"
                        {...field}
                        value={selectedOrder?.vendor?.vendor_name}
                        onChange={(e) => {
                          form.setValue("vendor_name", e.target.value);
                          setSelectedOrder({
                            ...selectedOrder,
                            vendor: {
                              ...selectedOrder?.vendor,
                              vendor_name: e.target.value,
                            },
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter phone number"
                        {...field}
                        value={selectedOrder?.vendor?.phone_number}
                        onChange={(e) => {
                          form.setValue("phone_number", e.target.value);
                          setSelectedOrder({
                            ...selectedOrder,
                            vendor: {
                              ...selectedOrder?.vendor,
                              phone_number: e.target.value,
                            },
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vendor_address"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter address"
                        {...field}
                        value={selectedOrder?.vendor?.vendor_address}
                        onChange={(e) => {
                          form.setValue("vendor_address", e.target.value);
                          setSelectedOrder({
                            ...selectedOrder,
                            vendor: {
                              ...selectedOrder?.vendor,
                              vendor_address: e.target.value,
                            },
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-5 mt-6 mb-10 max-sm:flex-wrap">
              <FormField
                control={form.control}
                name="account_number"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Account number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter number"
                        {...field}
                        value={selectedOrder?.vendor?.account_number}
                        onChange={(e) => {
                          form.setValue("account_number", e.target.value);
                          setSelectedOrder({
                            ...selectedOrder,
                            vendor: {
                              ...selectedOrder?.vendor,
                              account_number: e.target.value,
                            },
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Bank</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter bank"
                        {...field}
                        value={selectedOrder?.vendor?.bank_name}
                        onChange={(e) => {
                          form.setValue("bank_name", e.target.value);
                          setSelectedOrder({
                            ...selectedOrder,
                            vendor: {
                              ...selectedOrder?.vendor,
                              bank_name: e.target.value,
                            },
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="account_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Account name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter name"
                        {...field}
                        value={selectedOrder?.vendor?.account_name}
                        onChange={(e) => {
                          form.setValue("account_name", e.target.value);
                          setSelectedOrder({
                            ...selectedOrder,
                            vendor: {
                              ...selectedOrder?.vendor,
                              account_name: e.target.value,
                            },
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              className="bg-[#7201FD] hover:bg-[#430194] px-12 py-3 rounded-[10px] text-white"
              type="submit"
            >
              Save
            </Button>
          </form>
        </Form>
      </div>
      <Modal
        closeIcon={null}
        width={338}
        centered
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={() => (
          <div className="flex justify-center">
            <Button
              onClick={() => router.push("/")}
              className="bg-[#7201FD] hover:bg-[#430194] px-6 py-3 rounded-[10px] text-white"
            >
              Go To Dashboard
            </Button>
          </div>
        )}
      >
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <SuccessIcon />
          </div>
          <p className="text-[#121417] text-lg font-semibold mb-2">
            Congratulations!
          </p>
          <p className="text-sm text-[#64707D] mb-6">
            Your purchase order has been updated successfully.
          </p>
        </div>
      </Modal>
    </Layout>
  );
};

export default EditOrder;
