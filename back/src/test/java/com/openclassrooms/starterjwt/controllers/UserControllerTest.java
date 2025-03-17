package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.openclassrooms.starterjwt.dto.UserDto;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserControllerTest {

    private UserController userController;

    @Mock
    private UserService userService;

    @Mock
    private UserMapper userMapper;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userController = new UserController(userService, userMapper);

        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
    }

    @Test
    void findById_ShouldReturnUser_WhenUserExists() {
        // Arrange
        User user = new User();
        user.setId(1L);
        when(userService.findById(1L)).thenReturn(user);
        UserDto mockedUserDto = new UserDto();
        mockedUserDto.setId(1L);
        mockedUserDto.setEmail("test@example.com");
        mockedUserDto.setFirstName("Alice");
        mockedUserDto.setLastName("Doe");
        when(userMapper.toDto(user)).thenReturn(mockedUserDto);

        // Act
        ResponseEntity<?> response = userController.findById("1");

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        UserDto responseBody = (UserDto) response.getBody();
        assertNotNull(responseBody);
        assertEquals(1L, responseBody.getId());
        assertEquals("test@example.com", responseBody.getEmail());
        assertEquals("Alice", responseBody.getFirstName());
        assertEquals("Doe", responseBody.getLastName());
    }

    @Test
    void findById_ShouldReturnNotFound_WhenUserDoesNotExist() {
        // Arrange
        when(userService.findById(1L)).thenReturn(null);

        // Act
        ResponseEntity<?> response = userController.findById("1");

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void findById_ShouldReturnBadRequest_WhenIdIsInvalid() {
        // Act
        ResponseEntity<?> response = userController.findById("invalid");

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void save_ShouldDeleteUser_WhenUserExistsAndAuthorized() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        when(userService.findById(1L)).thenReturn(user);
        when(userDetails.getUsername()).thenReturn("test@example.com");

        // Act
        ResponseEntity<?> response = userController.save("1");

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService).delete(1L);
    }

    @Test
    void save_ShouldReturnUnauthorized_WhenUserExistsButUnauthorized() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setEmail("wrong@example.com");

        when(userService.findById(1L)).thenReturn(user);
        when(userDetails.getUsername()).thenReturn("test@example.com");

        // Act
        ResponseEntity<?> response = userController.save("1");

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(userService, never()).delete(anyLong());
    }

    @Test
    void save_ShouldReturnNotFound_WhenUserDoesNotExist() {
        // Arrange
        when(userService.findById(1L)).thenReturn(null);

        // Act
        ResponseEntity<?> response = userController.save("1");

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(userService, never()).delete(anyLong());
    }

    @Test
    void save_ShouldReturnBadRequest_WhenIdIsInvalid() {
        // Act
        ResponseEntity<?> response = userController.save("invalid");

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(userService, never()).delete(anyLong());
    }
}
