package com.dermacare.dermacare_store.service;

import com.dermacare.dermacare_store.entity.Customer;
import java.util.List;

public interface CustomerService {

    List<Customer> getAllCustomers();

    Customer getCustomerById(Integer id);

    Customer saveCustomer(Customer customer);

    void deleteCustomer(Integer id);
}