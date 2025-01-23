import { Icon } from "@iconify/react/dist/iconify.js";

  const OrderListItem = ({ order }: any) => (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50">
      <div className="flex gap-4 items-center">
        <div className="font-medium">{order.id}</div>
        <div className="text-sm text-gray-500">
          {order.items
            .map((item: any) => `${item.quantity}x ${item.name} (${item.size})`)
            .join(", ")}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Icon
            icon={order.payment === "Cash" ? "ph:money" : "simple-icons:esewa"}
            className="text-primary-600"
          />
          <span className="text-sm">{order.payment}</span>
        </div>
        <div className="font-medium">${order.total.toFixed(2)}</div>
      </div>
    </div>
  );
export default OrderListItem