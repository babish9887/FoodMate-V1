import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentOrderApi } from "../../Api/order";
import { useEffect } from "react";
import { useSocket } from "../../Context/SocketContext";

export function useGetCurrentOrder() {

  const queryClient = useQueryClient();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleOrderUpdate = () => {
      // We can optionally check if the update is for this user, but invalidating safely works
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
    queryFn: getCurrentOrderApi,
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
