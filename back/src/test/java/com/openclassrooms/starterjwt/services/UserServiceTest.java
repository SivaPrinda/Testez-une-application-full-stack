package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        // Given - A test user is prepared
        user = new User();
        user.setId(1L);
        user.setFirstName("Alice");
        user.setLastName("Johnson");
    }

    @Test
    void findById_WhenUserExists_ShouldReturnUser() {
        // Given - The repository returns the expected user when requested
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // When - The service's findById method is called
        User foundUser = userService.findById(1L);

        // Then - The response should contain the expected user details
        assertNotNull(foundUser);
        assertEquals(1L, foundUser.getId());
        assertEquals("Alice", foundUser.getFirstName());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void findById_WhenUserDoesNotExist_ShouldReturnNull() {
        // Given - The repository returns empty for a non-existent user
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // When - The service's findById method is called
        User foundUser = userService.findById(99L);

        // Then - The response should be null
        assertNull(foundUser);
        verify(userRepository, times(1)).findById(99L);
    }

    @Test
    void delete_ShouldCallRepositoryDeleteById() {
        // Given - The repository will successfully delete the user
        Long userId = 1L;
        doNothing().when(userRepository).deleteById(userId);

        // When - The service's delete method is called
        userService.delete(userId);

        // Then - The repository's deleteById method should be called once
        verify(userRepository, times(1)).deleteById(userId);
    }
}
