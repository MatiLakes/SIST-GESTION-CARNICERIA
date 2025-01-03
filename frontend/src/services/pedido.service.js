import axiosInstance from './root.service';

export const getPedidos = async () => {
  try {
    const response = await axiosInstance.get('/pedido');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    throw error;
  }
};

export const createPedido = async (pedidoData) => {
  try {
    const response = await axiosInstance.post('/pedido', pedidoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    throw error;
  }
};

export const deletePedido = async (id) => {
  try {
    await axiosInstance.delete(`/pedido/${id}`);
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    throw error;
  }
};

export const updatePedido = async (id, pedidoData) => {
  try {
    const response = await axiosInstance.put(`/pedido/${id}`, pedidoData);
    return response.data;
  } catch (error) {
    console.error('Error al editar el pedido:', error);
    throw error;
  }
};
export const getPedidosByFechaEntrega = async (fecha) => {
  try {
    const response = await axiosInstance.get(`/pedido/fecha/${fecha}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los pedidos por fecha de entrega:', error);
    throw error;
  }
};
