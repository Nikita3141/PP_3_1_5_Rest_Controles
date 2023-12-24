package ru.kata.spring.boot_security.demo.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.ExceptionInfo.ExceptionInfo;
import ru.kata.spring.boot_security.demo.ExceptionInfo.UserWithSuchLoginExist;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class RestControllers {

    private final UserService userService;


    @Autowired
    public RestControllers(UserService userService ) {
        this.userService = userService;

    }
    @GetMapping("/userThis")
    public ResponseEntity<User> userGet (Principal principal){
        User user = userService.findByUsername(principal.getName());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity <List<User>> usersAll(  ) {
        List<User> users = (List<User>) userService.findAll();
        return  new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<User> userId(@RequestParam("id") Long id) {
        User user = userService.findById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/newUser")
    public ResponseEntity<ExceptionInfo> addNewUser (@Valid @RequestBody User user, BindingResult bindingResult){
        if (bindingResult.hasErrors()){
            String err =  getErrorsFromBindingResult(bindingResult);
            return new ResponseEntity<>(new ExceptionInfo(err), HttpStatus.BAD_REQUEST);
        }
        try {
            userService.save(user);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            throw new UserWithSuchLoginExist("User with such login exist");
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ExceptionInfo> deleteUser (@RequestParam("id") Long id){
            userService.delete(id);
            return new ResponseEntity<>(new ExceptionInfo("Usera чикаго"), HttpStatus.OK);
    }

    @PutMapping("/edit")
    public ResponseEntity<ExceptionInfo> updateUser (@RequestParam("id") Long id,
                                                      @RequestBody @Valid User user,
                                                     BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            String err = getErrorsFromBindingResult(bindingResult);
            return new ResponseEntity<>(new ExceptionInfo(err), HttpStatus.BAD_REQUEST);
        }
        try {
            user.setId(id);
            userService.save(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (DataIntegrityViolationException e) {
            throw new UserWithSuchLoginExist("It was not possible to change the user");
        }
    }

    private String getErrorsFromBindingResult (BindingResult bindingResult){
        return bindingResult.getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining(";"));
    }



}
