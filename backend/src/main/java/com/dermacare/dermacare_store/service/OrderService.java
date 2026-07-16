package com.dermacare.dermacare_store.service;

import com.dermacare.dermacare_store.entity.Order;
import java.util.List;

public interface OrderService {

    List<Order> getAllOrders();

    Order saveOrder(Order order);

    void deleteOrder(Integer id);
}