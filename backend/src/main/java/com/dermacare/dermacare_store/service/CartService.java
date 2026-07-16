package com.dermacare.dermacare_store.service;

import com.dermacare.dermacare_store.entity.Cart;
import java.util.List;

public interface CartService {

    List<Cart> getAllCartItems();

    Cart saveCart(Cart cart);

    void deleteCartItem(Integer id);
}