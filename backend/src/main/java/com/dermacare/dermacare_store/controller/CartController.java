package com.dermacare.dermacare_store.controller;

import com.dermacare.dermacare_store.service.CartService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public String viewCart(Model model) {
        model.addAttribute("cartItems", cartService.getAllCartItems());
        return "cart";
    }

    @GetMapping("/delete/{id}")
    public String deleteCartItem(@PathVariable Integer id) {
        cartService.deleteCartItem(id);
        return "redirect:/cart";
    }
}