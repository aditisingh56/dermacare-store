package com.dermacare.dermacare_store.service;

import com.dermacare.dermacare_store.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    User saveUser(User user);

    List<User> getAllUsers();

    Optional<User> getUserById(Integer id);

    Optional<User> getUserByEmail(String email);

    Optional<User> getUserByUsername(String username);

    void deleteUser(Integer id);
}