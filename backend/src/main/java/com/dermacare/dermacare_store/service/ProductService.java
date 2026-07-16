package com.dermacare.dermacare_store.service;

import com.dermacare.dermacare_store.entity.Product;
import java.util.List;

public interface ProductService {

    List<Product> getAllProducts();

    Product getProductById(Integer id);

    Product saveProduct(Product product);

    void deleteProduct(Integer id);
}