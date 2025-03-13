package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.HashSet;

import static org.assertj.core.api.Assertions.assertThat;

class UserDetailsImplTest {

    @Test
    void shouldCreateUserDetailsWithBuilder() {
        // Given - A UserDetailsImpl instance is created with specific properties
        UserDetailsImpl user = UserDetailsImpl.builder()
                .id(1L)
                .username("testuser")
                .firstName("John")
                .lastName("Doe")
                .admin(true)
                .password("securepassword")
                .build();

        // Then - The properties should be set correctly
        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.getUsername()).isEqualTo("testuser");
        assertThat(user.getFirstName()).isEqualTo("John");
        assertThat(user.getLastName()).isEqualTo("Doe");
        assertThat(user.getPassword()).isEqualTo("securepassword");
        assertThat(user.getAdmin()).isTrue();
    }

    @Test
    void getAuthorities_ShouldReturnEmptyCollection() {
        // Given - A user instance with no authorities
        UserDetailsImpl user = UserDetailsImpl.builder().build();

        // When - The getAuthorities method is called
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        // Then - The response should be an empty collection
        assertThat(authorities).isNotNull();
        assertThat(authorities).isEmpty();
    }

    @Test
    void shouldReturnTrueForAllAccountStatusMethods() {
        // Given - A user instance
        UserDetailsImpl user = UserDetailsImpl.builder().build();

        // Then - All account status methods should return true
        assertThat(user.isAccountNonExpired()).isTrue();
        assertThat(user.isAccountNonLocked()).isTrue();
        assertThat(user.isCredentialsNonExpired()).isTrue();
        assertThat(user.isEnabled()).isTrue();
    }

    @Test
    void equals_ShouldReturnTrue_ForSameId() {
        // Given - Two user instances with the same ID
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(1L).build();

        // Then - They should be considered equal
        assertThat(user1).isEqualTo(user2);
    }

    @Test
    void equals_ShouldReturnFalse_ForDifferentIds() {
        // Given - Two user instances with different IDs
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(2L).build();

        // Then - They should not be considered equal
        assertThat(user1).isNotEqualTo(user2);
    }

    @Test
    void equals_ShouldReturnFalse_WhenComparingWithNull() {
        // Given - A user instance
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();

        // Then - The user should not be equal to null
        assertThat(user).isNotEqualTo(null);
    }

    @Test
    void equals_ShouldReturnFalse_WhenComparingWithDifferentClass() {
        // Given - A user instance
        UserDetailsImpl user = UserDetailsImpl.builder().id(1L).build();

        // Then - The user should not be equal to an object of a different class
        assertThat(user).isNotEqualTo("randomString");
    }
}
