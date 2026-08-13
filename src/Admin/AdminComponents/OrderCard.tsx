import { Icon } from "@iconify/react/dist/iconify.js";
import Avatar from "../../Components/Avatar";
import { useUpdateOrder } from "../../Queries/order/useUpdateOrder";
import { useEffect, useState } from "react";
import DialogModal from "../../Components/DialogModal";
import { Item } from "../../Utils/types";
import formatDateTime from "../../Utils/formatDateTime";
import { useUpdateOrderToPaid } from "../../Queries/order/useUpdatetoPaid";
import { useRefund } from "../../Queries/useRefund";

const filterOptions = [
  { value: "Order Placed", label: "Order Placed", icon: "ph:clock" },
  {
    value: "Order Confirmed",
    label: "Order Confirmed",
    icon: "ph:check-circle",
  },
  { value: "Preparing", label: "Preparing", icon: "ph:cogs" },
  {
    value: "Ready for Pickup",
    label: "Ready for Pickup",
    icon: "ph:shopping-bag",
  },
  { value: "Completed", label: "Completed", icon: "ph:thumbs-up" },
  { value: "Cancelled", label: "Cancelled", icon: "ph:thumbs-down" },
];

const OrderCard = ({ order }: { order: any }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<{
    id: string | null;
    st: string | null;
  }>({ id: null, st: null });
  const [message, setMessage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const currentStatusIndex = filterOptions.findIndex(
    (option) => option.value === order?.currentStatus?.status
  );

  const { updateOrder, isPending, isSuccess } = useUpdateOrder();
  const { updateOrderToPaid } = useUpdateOrderToPaid();

  const handleChange = ({ _id, status }: { _id: string; status: string }) => {
    if (status === "Cancelled")
      return setDeleteDialogOpen({ id: _id, st: status });
    updateOrder({ _id, status });
  };

  const handleUpdateToPaid = ({ _id }: any) => {
    updateOrderToPaid({ _id, paymentMethod: "cash" });
  };
  useEffect(() => {
    if (isSuccess)
      setDeleteDialogOpen((prev) => ({ ...prev, id: null, st: null }));
  }, [isSuccess]);

  const price = order.items.reduce(
    (total: number, currentItem: any) =>
      total + currentItem.price * currentItem.qty,
    0
  );

  const { refund } = useRefund();
  const handleRefund = (_id: string) => {
    refund({ _id });
  };

  return (
    <>
      {deleteDialogOpen.id !== null && (
        <DialogModal
          message={`Do you really want to Cancel ${order?.user?.name}'s Order`}
          btntext="Cancel"
          isPending={isPending}
          pendingText="Cancelling..."
          showInput={true}
          inputMessage={message}
          setInputMessage={setMessage}
          onConfirm={() =>
            updateOrder({
              _id: deleteDialogOpen.id!,
              status: deleteDialogOpen.st!,
              message: message || undefined,
            })
          }

          onCancel={() =>
            setDeleteDialogOpen((prev) => ({ ...prev, id: null, st: null }))
          }
        />
      )}

      <tr
        key={order._id}
        className={`border-b w-full  h-auto ${
          order?.currentStatus?.status == "Completed"
            ? "!bg-green-50"
            : order?.currentStatus?.status == "Cancelled"
            ? "bg-red-100"
            : " hover:bg-gray-50"
        }`}
      >
        <td className="p-2 w-[10%]">
          <Avatar
            name={order?.user?.name}
            picture={order?.user?.picture || ""}
          />
        </td>
        <td className="p-2 w-[12%]">
          {order?.user?.name}
         
          <br />
          <span className="text-zinc-500">{order?.user?.email}</span>
        </td>

        <td className="p-2 w-[15%]">
         
          {order.items.map((item: Item) => (
            <div key={item._id} className="w-full h-full">
              <h1>
                {item.name}{" "}
                <span className="text-zinc-600">
                  {item.qty}x ({item.size})
                </span>
              </h1>
            </div>
          ))}
          <div className="text-nowrap">
            Total Payment: <span className="font-semibold">Rs {price}</span>
          </div>
           {order?.isUpdated && (
            <span className=" px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
              Updated
            </span>
          )}
        </td>
        <td className="p-2 w-[2%]">{formatDateTime(order.createdAt)}</td>
        <td className="p-4 w-[10%]">
          {order?.message ? <div className="mt-2">{order?.message}</div> : "-"}
          {order?.cancelMessage ? (
            <div className="mt-2">
              <span className="font-semibold">Cancel Reason:</span>{" "}
              {order?.cancelMessage}
            </div>
          ) : (
            ""
          )}
          
        </td>
        <td className="p-4 w-[10%]">
          <div className="border rounded-lg">
            <select
              onChange={(e) =>
                handleChange({ _id: order._id, status: e.target.value })
              }
              className="bg-transparent  px-2 rounded-lg py-2 border-none outline-none text-gray-900"
            >
              {filterOptions.map((option, index) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={
                    (option.value !== "Cancelled" &&
                      index !== currentStatusIndex + 1) ||
                    (["Ready for Pickup", "Completed"].includes(
                      order?.currentStatus?.status
                    ) &&
                      option.value === "Cancelled")
                  }
                  selected={order?.currentStatus?.status === option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </td>
        {/* <td className="p-2 w-[20%]">
          <div className="flex gap-x-2 justify-start items-center">
            <Icon
              icon={
                order?.paymentMethod === "cash"
                  ? "ph:money"
                  : "duo-icons:credit-card"
              }
              className="text-primary-600 text-xl lg:text-2xl"
            />
            <span className="text-sm md:text-md lg:text-lg capitalize">
              {order?.paymentMethod}
              <span className="text-sm md:text-md lg:text-lg">
  {order?.paymentDetails && (
    <div
      className={
        `inline-block px-2 py-1 ml-2 rounded-full  text-xs font-semibold " +
        ${order?.paymentDetails?.status === "COMPLETE" ? "bg-green-300 text-green-800" :
         order?.paymentDetails?.status === "PENDING" ? "bg-yellow-300 text-yellow-800" :
         order?.paymentDetails?.status === "FULL_REFUND" ? "bg-blue-300 text-blue-800" :
         order?.paymentDetails?.status === "PARTIAL_REFUND" ? "bg-purple-300 text-purple-800" :
         order?.paymentDetails?.status === "AMBIGUOUS" ? "bg-gray-300 text-gray-800" :
         order?.paymentDetails?.status === "NOT_FOUND" ? "bg-red-300 text-red-800" :
         order?.paymentDetails?.status === "CANCELLED" ? "bg-black text-gray-200" : "bg-gray-300"}`
      }
    >
      Status: {order?.paymentDetails?.status || 'null'}
    </div>
  )}
</span>
            </span>
          </div>
        </td> */}

        <td className="p-2 w-[25%] relative">
          <div className="flex gap-x-2 justify-start items-center">
            <Icon
              icon={
                order?.paymentMethod === "cash"
                  ? "ph:money"
                  : "duo-icons:credit-card"
              }
              className="text-primary-600 text-xl lg:text-2xl"
            />
            <span
              className="text-sm md:text-md lg:text-lg capitalize relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {order?.paymentMethod}

              {order?.paymentMethod == "Not Paid" &&
                order?.currentStatus.status !== "Cancelled" && (
                  <button
                    onClick={() => handleUpdateToPaid({ _id: order._id })}
                    className="text-sm mx-2 bg-green-500 text-white px-2 py-1 rounded-md"
                  >
                    Update to Paid
                  </button>
                )}

              {/* Status Badge */}
              {order?.paymentDetails && (
                <div
                  className={`inline-block px-2 py-1 ml-2 rounded-full text-xs font-semibold ${
                    order?.paymentDetails?.status === "COMPLETE"
                      ? "bg-green-200 text-green-800"
                      : order?.paymentDetails?.status === "PENDING"
                      ? "bg-yellow-200 text-yellow-800"
                      : order?.paymentDetails?.status === "FULL_REFUND"
                      ? "bg-blue-200 text-blue-800"
                      : order?.paymentDetails?.status === "PARTIAL_REFUND"
                      ? "bg-purple-200 text-purple-800"
                      : order?.paymentDetails?.status === "AMBIGUOUS"
                      ? "bg-gray-200 text-gray-800"
                      : order?.paymentDetails?.status === "NOT_FOUND"
                      ? "bg-red-200 text-red-800"
                      : order?.paymentDetails?.status === "CANCELLED"
                      ? "bg-black text-gray-200"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Status: {order?.paymentDetails?.status || "null"}
                </div>
              )}

              {/* eSewa Payment Details Tooltip on Hover */}
              {order?.paymentMethod === "esewa" &&
                order?.paymentDetails &&
                isHovered && (
                  <div className="absolute left-0 mt-2 w-[250px] bg-white shadow-lg border p-3 rounded-lg z-10">
                    <h3 className="font-semibold text-gray-700">
                      Payment Details
                    </h3>
                    <p className="text-sm text-gray-600">
                      <strong>Transaction Code:</strong>{" "}
                      {order.paymentDetails.transaction_code || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Status:</strong>{" "}
                      {order.paymentDetails.status || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Total Amount:</strong> Rs{" "}
                      {order.paymentDetails.total_amount || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Transaction UUID:</strong>{" "}
                      {order.paymentDetails.transaction_uuid || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Product Code:</strong>{" "}
                      {order.paymentDetails.product_code || "N/A"}
                    </p>
                  </div>
                )}
            </span>
            {order?.paymentMethod == "esewa" &&
              order.currentStatus.status == "Cancelled" &&
              order?.paymentDetails?.status == "COMPLETE" && (
                <button
                  onClick={() => handleRefund(order._id)}
                  className="mx-2  hover:underline"
                >
                  Refund
                </button>
              )}
          </div>
        </td>
      </tr>
    </>
  );
};

export default OrderCard;
