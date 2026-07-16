package com.dermacare.dermacare_store.service.impl;

import com.dermacare.dermacare_store.entity.Cart;
import com.dermacare.dermacare_store.repository.CartRepository;
import com.dermacare.dermacare_store.service.CartService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    public CartServiceImpl(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    @Override
    public List<Cart> getAllCartItems() {
        return cartRepository.findAll();
    }

    @Override
    public Cart saveCart(Cart cart) {
        return cartRepository.save(cart);
    }

    @Override
    public void deleteCartItem(Integer id) {
        cartRepository.deleteById(id);
    }
}