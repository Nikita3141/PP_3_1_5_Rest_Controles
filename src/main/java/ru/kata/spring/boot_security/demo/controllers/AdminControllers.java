package ru.kata.spring.boot_security.demo.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;

import javax.validation.Valid;
import java.security.Principal;
import java.util.Optional;

@Controller
@RequestMapping("/admin")
public class AdminControllers {


    private UserService userService;
    private RoleService roleService;

    @Autowired
    public AdminControllers(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService= roleService;
    }

    @GetMapping("/users")
    public String adminPage( Model model, Principal principal ) {
        User user = userService.findByUsername(principal.getName());
        model.addAttribute("users", userService.findAll());
        model.addAttribute("roles", roleService.getAllRole());
        model.addAttribute("user", user);
        return "admin/read";
    }

    @GetMapping("/new")
    public String newUser (@ModelAttribute("user")User user, Model model){
        model.addAttribute("roles",roleService.getRole());
        return "admin/create";
    }
    @PostMapping("/add")
    public String create (@ModelAttribute("user") User user){
        userService.save(user);
        return "redirect:/admin/users";
    }
    @DeleteMapping("/delete")
    public String delete (@RequestParam ("id") Long id ){
        userService.delete(id);
        return "redirect:/admin/users";
    }
    @PutMapping("/edit/{id}")
    public String getUserEditForm(@ModelAttribute("user") User user, Model model) {
        userService.save(user);
        return "redirect:/admin/users";
    }
//    @PutMapping("/edit/{id}")
//    public String updateUser(@ModelAttribute("user") User user) {
//        userService.save(user);
//        return "redirect:/admin/users";
//    }


}
