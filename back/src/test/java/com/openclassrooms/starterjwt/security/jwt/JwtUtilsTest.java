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
        //  Use Reflection to Inject Private Fields
        setPrivateField(jwtUtils, "jwtSecret", jwtSecret);
        setPrivateField(jwtUtils, "jwtExpirationMs", jwtExpirationMs);

        //  Generate a test JWT
        testToken = Jwts.builder()
                .setSubject("testUser")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    //  Helper method to modify private fields using Reflection
    private void setPrivateField(Object target, String fieldName, Object value) throws Exception {
        Field field = JwtUtils.class.getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    @Test
    void generateJwtToken_ShouldReturnValidToken() {
        //  Move stubbing inside this test to avoid unnecessary stubbing
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("testUser");

        // Act
        String token = jwtUtils.generateJwtToken(authentication);

        // Assert
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
    }

    @Test
    void getUserNameFromJwtToken_ShouldReturnCorrectUsername() {
        // Act
        String username = jwtUtils.getUserNameFromJwtToken(testToken);

        // Assert
        assertThat(username).isEqualTo("testUser");
    }

    @Test
    void validateJwtToken_ShouldReturnTrue_WhenTokenIsValid() {
        // Act
        boolean isValid = jwtUtils.validateJwtToken(testToken);

        // Assert
        assertThat(isValid).isTrue();
    }

    @Test
    void validateJwtToken_ShouldReturnFalse_WhenTokenIsMalformed() {
        // Act
        boolean isValid = jwtUtils.validateJwtToken("invalid.token.format");

        // Assert
        assertThat(isValid).isFalse();
    }

    @Test
    void validateJwtToken_ShouldReturnFalse_WhenTokenIsExpired() {
        // Arrange: Create an expired token
        String expiredToken = Jwts.builder()
                .setSubject("testUser")
                .setIssuedAt(new Date(System.currentTimeMillis() - 10000)) // Issued 10 sec ago
                .setExpiration(new Date(System.currentTimeMillis() - 5000)) // Expired 5 sec ago
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        // Act
        boolean isValid = jwtUtils.validateJwtToken(expiredToken);

        // Assert
        assertThat(isValid).isFalse();
    }

    @Test
    void validateJwtToken_ShouldReturnFalse_WhenTokenHasInvalidSignature() {
        // Arrange: Create a token with a different secret key
        String invalidSignatureToken = Jwts.builder()
                .setSubject("testUser")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, "wrongSecretKey") // Different secret
                .compact();

        // Act
        boolean isValid = jwtUtils.validateJwtToken(invalidSignatureToken);

        // Assert
        assertThat(isValid).isFalse();
    }
}
