import { Icon } from "@iconify/react/dist/iconify.js";
import { useGetCurrentOrder } from "../../Queries/order/useGetCurrentOrder";
import Loading from "../UI/Loading";
import IsError from "../UI/IsError";
import DialogModal from "../DialogModal";
import { useCancelOrder } from "../../Queries/order/useCancelOrder";
import { useState } from "react";
import Button from "../UI/Button";
import PayViaEsewa from "../../CustomerFacing/Features/PayViaEsewa";
import { useUpdateOrderItems } from "../../Queries/order/useUpdateOrderItems";
import { OrderItem } from "../../Queries/order/useUpdateOrderItems";

const CurrentOrderCard = () => {
  const { data, isLoading, isError } = useGetCurrentOrder();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const { cancelOrder, isPending } = useCancelOrder();
  const { updateOrderItems, isPending: isUpdatingItems } = useUpdateOrderItems();
  
  // State to track item quantities for editing
  const [editingItems, setEditingItems] = useState<boolean>(false);
  const [itemQuantities, setItemQuantities] = useState<{ [key: number]: number }>({});

  if (isLoading) return <Loading>Loading...</Loading>;

  if (isError) return <IsError>Cannot Get Your Current Order</IsError>;

  if (data?.doc?.length === 0)
    return (
      <div className="py-5 text-xl text-zinc-400">
        There is no Current Order
      </div>
    );

  const handleCancelUser = () => {
    if (!deleteDialogOpen || message === "") return;
    cancelOrder({ _id: deleteDialogOpen, message });
    setDeleteDialogOpen(null);
  };


  // Initialize item quantities when entering edit mode
  const startEditingItems = (items: OrderItem[]) => {
    const initialQuantities: { [key: number]: number } = {};
    items.forEach((item, index) => {
      initialQuantities[index] = item.qty;
    });
    setItemQuantities(initialQuantities);
    setEditingItems(true);
  };

  // Update item quantity
  const updateItemQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return; // Prevent quantities less than 1
    setItemQuantities({
      ...itemQuantities,
      [index]: newQty
    });
  };

  // Remove item
  const removeItem = (index: number) => {
    setItemQuantities({
      ...itemQuantities,
      [index]: 0 // Set to 0 to indicate removal
    });
  };

  // Save updated items
  const saveUpdatedItems = (orderId: string, originalItems: OrderItem[]) => {
    // Filter out removed items and update quantities
    const updatedItems = originalItems
      .filter((_, index) => itemQuantities[index] > 0)
      .map((item, index) => {
        if (itemQuantities[index] !== undefined) {
          return {...item, qty: itemQuantities[index]};
        }
        return item;
      });
    
    // Only update if there are changes
    if (updatedItems.length > 0) {
      updateOrderItems({ _id: orderId, items: updatedItems });
    }
    
    setEditingItems(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingItems(false);
    setItemQuantities({});
  };

  return (
    <div className="w-full">
      {deleteDialogOpen !== null && (
        <DialogModal
          message={`Do you really want to Cancel Current Order?`}
          btntext="Cancel"
          isPending={isPending}
          pendingText="Cancelling..."
          onConfirm={handleCancelUser}
          showInput={true}
          inputMessage={message}
          setInputMessage={setMessage}
          onCancel={() => setDeleteDialogOpen(null)}
        />
      )}
      {data?.doc?.map((currentOrder: any) => {
        const allSteps = [
          "Order Placed",
          "Order Confirmed",
          "Preparing",
          "Ready for Pickup",
          "Completed",
        ];

        const isCancelled = currentOrder?.currentStatus?.status === "Cancelled";
        const canEditItems = ["Order Placed", "Order Confirmed"].includes(currentOrder?.currentStatus?.status);

        let steps = allSteps.map((status: string) => {
          const foundStatus = currentOrder?.statusHistory?.find(
            (historyStatus: any) => historyStatus.status === status
          );

          const isCurrent = currentOrder?.currentStatus?.status === status;

          return {
            name: status,
            time: foundStatus
              ? new Date(foundStatus.time).toLocaleTimeString()
              : "N/A",
            status: isCurrent
              ? "current"
              : foundStatus
              ? "completed"
              : "not-completed",
          };
        });

        if (isCancelled) {
          steps = [
            {
              name: "Cancelled",
              time: new Date(
                currentOrder?.currentStatus?.time
              ).toLocaleTimeString(),
              status: "cancelled",
            },
          ];
        }

        return (
          <div
            key={currentOrder._id}
            className="w-full bg-white rounded-xl p-6 shadow-sm mt-2 lg:mt-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl lg:text-2xl font-semibold">
                    Order #{currentOrder._id.slice(-5)}
                  </h2>
                  <div
                    className={`px-3 py-1 rounded-full text-sm md:text-md lg:text-lg ${
                      isCancelled
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {currentOrder?.currentStatus?.status}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm md:text-md lg:text-lg text-gray-500">
                  {new Date(currentOrder?.createdAt).toLocaleDateString()}
                </div>
                <div className="font-bold mt-1">
                  Rs{" "}
                  {currentOrder?.items
                    ?.reduce(
                      (acc: number, item: any) => acc + item.price * item.qty,
                      0
                    )
                    .toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Order Items */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-md lg:text-xl 4xl:text-2xl">
                    Order Items
                  </h3>
                  {canEditItems && !editingItems && (
                    <Button 
                      onClick={() => startEditingItems(currentOrder?.items)}
                      className="!w-fit !px-3 flex justify-center items-center !py-1 !text-sm !bg-blue-100 !text-blue-800 !hover:bg-blue-200"
                    >
                      <Icon icon="ph:pencil" className="mr-1" /> Edit Items
                    </Button>
                  )}
                  {editingItems && (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => saveUpdatedItems(currentOrder._id, currentOrder?.items)}
                        className="!w-fit !px-3 !py-1 !text-sm !bg-green-100 !text-green-800 !hover:bg-green-200"
                        disabled={isUpdatingItems}
                      >
                        {isUpdatingItems ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button 
                        onClick={cancelEditing}
                        className="!w-fit !px-3 !py-1 !text-sm !bg-gray-100 !text-gray-800 !hover:bg-gray-200"
                        disabled={isUpdatingItems}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
                <div className="space-y-2 text-sm md:text-md lg:text-lg">
                  {currentOrder?.items?.map((item: any, index: number) => {
                    const isEditing = editingItems && itemQuantities[index] !== undefined;
                    const currentQty = isEditing ? itemQuantities[index] : item.qty;
                    const isRemoved = isEditing && currentQty === 0;
                    
                    // Skip rendering removed items
                    if (isRemoved) return null;
                    
                    return (
                      <div
                        key={index}
                        className={`flex justify-between items-center ${isEditing ? "bg-gray-50 p-2 rounded" : ""}`}
                      >
                        <div className="flex items-center">
                          {!isEditing ? (
                            <>
                              <span className="font-medium">{item.qty} x </span>{" "}
                               {item.name}
                              <span className="text-sm md:text-md lg:text-lg text-gray-500 ml-2">
                                ({item.size})
                              </span>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border rounded-md">
                                <button
                                  onClick={() => updateItemQuantity(index, currentQty - 1)}
                                  className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="px-2">{currentQty}</span>
                                <button
                                  onClick={() => updateItemQuantity(index, currentQty + 1)}
                                  className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                              <span className="flex-1">
                                {item.name}
                                <span className="text-sm md:text-md lg:text-lg text-gray-500 ml-2">
                                  ({item.size})
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div>Rs {(item.price * currentQty).toFixed(2)}</div>
                          {isEditing && (
                            <button
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:bg-red-50 p-1 rounded"
                              title="Remove item"
                            >
                              <Icon icon="ph:trash" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Icon
                    icon={
                      currentOrder?.payment === "Cash"
                        ? "ph:money"
                        : "duo-icons:credit-card"
                    }
                    className="text-primary-600 text-xl lg:text-2xl"
                  />
                  <span className="text-sm md:text-md lg:text-lg">
                    {currentOrder?.paymentMethod}
                    {currentOrder?.paymentDetails && (
                      <div
                        className={`inline-block px-2 py-1 ml-2 rounded-full text-xs font-semibold ${
                          currentOrder?.paymentDetails?.status === "COMPLETE"
                            ? "bg-green-200 text-green-800"
                            : currentOrder?.paymentDetails?.status === "PENDING"
                            ? "bg-yellow-300 text-yellow-800"
                            : currentOrder?.paymentDetails?.status === "FULL_REFUND"
                            ? "bg-blue-300 text-blue-800"
                            : currentOrder?.paymentDetails?.status === "PARTIAL_REFUND"
                            ? "bg-purple-300 text-purple-800"
                            : currentOrder?.paymentDetails?.status === "AMBIGUOUS"
                            ? "bg-gray-300 text-gray-800"
                            : currentOrder?.paymentDetails?.status === "NOT_FOUND"
                            ? "bg-red-300 text-red-800"
                            : currentOrder?.paymentDetails?.status === "CANCELLED"
                            ? "bg-black text-gray-200"
                            : "bg-gray-300"
                        }`}
                      >
                        Status: {currentOrder?.paymentDetails?.status}
                      </div>
                    )}
                  </span>
                  {currentOrder.paymentMethod === "Not Paid" &&
                    currentOrder?.currentStatus?.status !== "Cancelled" && (
                      <PayViaEsewa
                        id={currentOrder._id}
                        totalPayment={Number(
                          currentOrder?.items
                            ?.reduce(
                              (acc: number, item: any) =>
                                acc + item.price * item.qty,
                              0
                            )
                            .toFixed(2)
                        )}
                      />
                    )}
                </div>

                {currentOrder?.statusHistory?.length < 2 && !editingItems && (
                  <Button
                    onClick={() => setDeleteDialogOpen(currentOrder._id)}
                    className="!w-fit !mt-4 !bg-zinc-100 !text-black !hover:bg-zinc-200"
                  >
                    Cancel Order
                  </Button>
                )}
              </div>

              {/* Order Progress */}
              <div className="flex-1">
                <h3 className="font-medium mb-4 text-md lg:text-xl 4xl:text-2xl">
                  Order Progress
                </h3>
                <div className="space-y-2">
                  {steps?.map((step: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          step.status === "completed"
                            ? "bg-green-500"
                            : step.status === "current"
                            ? "bg-yellow-500"
                            : step.status === "cancelled"
                            ? "bg-red-500"
                            : "bg-gray-200"
                        }`}
                      >
                        {step.status === "completed" && (
                          <Icon
                            icon="ph:check-bold"
                            className="text-white text-sm md:text-md lg:text-lg"
                          />
                        )}
                        {step.status === "current" && (
                          <Icon
                            icon="ph:clock"
                            className="text-white text-sm md:text-md lg:text-lg"
                          />
                        )}
                        {step.status === "cancelled" && (
                          <Icon
                            icon="ph:x-circle"
                            className="text-white text-sm md:text-md lg:text-lg"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm md:text-md lg:text-lg">
                          <span
                            className={`${
                              step.status === "completed"
                                ? "text-green-500"
                                : step.status === "current"
                                ? "text-yellow-500"
                                : step.status === "cancelled"
                                ? "text-red-500"
                                : "text-gray-400"
                            }`}
                          >
                            {step.name}
                          </span>
                          <span className="text-sm md:text-md lg:text-lg text-gray-500">
                            {step.time}
                          </span>
                        </div>
                        {index < steps.length - 1 &&
                          step.status !== "cancelled" && (
                            <div
                              className={`w-px h-4 ml-3 ${
                                step.status === "completed"
                                  ? "bg-green-500"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CurrentOrderCard;