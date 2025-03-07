package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.HashSet;

import static org.assertj.core.api.Assertions.assertThat;

class UserDetailsImplTest {

    @Test
    void shouldCreateUserDetailsWithBuilder() {
        // Arrange & Act: Create a UserDetailsImpl instance using the builder
        UserDetailsImpl user = UserDetailsImpl.builder()
                .id(1L)
                .username("testuser")
                .firstName("John")
                .lastName("Doe")
                .admin(true)
                .password("securepassword")
                .build();

        // Assert: Verify the properties are set correctly
        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.getUsername()).isEqualTo("testuser");
        assertThat(user.getFirstName()).isEqualTo("John");
        assertThat(user.getLastName()).isEqualTo("Doe");
        assertThat(user.getPassword()).isEqualTo("securepassword");
        assertThat(user.getAdmin()).isTrue();
    }

    @Test
    void getAuthorities_ShouldReturnEmptyCollection() {
        // Arrange: Create a user instance
        UserDetailsImpl user = UserDetailsImpl.builder().build();

        // Act: Get authorities
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        // Assert: Verify it's an empty collection
        assertThat(authorities).isNotNull();
        assertThat(authorities).isEmpty();
    }

    @Test
    void shouldReturnTrueForAllAccountStatusMethods() {
        // Arrange: Create a user instance
        UserDetailsImpl user = UserDetailsImpl.builder().build();

        // Assert: Verify all account status methods return true
        assertThat(user.isAccountNonExpired()).isTrue();
        assertThat(user.isAccountNonLocked()).isTrue();
        assertThat(user.isCredentialsNonExpired()).isTrue();
        assertThat(user.isEnabled()).isTrue();
    }

    @Test
    void equals_ShouldReturnTrue_ForSameId() {
        // Arrange: Two users with the same ID
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(1L).build();

        // Assert: They should be equal
        assertThat(user1).isEqualTo(user2);
    }

    @Test
    void equals_ShouldReturnFalse_ForDifferentIds() {
        // Arrange: Two users with different IDs
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(2L).build();

        // Assert: They should not be equal
        assertThat(user1).isNotEqualTo(user2);
    }

    @Test
    void equals_ShouldReturnFalse_WhenComparingWithNull() {
        // Arrange: Create a user instance
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();

        // Assert: The user should not be equal to null
        assertThat(user).isNotEqualTo(null);
    }

    @Test
    void equals_ShouldReturnFalse_WhenComparingWithDifferentClass() {
        // Arrange: Create a user instance
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();

        // Assert: The user should not be equal to an object of a different class
        assertThat(user).isNotEqualTo("randomString");
    }
}
