import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllOrdersApi } from "../../Api/order";
import { useEffect } from "react";
import { useSocket } from "../../Context/SocketContext";

export function useGetAllOrders() {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleOrderUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }

    socket.on('order-update', handleOrderUpdate);

    return () => {
      socket.off('order-update', handleOrderUpdate);
    };
  }, [socket, queryClient]);

  const {
    data,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch
  } = useQuery({
    queryKey: ['orders'],
    queryFn: getAllOrdersApi,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  };
}
