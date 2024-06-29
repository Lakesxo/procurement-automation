import {
  ArrowLeftIcon,
  ModalTrashIcon,
  ThreeDotsMenuIcon,
} from "@/assets/icons/icons";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Dropdown, MenuProps, Modal, Skeleton, message } from "antd";
import { Loader2, PencilIcon, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

interface OrderDetailsProps {}

const OrderDetails: React.FunctionComponent<OrderDetailsProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletingOrder, setIsDeletingOrder] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const params = useParams();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <button
          onClick={() => router.push(`/order/edit/${params.id}`)}
          className="flex items-center gap-1"
        >
          <span>
            <PencilIcon className="text-[#667185] h-4" />
          </span>
          <span>Edit Order</span>
        </button>
      ),
    },
    {
      key: "2",
      label: (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1"
        >
          <span>
            <Trash2 className="text-[#B30101] h-4" />
          </span>
          <span className="text-[#B30101]">Delete Order</span>
        </button>
      ),
    },
  ];

  const { isPending, error, data } = useQuery({
    queryKey: ["order"],
    queryFn: async () => {
      const response = await fetch(`/api/order/${params.id}`).then((res) =>
        res.json()
      );
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

  if (error) {
    messageApi.open({
      type: "error",
      content: "Error fetching order",
    });
  }

  const handleDeleteOrder = () => {
    setIsDeletingOrder(true);
    fetch(`/api/order/${params.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        router.push("/");
        messageApi.open({
          type: "success",
          content: "Order deleted successfully",
        });
        setIsModalOpen(false);
        setIsDeletingOrder(false);
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content: "Error deleting order",
        });
        setIsDeletingOrder(false);
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
      <div className="bg-white rounded-[10px] mt-10 p-6">
        <div className="flex items-center w-full justify-between">
          <p className="text-[#2B2829] text-xl font-semibold">
            Purchase Order Details
          </p>
          <Dropdown menu={{ items }} placement="bottomLeft" arrow>
            <Button className="bg-white hover:bg-[#EFF4FB] border border-[#D2D6DB] px-2">
              <ThreeDotsMenuIcon />
            </Button>
          </Dropdown>
        </div>
        <div className="flex items-center gap-6 mt-6">
          <p className="text-[#2B2829] font-semibold">
            Order ID: #{data.purchase_order_number}
          </p>
          <p>
            <span className="text-[#2B2829] font-semibold">Order status:</span>{" "}
            {data.purchase_order_status === "pending" ? (
              <span className="text-[#F29425] bg-[#FFF9F0] px-3 py-1.5 rounded-[10px] text-xs font-medium">
                {data.purchase_order_status}
              </span>
            ) : (
              <span className="text-[#10A142] bg-[#EAFFF1] px-3 py-1.5 rounded-[10px] text-xs font-medium">
                {data.purchase_order_status}
              </span>
            )}
          </p>
        </div>
        <div className="mt-10 flex flex-wrap">
          <div>
            <p className="mb-4">
              <span className="font-semibold text-[#2B2829]">Item: </span>
              <span className="text-[#40474F] font-light">
                {data.items.item_name}
              </span>
            </p>
            <p className="mb-4">
              <span className="font-semibold text-[#2B2829]">Quantity: </span>
              <span className="text-[#40474F] font-light">
                {data.items.item_quantity}
              </span>
            </p>
            <p className="mb-4">
              <span className="font-semibold text-[#2B2829]">Unit price: </span>
              <span className="text-[#40474F] font-light">
                ₦{data.items.item_unit_price.toLocaleString()}
              </span>
            </p>
            <p className="mb-4">
              <span className="font-semibold text-[#2B2829]">
                Total price:{" "}
              </span>
              <span className="text-[#40474F] font-light">
                ₦{data.items.item_total_price.toLocaleString()}
              </span>
            </p>
            <p className="mb-4">
              <span className="font-semibold text-[#2B2829]">Date: </span>
              <span className="text-[#40474F] font-light">
                {data.created_on.slice(0, 10)}
              </span>
            </p>
            <p className="mb-4">
              <span className="font-semibold text-[#2B2829]">Ordered by: </span>
              <span className="text-[#40474F] font-light">
                {data.ordered_by}
              </span>
            </p>
          </div>
          <div className="ml-[300px] max-sm:ml-0">
            <p className="mb-4">
              <span className="font-semibold text-[#2B2829]">
                Vendor name:{" "}
              </span>
              <span className="text-[#40474F] font-light">
                {data.vendor.vendor_name}
              </span>
            </p>
            <p className="mb-4">
              <span className="font-semibold text-[#2B2829]">
                Phone number:{" "}
              </span>
              <span className="text-[#40474F] font-light">
                {data.vendor.phone_number}
              </span>
            </p>
            <p className="mb-4">
              <span className="font-semibold text-[#2B2829]">Address: </span>
              <span className="text-[#40474F] font-light">
                {data.vendor.vendor_address}
              </span>
            </p>
            <p className="mb-4">
              <span className="font-semibold text-[#2B2829]">
                Account number:{" "}
              </span>
              <span className="text-[#40474F] font-light">
                {data.vendor.account_number}
              </span>
            </p>

            <p className="mb-4">
              <span className="font-semibold text-[#2B2829]">Bank: </span>
              <span className="text-[#40474F] font-light">
                {data.vendor.bank_name}
              </span>
            </p>

            <p className="mb-4">
              <span className="font-semibold text-[#2B2829]">
                Account name:{" "}
              </span>
              <span className="text-[#40474F] font-light">
                {data.vendor.account_name}
              </span>
            </p>
          </div>
        </div>
      </div>
      <Modal
        closeIcon={null}
        width={338}
        centered
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={() => (
          <div className="flex justify-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 bg-white border border-[rgba(23,23,31,0.10)] shadow-[0px_1px_1px_0px_rgba(18,18,18,0.10),0px_0px_0px_1px_rgba(18,18,18,0.07),0px_1px_3px_0px_rgba(18,18,18,0.10)] border-solid border-[#17171f1a] rounded-[10px]"
            >
              No, Cancel
            </button>
            <button
              onClick={handleDeleteOrder}
              disabled={isDeletingOrder}
              className="px-8 py-2 deleteBtn ml-4"
            >
              {isDeletingOrder ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Yes, Delete"
              )}
            </button>
          </div>
        )}
      >
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <ModalTrashIcon />
          </div>
          <p className="text-[#121417] text-lg font-semibold mb-2">
            Delete Purchase Order
          </p>
          <p className="text-sm text-[#64707D] mb-6">
            Are you sure you want to delete this purchase order?
          </p>
        </div>
      </Modal>
    </Layout>
  );
};

export default OrderDetails;
