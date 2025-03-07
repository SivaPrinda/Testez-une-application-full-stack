package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class UserControllerIT {

    @Mock
    private UserService userService;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserController userController;

    private User user;
    private UserDto userDto;

    @BeforeEach
    public void setUp() {
        // Crée un utilisateur mock
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
    }

    @Test
    public void testFindById_Success() {
        // Simule la réponse du service
        when(userService.findById(1L)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        // Appelle la méthode du contrôleur
        ResponseEntity<?> response = userController.findById("1");

        // Vérifie que la réponse a le bon statut et le bon contenu
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testFindById_NotFound() {
        // Simule que l'utilisateur n'existe pas
        when(userService.findById(1L)).thenReturn(null);

        // Appelle la méthode du contrôleur
        ResponseEntity<?> response = userController.findById("1");

        // Vérifie que la réponse est un "Not Found" (404)
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testFindById_BadRequest() {
        // Teste un cas où l'ID est invalide
        ResponseEntity<?> response = userController.findById("invalid");

        // Vérifie que la réponse est un "Bad Request" (400)
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void testDeleteUser_Success() {
        // Simuler l'authentification de l'utilisateur
        UserDetails userDetails = Mockito.mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(userDetails, null));

        // Simuler le service et mapper
        when(userService.findById(1L)).thenReturn(user);

        // Appel de la méthode du contrôleur
        ResponseEntity<?> response = userController.save("1");

        // Vérifier la réponse
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Vérifier que la méthode delete() a été appelée sur le service
        verify(userService, times(1)).delete(1L);
    }

    @Test
    public void testDeleteUser_NotFound() {
        // Simule que l'utilisateur n'existe pas
        when(userService.findById(1L)).thenReturn(null);

        // Appelle la méthode du contrôleur
        ResponseEntity<?> response = userController.save("1");

        // Vérifie que la réponse est "Not Found" (404)
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testDeleteUser_Unauthorized() {
        // Simuler l'authentification d'un utilisateur différent
        UserDetails userDetails = Mockito.mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("otheruser@example.com"); // utilisateur non autorisé
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(userDetails, null));

        // Simuler l'utilisateur à supprimer
        User userToDelete = new User();
        userToDelete.setId(1L);
        userToDelete.setEmail("test@example.com");

        when(userService.findById(1L)).thenReturn(userToDelete);

        // Appel de la méthode du contrôleur
        ResponseEntity<?> response = userController.save("1");

        // Vérifier la réponse Unauthorized (401)
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    public void testDeleteUser_BadRequest() {
        // Teste un cas où l'ID est invalide
        ResponseEntity<?> response = userController.save("invalid");

        // Vérifie que la réponse est un "Bad Request" (400)
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}