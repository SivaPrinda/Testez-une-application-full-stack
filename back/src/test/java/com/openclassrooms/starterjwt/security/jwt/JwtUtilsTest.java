package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.lang.reflect.Field;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtUtilsTest {

    @InjectMocks
    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDetailsImpl userDetails;

    private final String jwtSecret = "testSecretKey"; // Mock secret key
    private final int jwtExpirationMs = 1000 * 60 * 10; // 10 minutes expiration
    private String testToken;

    @BeforeEach
    void setUp() throws Exception {
        // Given - JWT utility setup with a mock secret key and expiration time
        setPrivateField(jwtUtils, "jwtSecret", jwtSecret);
        setPrivateField(jwtUtils, "jwtExpirationMs", jwtExpirationMs);

        // Generate a test JWT
        testToken = Jwts.builder()
                .setSubject("testUser")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    // Helper method to modify private fields using Reflection
    private void setPrivateField(Object target, String fieldName, Object value) throws Exception {
        Field field = JwtUtils.class.getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    @Test
    void generateJwtToken_ShouldReturnValidToken() {
        // Given - Mocked authentication and user details
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("testUser");

        // When - The generateJwtToken method is called
        String token = jwtUtils.generateJwtToken(authentication);

        // Then - The generated token should be valid and not empty
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
    }

    @Test
    void getUserNameFromJwtToken_ShouldReturnCorrectUsername() {
        // When - The getUserNameFromJwtToken method is called
        String username = jwtUtils.getUserNameFromJwtToken(testToken);

        // Then - The returned username should match the expected username
        assertThat(username).isEqualTo("testUser");
    }

    @Test
    void validateJwtToken_ShouldReturnTrue_WhenTokenIsValid() {
        // When - The validateJwtToken method is called with a valid token
        boolean isValid = jwtUtils.validateJwtToken(testToken);

        // Then - The result should be true
        assertThat(isValid).isTrue();
    }

    @Test
    void validateJwtToken_ShouldReturnFalse_WhenTokenIsMalformed() {
        // When - The validateJwtToken method is called with a malformed token
        boolean isValid = jwtUtils.validateJwtToken("invalid.token.format");

        // Then - The result should be false
        assertThat(isValid).isFalse();
    }

    @Test
    void validateJwtToken_ShouldReturnFalse_WhenTokenIsExpired() {
        // Given - An expired JWT token
        String expiredToken = Jwts.builder()
                .setSubject("testUser")
                .setIssuedAt(new Date(System.currentTimeMillis() - 10000)) // Issued 10 sec ago
                .setExpiration(new Date(System.currentTimeMillis() - 5000)) // Expired 5 sec ago
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        // When - The validateJwtToken method is called with the expired token
        boolean isValid = jwtUtils.validateJwtToken(expiredToken);

        // Then - The result should be false
        assertThat(isValid).isFalse();
    }

    @Test
    void validateJwtToken_ShouldReturnFalse_WhenTokenHasInvalidSignature() {
        // Given - A JWT token with an invalid signature
        String invalidSignatureToken = Jwts.builder()
                .setSubject("testUser")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, "wrongSecretKey") // Different secret
                .compact();

        // When - The validateJwtToken method is called
        boolean isValid = jwtUtils.validateJwtToken(invalidSignatureToken);

        // Then - The result should be false
        assertThat(isValid).isFalse();
    }
}
