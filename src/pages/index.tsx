import {
  ApprovedOrderIcon,
  ModalTrashIcon,
  PendingOrderIcon,
  SortIcon,
  TotalCostIcon,
  TotalOrderIcon,
} from "@/assets/icons/icons";
import Layout from "@/components/Layout";
import StatisticsCard from "@/components/StatisticsCard";
import { DataTable } from "@/components/table/data-table";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { PurchaseOrderDetails } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Loader2, PencilIcon, Trash2 } from "lucide-react";
import { Modal, Skeleton, message } from "antd";
import { useState } from "react";

interface DashboardProps {}

const Dashboard: React.FunctionComponent<DashboardProps> = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState<string>("");
  const [isDeletingOrder, setIsDeletingOrder] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch(`/api/order`).then((res) => res.json());
      return response.orders;
    },
  });

  if (isPending) {
    return (
      <Layout>
        <Skeleton
          className="py-5 px-5 max-sm:px-0"
          active
          paragraph={{ rows: 6 }}
        />
      </Layout>
    );
  }

  if (error) {
    messageApi.open({
      type: "error",
      content: "Error fetching orders",
    });
  }

  const orderColumns: ColumnDef<PurchaseOrderDetails>[] = [
    {
      accessorKey: "purchase_order_number",
      header: () => <div className="text-xs font-bold">Order ID</div>,
      cell: ({ row }) => {
        return (
          <div className="min-w-[70px] text-[#40474F]">
            {<span className="">#{row.original.purchase_order_number}</span>}
          </div>
        );
      },
    },
    {
      accessorKey: "items.item_name",
      header: () => <div className="text-xs font-bold w-[200px]">Item</div>,
    },
    {
      accessorKey: "items.item_quantity",
      header: ({ column }) => {
        return (
          <div className="min-w-[70px]">
            <Button
              variant="ghost"
              className="flex items-center gap-1 p-0 hover:bg-transparent"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span className="text-xs font-bold">Quantity</span>
              <SortIcon />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "items.item_unit_price",
      header: ({ column }) => {
        return (
          <div className="min-w-[100px]">
            <Button
              variant="ghost"
              className="flex items-center gap-1 p-0 hover:bg-transparent"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span className="text-xs font-bold">Unit price</span>
              <SortIcon />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F]">
            {
              <span className="">
                ₦{row.original.items.item_unit_price.toLocaleString()}
              </span>
            }
          </div>
        );
      },
    },
    {
      accessorKey: "items.item_total_price",
      header: ({ column }) => {
        return (
          <div className="min-w-[100px]">
            <Button
              variant="ghost"
              className="flex items-center gap-1 p-0 hover:bg-transparent"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span className="text-xs font-bold">Total price</span>
              <SortIcon />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F]">
            {
              <span className="">
                ₦{row.original.items.item_total_price.toLocaleString()}
              </span>
            }
          </div>
        );
      },
    },
    {
      accessorKey: "created_on",
      header: () => <div className="text-xs font-bold">Date</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F] min-w-[100px]">
            {
              <span className="">
                {String(row.original.created_on)?.slice(0, 10)}
              </span>
            }
          </div>
        );
      },
    },
    {
      accessorKey: "purchase_order_status",
      header: () => <div className="text-xs font-bold">Status</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F]">
            {row.original.purchase_order_status === "approved" ? (
              <span className="text-[#10A142] bg-[#EAFFF1] px-3 py-1.5 rounded-[10px] text-xs font-medium">
                {row.original.purchase_order_status}
              </span>
            ) : (
              <span className="text-[#F29425] bg-[#FFF9F0] px-3 py-1.5 rounded-[10px] text-xs font-medium">
                {row.original.purchase_order_status}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: () => <div className="text-xs font-bold">Action</div>,
      cell: ({ row }) => {
        return (
          <div className="flex gap-2.5">
            <button
              onClick={() =>
                router.push(`/order/edit/${row.original.purchase_order_id}`)
              }
            >
              <PencilIcon className="text-[#667185] h-5" />
            </button>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setSelectedOrderID(row.original.purchase_order_id);
              }}
            >
              <Trash2 className="text-[#667185] h-5" />
            </button>
          </div>
        );
      },
    },
  ];

  const handleOrderClick = (id: string) => {
    router.push(`/order/${id}`);
  };

  const handleDeleteOrder = () => {
    setIsDeletingOrder(true);
    fetch(`/api/order/${selectedOrderID}`, {
      method: "DELETE",
    })
      .then((res) => {
        refetch();
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
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[#121417] text-2xl font-bold max-sm:text-xl">
            Dashboard
          </p>
          <p className="text-[#64707D] text-sm font-normal max-sm:text-xs">
            Request and view all procurement requests.
          </p>
        </div>
        <Button
          onClick={() => router.push("/order/new")}
          className="bg-[#7201FD] hover:bg-[#430194] px-4 py-3 rounded-[10px] text-white"
        >
          Create Purchase Order
        </Button>
      </div>
      <div className="flex gap-10 mt-9 max-sm:flex-wrap max-sm:gap-5">
        <StatisticsCard
          icon={<TotalOrderIcon />}
          value={data?.length.toLocaleString("en-US")}
          name={`Total order${data?.length > 1 ? "s" : ""}`}
        />
        <StatisticsCard
          icon={<TotalCostIcon />}
          value={data
            .reduce(
              (acc: any, curr: PurchaseOrderDetails) =>
                acc + curr.items.item_total_price,
              0
            )
            .toLocaleString("en-US")}
          name="Total cost incurred"
          isNaira
        />
        <StatisticsCard
          icon={<PendingOrderIcon />}
          value={
            data?.filter(
              (order: PurchaseOrderDetails) =>
                order.purchase_order_status === "pending"
            ).length
          }
          name={`Pending order${
            data?.filter(
              (order: PurchaseOrderDetails) =>
                order.purchase_order_status === "pending"
            ).length > 1
              ? "s"
              : ""
          }`}
        />
        <StatisticsCard
          icon={<ApprovedOrderIcon />}
          value={
            data?.filter(
              (order: PurchaseOrderDetails) =>
                order.purchase_order_status === "approved"
            ).length
          }
          name={`Approved order${
            data?.filter(
              (order: PurchaseOrderDetails) =>
                order.purchase_order_status === "approved"
            ).length > 1
              ? "s"
              : ""
          }`}
        />
      </div>
      <div className="bg-white rounded-[10px] mt-6 p-4">
        <p className="text-[#121417] text-[20px] font-semibold">
          Purchase Orders
        </p>
        <p className="text-[#64707D] font-light">
          You are viewing all Purchase Orders
        </p>
        <div className="mt-10">
          <DataTable
            columns={orderColumns}
            data={data}
            rowClick={(id: string) => handleOrderClick(id)}
          />
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
              className="px-8 py-2 deleteBtn ml-4"
              disabled={isDeletingOrder}
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

export default Dashboard;
