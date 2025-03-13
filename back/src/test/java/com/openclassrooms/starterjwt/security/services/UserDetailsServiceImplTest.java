package com.openclassrooms.starterjwt.security.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    private User testUser;

    @BeforeEach
    void setUp() {
        // Given - A test user is prepared with sample data
        testUser = new User(
                "test@example.com",
                "Doe",
                "John",
                "securePassword",
                false
        );
        testUser.setId(1L);
    }

    @Test
    void loadUserByUsername_ShouldReturnUserDetails_WhenUserExists() {
        // Given - The repository returns a user when queried with a valid email
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));

        // When - The service's loadUserByUsername method is called with a valid email
        UserDetails userDetails = userDetailsService.loadUserByUsername(testUser.getEmail());

        // Then - The response should contain the expected user details
        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo(testUser.getEmail());
        assertThat(userDetails.getPassword()).isEqualTo(testUser.getPassword());
        verify(userRepository, times(1)).findByEmail(testUser.getEmail());
    }

    @Test
    void loadUserByUsername_ShouldThrowException_WhenUserNotFound() {
        // Given - The repository returns empty when queried with an unknown email
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        // When - The service's loadUserByUsername method is called with an unknown email
        // Act & Assert
        assertThrows(UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername("unknown@example.com"),
                "User Not Found with email: unknown@example.com"
        );

        // Then - A UsernameNotFoundException should be thrown
        verify(userRepository, times(1)).findByEmail("unknown@example.com");
    }
}
