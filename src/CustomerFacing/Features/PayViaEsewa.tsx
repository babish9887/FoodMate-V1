import toast from "react-hot-toast";
import Button from "../../Components/UI/Button";
import { getEsewaSignatureApi } from "../../Api/order";

const PayViaEsewa = ({ id, totalPayment }: { id: string, totalPayment: number }) => {
  const handlePayViaEsewa = async () => {
    window.localStorage.setItem("orderId", id);
    try {
      const transaction_uuid = `${id}-${Date.now()}`;
      const total_amount = totalPayment.toFixed(2).toString();

      const { signature, product_code } = await getEsewaSignatureApi({
        total_amount,
        transaction_uuid,
      });

      const baseUrl = (import.meta.env.VITE_URL || window.location.origin).replace(/\/+$/, '');

      const jsonData: Record<string, string> = {
        amount: total_amount,
        failure_url: `${baseUrl}/esewa/purchase_fail`,
        product_delivery_charge: "0",
        product_service_charge: "0",
        product_code: product_code || "EPAYTEST",
        signature,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        success_url: `${baseUrl}/esewa/payment_success`,
        tax_amount: "0",
        total_amount,
        transaction_uuid,
      };

      const url = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      const form = document.createElement("form");
      for (const key in jsonData) {
        const field = document.createElement("input");
        field.setAttribute("type", "hidden");
        field.setAttribute("name", key);
        field.setAttribute("value", jsonData[key]);
        form.appendChild(field);
      }

      form.setAttribute("method", "post");
      form.setAttribute("action", url);
      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate eSewa payment.");
      console.error(error);
    }
  };

  return (
    <Button
      onClick={handlePayViaEsewa}
      className="text-nowrap h-fit !w-fit !bg-gray-200 !text-black text-sm px-2 py-1 !hover:bg-gray-300"
    >
      Pay Now
    </Button>
  );
};

export default PayViaEsewa;