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
import { Modal, message } from "antd";
import { useState } from "react";

interface CreateOrderProps {}

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

const CreateOrder: React.FunctionComponent<CreateOrderProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      item_name: "",
      item_quantity: "",
      description: "",
      item_unit_price: "",
      item_total_price: "",
      ordered_by: "Ridwan Ajanaku",
      vendor_name: "",
      phone_number: "",
      vendor_address: "",
      account_number: "",
      bank_name: "",
      account_name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const newOrder = {
      purchase_order_id: uuidv4(),
      purchase_order_number: Math.floor(Math.random() * 9000) + 1000,
      purchase_order_status: "pending",
      ordered_by: data.ordered_by,
      created_on: new Date(),
      vendor: {
        vendor_id: uuidv4(),
        vendor_name: data.vendor_name,
        vendor_address: data.vendor_address,
        phone_number: data.phone_number,
        account_number: data.account_number,
        bank_name: data.bank_name,
        account_name: data.account_name,
      },
      items: {
        item_id: uuidv4(),
        item_name: data.item_name,
        item_quantity: parseInt(data.item_quantity),
        item_unit_price: parseInt(data.item_unit_price),
        item_total_price:
          parseInt(data.item_quantity) * parseInt(data.item_unit_price),
      },
    };

    await fetch("/api/order", {
      method: "POST",
      body: JSON.stringify(newOrder),
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
      <div className="bg-white rounded-[10px] mt-10 p-6 max-sm:mt-8">
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
                      <Input placeholder="Enter item name" {...field} />
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
                      <Input placeholder="Enter description" {...field} />
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
                        value={String(
                          Number(form.getValues("item_unit_price")) *
                            Number(form.getValues("item_quantity"))
                        )}
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
                      <Input placeholder="Enter vendor name" {...field} />
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
                      <Input placeholder="Enter phone number" {...field} />
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
                      <Input placeholder="Enter address" {...field} />
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
                      <Input placeholder="Enter number" {...field} />
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
                      <Input placeholder="Enter bank" {...field} />
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
                      <Input placeholder="Enter name" {...field} />
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
              Save And Send
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
            Your purchase order has been submitted successfully.
          </p>
        </div>
      </Modal>
    </Layout>
  );
};

export default CreateOrder;
